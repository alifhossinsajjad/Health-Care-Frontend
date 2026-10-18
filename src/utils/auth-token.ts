import { getCookie } from "./cookie";

/**
 * Universal Auth Token Helper
 * Seamlessly retrieves the accessToken whether executed on the Server (Next.js cookies)
 * or on the Client / Browser (Server Action / localStorage / document.cookie).
 */
export const getAuthToken = async (): Promise<string | undefined> => {
  if (typeof window !== "undefined") {
    // Client-side environment
    const local = localStorage.getItem("accessToken");
    if (local) return local;

    try {
      const serverCookie = await getCookie("accessToken");
      if (serverCookie) return serverCookie;
    } catch {
      // Fallback if server action cannot be reached
    }

    if (typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
      if (match) return match[1];
    }
    return undefined;
  }

  // Server-side environment
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    return cookieStore.get("accessToken")?.value;
  } catch (error: any) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE") {
      throw error;
    }
    return undefined;
  }
};
