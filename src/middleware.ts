import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

// 1. Missing Types
type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

interface DecodedToken {
  role: UserRole;
  exp: number;
  emailVerified?: boolean;
  needPasswordChange?: boolean;
  email?: string;
}

// 2. Route Configurations
const AuthRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];
const CommonRoutes = ["/profile", "/change-password"];
const RoleBasedRoutes = {
  PATIENT: [/^\/dashboard($|\/)/],
  DOCTOR: [/^\/doctor($|\/)/],
  ADMIN: [/^\/admin($|\/)/],
};

// 3. Helper Functions

const isAuthRoute = (pathname: string) =>
  AuthRoutes.some((route) => pathname.startsWith(route));

const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
  if (CommonRoutes.some((route) => pathname.startsWith(route))) return "COMMON";

  for (const [role, regexes] of Object.entries(RoleBasedRoutes)) {
    if (regexes.some((regex) => regex.test(pathname))) {
      return role as UserRole;
    }
  }
  return null; // Null means it's a public route
};

const getDefaultDashboardRoute = (role: UserRole) => {
  if (role === "SUPER_ADMIN" || role === "ADMIN") return "/admin/dashboard";
  if (role === "DOCTOR") return "/doctor/dashboard";
  return "/dashboard";
};

const isTokenExpiringSoon = (decodedToken: DecodedToken) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp - currentTime < 300; // less than 5 minutes
};

// Next.js Middleware runs in Edge runtime, so making a fetch call to DB here for every request is slow.
// Best practice: The backend should include `emailVerified` and `needPasswordChange` in the JWT payload.
const getUserInfo = async (token: string) => {
  const decoded = jwtDecode<DecodedToken>(token);
  return {
    emailVerified: decoded.emailVerified ?? true, // Fallback safely if backend doesn't send it yet
    needPasswordChange: decoded.needPasswordChange ?? false,
    email: decoded.email ?? "",
  };
};

async function refreshTokenMiddleware(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `refreshToken=${refreshToken}`, // Backend expects it in cookies
        },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.data?.accessToken || null;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken: DecodedToken | null = null;
    let isValidAccessToken = false;
    let newAccessTokenWasFetched = false;

    // Helper to decode token
    const decodeAndVerify = (token: string) => {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp > currentTime) {
          return { isValid: true, decoded };
        }
      } catch (error) {}
      return { isValid: false, decoded: null };
    };

    if (accessToken) {
      const { isValid, decoded } = decodeAndVerify(accessToken);
      isValidAccessToken = isValid;
      decodedAccessToken = decoded;
    }

    // proactively refresh token if needed
    if (
      refreshToken &&
      (!accessToken || !isValidAccessToken || (decodedAccessToken && isTokenExpiringSoon(decodedAccessToken)))
    ) {
      const refreshedAccessToken = await refreshTokenMiddleware(refreshToken);
      
      if (refreshedAccessToken) {
        accessToken = refreshedAccessToken; // Update our local variable for the rest of the rules!
        const { isValid, decoded } = decodeAndVerify(accessToken);
        isValidAccessToken = isValid;
        decodedAccessToken = decoded;
        newAccessTokenWasFetched = true;
      }
    }

    let userRole: UserRole | null = null;
    if (decodedAccessToken?.role) {
      userRole = decodedAccessToken.role === "SUPER_ADMIN" ? "ADMIN" : decodedAccessToken.role;
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Rule - 1 : User is logged in and trying to access auth route -> redirect to dashboard
    if (isAuth && isValidAccessToken && userRole) {
      if (pathname !== "/reset-password" && pathname !== "/verify-email") {
        const response = NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken!);
        return response;
      }
    }

    // Rule - 2 : User is trying to access reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      if (accessToken && email) {
        const userInfo = await getUserInfo(accessToken);
        if (userInfo.needPasswordChange) {
           const response = NextResponse.next();
           if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
           return response;
        } else if (userRole) {
          const response = NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
          if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
          return response;
        }
      }

      if (email) {
         const response = NextResponse.next();
         if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
         return response;
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
      return response;
    }

    // Rule-3 User trying to access Public route -> allow
    if (routerOwner === null && !isAuth) {
      const response = NextResponse.next();
      if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
      return response;
    }

    // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      if (isAuth) {
         const response = NextResponse.next(); // Allow accessing login page
         // even if not logged in, if we fetched a token (unlikely here but safe), set it
         if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
         return response;
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
      return response;
    }

    // Rule - Enforcing user to stay in reset password or verify email page if flags are true
    if (accessToken && isValidAccessToken && userRole) {
      const userInfo = await getUserInfo(accessToken);

      // need email verification scenario
      if (userInfo.emailVerified === false) {
        if (pathname !== "/verify-email") {
          const verifyEmailUrl = new URL("/verify-email", request.url);
          if (userInfo.email) verifyEmailUrl.searchParams.set("email", userInfo.email);
          const response = NextResponse.redirect(verifyEmailUrl);
          if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
          return response;
        }
        const response = NextResponse.next();
        if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
        return response;
      }

      if (userInfo.emailVerified && pathname === "/verify-email") {
        const response = NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
        return response;
      }

      // need password change scenario
      if (userInfo.needPasswordChange) {
        if (pathname !== "/reset-password") {
          const resetPasswordUrl = new URL("/reset-password", request.url);
          if (userInfo.email) resetPasswordUrl.searchParams.set("email", userInfo.email);
          const response = NextResponse.redirect(resetPasswordUrl);
          if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
          return response;
        }
        const response = NextResponse.next();
        if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
        return response;
      }

      if (!userInfo.needPasswordChange && pathname === "/reset-password") {
        const response = NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url));
        if (newAccessTokenWasFetched) response.cookies.set("accessToken", accessToken);
        return response;
      }
    }

    // Rule - 5 User trying to access Common protected route -> allow
    if (routerOwner === "COMMON") {
      const response = NextResponse.next();
      if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
      return response;
    }

    // Rule-6 User trying to visit role based protected but doesn't have required role
    if (
      routerOwner === "ADMIN" ||
      routerOwner === "DOCTOR" ||
      routerOwner === "PATIENT"
    ) {
      if (routerOwner !== userRole) {
        const response = NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        if (newAccessTokenWasFetched && accessToken) response.cookies.set("accessToken", accessToken);
        return response;
      }
    }

    const response = NextResponse.next();
    if (newAccessTokenWasFetched && accessToken) {
       // Attach the new access token to the final response so the browser saves it
       response.cookies.set("accessToken", accessToken, {
           httpOnly: false, // The frontend usually needs to access it for client API calls
           secure: process.env.NODE_ENV === "production",
           sameSite: "lax",
           path: "/",
       });
       
       // Also modify the request headers so downstream Server Components/Actions have the new token
       response.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return response;
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
