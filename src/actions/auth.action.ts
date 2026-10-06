"use server";

import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { setTokenInCookies } from "@/src/utils/token";

import { API_BASE_URL } from "@/src/lib/axiosInstance";

export const loginAction = async (payload: ILoginPayload) => {
  // 1. Validate payload securely on the server
  const parsed = loginZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    // 2. We use native fetch here instead of httpClient because we specifically
    // need to intercept the raw Set-Cookie headers coming from the backend.
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, message: data.message || "Login failed!" };
    }

    // 3. Save the accessToken from Backend Headers to Next.js cookies
    const authHeader = response.headers.get("authorization") || response.headers.get("x-access-token");
    let accessToken = "";
    
    if (authHeader) {
      accessToken = authHeader.replace("Bearer ", "");
      await setTokenInCookies("accessToken", accessToken);
    } else if (data.data?.accessToken) {
      // Fallback if it's in the body
      accessToken = data.data.accessToken;
      await setTokenInCookies("accessToken", accessToken);
    }

    // 4. Forward HttpOnly cookies (like refreshToken, better-auth-session) from Backend -> Next.js -> Browser
    const setCookieHeaders = response.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      for (const cookieStr of setCookieHeaders) {
        // Parse the cookie string (e.g., "refreshToken=abc; HttpOnly; Path=/")
        const parts = cookieStr.split(";");
        const [nameValue] = parts;
        const [name, value] = nameValue.split("=");

        if (name && value) {
          await setTokenInCookies(name.trim(), value);
        }
      }
    }

    // Return success and the token to the client component so it can save to localStorage
    return { success: true, message: "Logged in successfully!", accessToken };
  } catch (error: unknown) {
    console.error("Login Server Action Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error during login";
    return { success: false, message: errorMessage };
  }
};
