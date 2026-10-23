import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  INotification,
  INotificationPreference,
  INotificationFilters,
  INotificationListResponse,
  IUnreadCountResponse,
} from "@/src/types/notification.type";

const getHeaders = async () => {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const notificationService = {
  /**
   * 1. Ultra-fast Unread Count (< 2ms DB Index Hit)
   */
  getUnreadCount: async (): Promise<{ success: boolean; data?: IUnreadCountResponse; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to load unread count" };
    }
  },

  /**
   * 2. Paginated Notification History with Filters
   */
  getNotifications: async (
    filters: INotificationFilters = {}
  ): Promise<{ success: boolean; data: INotification[]; meta?: INotificationListResponse["meta"]; message?: string }> => {
    try {
      const headers = await getHeaders();
      const query = new URLSearchParams();
      if (filters.page) query.append("page", String(filters.page));
      if (filters.limit) query.append("limit", String(filters.limit));
      if (filters.searchTerm) query.append("searchTerm", filters.searchTerm);
      if (filters.type) query.append("type", filters.type);
      if (filters.isRead !== undefined && filters.isRead !== "") query.append("isRead", String(filters.isRead));
      if (filters.sortBy) query.append("sortBy", filters.sortBy);
      if (filters.sortOrder) query.append("sortOrder", filters.sortOrder);

      const qs = query.toString();
      const url = `${API_BASE_URL}/notifications${qs ? `?${qs}` : ""}`;

      const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
      const json = await res.json();
      return {
        success: json.success ?? res.ok,
        data: json.data || [],
        meta: json.meta || { page: filters.page || 1, limit: filters.limit || 10, total: json.data?.length || 0 },
        message: json.message,
      };
    } catch (err: any) {
      return { success: false, data: [], message: err?.message || "Failed to load notifications" };
    }
  },

  /**
   * 3. Mark specific notification as read
   */
  markAsRead: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers,
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to mark as read" };
    }
  },

  /**
   * 4. Mark all as read
   */
  markAllAsRead: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/mark-all-as-read`, {
        method: "PATCH",
        headers,
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to mark all as read" };
    }
  },

  /**
   * 5. Delete specific notification
   */
  deleteNotification: async (id: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to delete notification" };
    }
  },

  /**
   * 6. Clear all notifications
   */
  clearAllNotifications: async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/clear-all`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to clear notifications" };
    }
  },

  /**
   * 7. Get notification preferences
   */
  getPreferences: async (): Promise<{ success: boolean; data?: INotificationPreference; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to load preferences" };
    }
  },

  /**
   * 8. Update notification preferences
   */
  updatePreferences: async (
    payload: Partial<INotificationPreference>
  ): Promise<{ success: boolean; data?: INotificationPreference; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/notifications/preferences`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, data: json.data, message: json.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Failed to update preferences" };
    }
  },
};
