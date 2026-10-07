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
const CommonRoutes = ["/dashboard", "/profile", "/change-password"];
const RoleBasedRoutes = {
  PATIENT: [/^\/dashboard/],
  DOCTOR: [/^\/doctor/],
  ADMIN: [/^\/admin/],
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

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    // Calling backend API to refresh token
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );
    return res.ok;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

// Ensure the function is named 'middleware' and exported as default or named export 'middleware'
export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken: DecodedToken | null = null;
    let isValidAccessToken = false;

    // We use jwt-decode here because standard 'jsonwebtoken' (jwtUtils) uses Node.js crypto,
    // which DOES NOT work in Next.js Edge Runtime (where middleware runs).
    if (accessToken) {
      try {
        decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedAccessToken.exp > currentTime) {
          isValidAccessToken = true;
        }
      } catch (error) {
        isValidAccessToken = false;
      }
    }

    let userRole: UserRole | null = null;

    if (decodedAccessToken?.role) {
      // Unify SUPER_ADMIN and ADMIN role
      userRole =
        decodedAccessToken.role === "SUPER_ADMIN"
          ? "ADMIN"
          : decodedAccessToken.role;
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // proactively refresh token if refresh token exists and access token is expired or about to expire
    if (
      refreshToken &&
      decodedAccessToken &&
      (!isValidAccessToken || isTokenExpiringSoon(decodedAccessToken))
    ) {
      const requestHeaders = new Headers(request.headers);
      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);

        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }

      return response;
    }

    // Rule - 1 : User is logged in and trying to access auth route -> redirect to dashboard
    if (isAuth && isValidAccessToken && userRole) {
      // Allow them to visit reset-password if they HAVE to (handled below)
      if (pathname !== "/reset-password" && pathname !== "/verify-email") {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }
    }

    // Rule - 2 : User is trying to access reset password page
    if (pathname === "/reset-password") {
      const email = request.nextUrl.searchParams.get("email");

      if (accessToken && email) {
        const userInfo = await getUserInfo(accessToken);
        if (userInfo.needPasswordChange) {
          return NextResponse.next();
        } else if (userRole) {
          return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole), request.url),
          );
        }
      }

      if (email) {
        return NextResponse.next();
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule-3 User trying to access Public route -> allow
    if (routerOwner === null && !isAuth) {
      return NextResponse.next();
    }

    // Rule - 4 User is Not logged in but trying to access protected route -> redirect to login
    if (!accessToken || !isValidAccessToken) {
      if (isAuth) return NextResponse.next(); // Allow accessing login page

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Rule - Enforcing user to stay in reset password or verify email page if flags are true
    if (accessToken && isValidAccessToken && userRole) {
      const userInfo = await getUserInfo(accessToken);

      // need email verification scenario
      if (userInfo.emailVerified === false) {
        if (pathname !== "/verify-email") {
          const verifyEmailUrl = new URL("/verify-email", request.url);
          if (userInfo.email)
            verifyEmailUrl.searchParams.set("email", userInfo.email);
          return NextResponse.redirect(verifyEmailUrl);
        }
        return NextResponse.next();
      }

      if (userInfo.emailVerified && pathname === "/verify-email") {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }

      // need password change scenario
      if (userInfo.needPasswordChange) {
        if (pathname !== "/reset-password") {
          const resetPasswordUrl = new URL("/reset-password", request.url);
          if (userInfo.email)
            resetPasswordUrl.searchParams.set("email", userInfo.email);
          return NextResponse.redirect(resetPasswordUrl);
        }
        return NextResponse.next();
      }

      if (!userInfo.needPasswordChange && pathname === "/reset-password") {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole), request.url),
        );
      }
    }

    // Rule - 5 User trying to access Common protected route -> allow
    if (routerOwner === "COMMON") {
      return NextResponse.next();
    }

    // Rule-6 User trying to visit role based protected but doesn't have required role
    if (
      routerOwner === "ADMIN" ||
      routerOwner === "DOCTOR" ||
      routerOwner === "PATIENT"
    ) {
      if (routerOwner !== userRole) {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }

    return NextResponse.next();
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
