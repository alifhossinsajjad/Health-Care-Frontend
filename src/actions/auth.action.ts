"use server";

import {
  ILoginPayload,
  loginZodSchema,
  IRegisterPayload,
  registerZodSchema,
  IVerifyEmailPayload,
  verifyEmailZodSchema,
  IForgotPasswordPayload,
  forgotPasswordZodSchema,
  IResetPasswordPayload,
  resetPasswordZodSchema,
} from "@/src/zod/auth.validation";
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
    const authHeader =
      response.headers.get("authorization") ||
      response.headers.get("x-access-token");
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
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Internal server error during login";
    return { success: false, message: errorMessage };
  }
};

// ==========================================
// 2. Patient Register Action
// ==========================================
export const registerAction = async (payload: IRegisterPayload) => {
  const parsed = registerZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Registration failed!",
      };
    }
    return { success: true, message: data.message, data: data.data };
  } catch (error: unknown) {
    console.error("Register Server Action Error:", error);
    return {
      success: false,
      message: "Internal server error during registration",
    };
  }
};

// ==========================================
// 3. Verify Email Action
// ==========================================
export const verifyEmailAction = async (payload: IVerifyEmailPayload) => {
  const parsed = verifyEmailZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Verification failed!",
      };
    }
    return { success: true, message: data.message };
  } catch (error: unknown) {
    console.error("Verify Email Server Action Error:", error);
    return {
      success: false,
      message: "Internal server error during verification",
    };
  }
};

// ==========================================
// 4. Resend OTP Action
// ==========================================
export const resendVerifyOtpAction = async (
  payload: IForgotPasswordPayload,
) => {
  const parsed = forgotPasswordZodSchema.safeParse(payload); // Reusing forgot password schema since it just needs email
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/resend-verification-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      },
    );

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to resend OTP!",
      };
    }
    return { success: true, message: data.message };
  } catch (error: unknown) {
    console.error("Resend OTP Server Action Error:", error);
    return {
      success: false,
      message: "Internal server error during OTP resend",
    };
  }
};

// ==========================================
// 5. Forgot Password Action (Also used for resend forgot pass OTP)
// ==========================================
export const forgotPasswordAction = async (payload: IForgotPasswordPayload) => {
  const parsed = forgotPasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to send reset link!",
      };
    }
    return { success: true, message: data.message };
  } catch (error: unknown) {
    console.error("Forgot Password Server Action Error:", error);
    return {
      success: false,
      message: "Internal server error during forgot password",
    };
  }
};

// ==========================================
// 6. Reset Password Action
// ==========================================
export const resetPasswordAction = async (payload: IResetPasswordPayload) => {
  const parsed = resetPasswordZodSchema.safeParse(payload);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to reset password!",
      };
    }
    return { success: true, message: data.message };
  } catch (error: unknown) {
    console.error("Reset Password Server Action Error:", error);
    return {
      success: false,
      message: "Internal server error during password reset",
    };
  }
};

// ==========================================
// 7. Logout Action
// ==========================================
import { cookies } from "next/headers";

export const logoutAction = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (refreshToken) {
      // Best effort backend logout call
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `refreshToken=${refreshToken}`,
        },
      }).catch((err) => console.error("Backend logout error", err));
    }
  } catch (error) {
    console.error("Logout Server Action Error:", error);
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    return { success: true };
  }
};
