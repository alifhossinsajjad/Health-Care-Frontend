import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  IRequestLogFilters,
  IRequestLogResponse,
} from "@/src/types/request-log.type";

/**
 * Fetch all system audit & HTTP request logs with server-side filtering
 */
export const getRequestLogs = async (
  filters: IRequestLogFilters = {},
): Promise<IRequestLogResponse> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Not authenticated",
        data: [],
      };
    }

    const params = new URLSearchParams();
    if (filters.page) params.append("page", String(filters.page));
    if (filters.limit) params.append("limit", String(filters.limit));
    if (filters.method) params.append("method", filters.method);
    if (filters.statusCode) params.append("statusCode", String(filters.statusCode));
    if (filters.search) params.append("search", filters.search);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `${API_BASE_URL}/admin/request-logs${queryString}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch request logs",
        data: [],
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data || [],
      meta: data.meta,
    };
  } catch (error: any) {
    console.error("Get Request Logs Error:", error);
    return {
      success: false,
      message: error?.message || "Internal server error fetching logs",
      data: [],
    };
  }
};

/**
 * Delete a single request log entry by ID (SUPER_ADMIN only)
 */
export const deleteRequestLog = async (
  id: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${API_BASE_URL}/admin/request-logs/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message || (res.ok ? "Log deleted successfully" : "Failed to delete log"),
    };
  } catch (error: any) {
    console.error("Delete Request Log Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to delete log",
    };
  }
};

/**
 * Flush/Clear all recorded request logs from memory buffer (SUPER_ADMIN only)
 */
export const clearAllRequestLogs = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return { success: false, message: "Not authenticated" };
    }

    const res = await fetch(`${API_BASE_URL}/admin/request-logs`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
    });

    const data = await res.json();
    return {
      success: res.ok && data.success,
      message: data.message || (res.ok ? "All logs cleared successfully" : "Failed to clear logs"),
    };
  } catch (error: any) {
    console.error("Clear All Request Logs Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to clear logs buffer",
    };
  }
};
