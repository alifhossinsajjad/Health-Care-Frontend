import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { cookies } from "next/headers";
import { DashboardStats } from "@/src/types/dashboard.types";

export const getDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      // Cache settings for Next.js 15: 
      // Option 1: "no-store" for always real-time without caching.
      // Option 2: { next: { revalidate: 0 } }
      cache: "no-store", 
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, message: data.message || "Failed to fetch stats" };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Dashboard Stats Fetch Error:", error);
    return { success: false, message: "Internal server error fetching stats" };
  }
};
