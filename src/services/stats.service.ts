import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import { DashboardStats } from "@/src/types/dashboard.types";

export const getDashboardStats = async (): Promise<{ success: boolean; data?: DashboardStats; message?: string }> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const response = await fetch(`${API_BASE_URL}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
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
