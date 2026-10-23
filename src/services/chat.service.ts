import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  IChatHistoryResponse,
  IUnreadCountResponse,
  IChatAttachment,
} from "@/src/types/chat.type";

export const chatService = {
  /**
   * Fetch paginated chat history for a specific appointment consultation room
   */
  getChatHistory: async (
    appointmentId: string,
    page = 1,
    limit = 50
  ): Promise<{
    success: boolean;
    data: IChatHistoryResponse["data"];
    meta?: IChatHistoryResponse["meta"];
    message?: string;
  }> => {
    try {
      const accessToken = await getAuthToken();
      if (!accessToken) {
        return { success: false, data: [], message: "Not authenticated" };
      }

      const res = await fetch(
        `${API_BASE_URL}/chat/${appointmentId}?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          cache: "no-store",
        }
      );

      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          success: false,
          data: [],
          message: json.message || "Failed to load chat history",
        };
      }

      return {
        success: true,
        data: json.data || [],
        meta: json.meta || { page, limit, total: json.data?.length || 0 },
      };
    } catch (err: any) {
      console.error("getChatHistory error:", err);
      return {
        success: false,
        data: [],
        message: err?.message || "Network error loading chat history",
      };
    }
  },

  /**
   * Mark all unread messages in an appointment as read
   */
  markMessagesAsRead: async (
    appointmentId: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const accessToken = await getAuthToken();
      if (!accessToken) return { success: false, message: "Not authenticated" };

      const res = await fetch(`${API_BASE_URL}/chat/${appointmentId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const json = await res.json();
      return {
        success: json.success ?? res.ok,
        message: json.message,
      };
    } catch (err: any) {
      console.error("markMessagesAsRead error:", err);
      return { success: false, message: err?.message || "Failed to mark as read" };
    }
  },

  /**
   * Fetch unread message badges count across all appointments
   */
  getUnreadCount: async (): Promise<{
    success: boolean;
    data?: IUnreadCountResponse;
    message?: string;
  }> => {
    try {
      const accessToken = await getAuthToken();
      if (!accessToken) return { success: false, message: "Not authenticated" };

      const res = await fetch(`${API_BASE_URL}/chat/unread-count`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      });

      const json = await res.json();
      return {
        success: json.success ?? res.ok,
        data: json.data,
        message: json.message,
      };
    } catch (err: any) {
      console.error("getUnreadCount error:", err);
      return { success: false, message: err?.message || "Failed to get unread count" };
    }
  },

  /**
   * Upload an attachment file (Image, PDF, Audio, Video) to Cloudinary via backend
   * Maximum file size: 10MB guardrail
   */
  uploadChatAttachment: async (
    appointmentId: string,
    file: File
  ): Promise<{
    success: boolean;
    data?: IChatAttachment;
    message?: string;
  }> => {
    try {
      // 1. Guardrail: 10MB Limit
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return {
          success: false,
          message: "File exceeds maximum permitted size of 10MB.",
        };
      }

      const accessToken = await getAuthToken();
      if (!accessToken) return { success: false, message: "Not authenticated" };

      const formData = new FormData();
      const ext = file.type?.includes("mp4") ? "m4a" : file.type?.includes("audio") ? "webm" : "";
      const defaultName = ext ? `voice-message-${Date.now()}.${ext}` : "attachment";
      formData.append("file", file, file.name || defaultName);

      const res = await fetch(
        `${API_BASE_URL}/chat/${appointmentId}/attachment`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const json = await res.json();
      if (!res.ok || !json.success) {
        return {
          success: false,
          message: json.message || "Failed to upload file attachment.",
        };
      }

      return {
        success: true,
        data: json.data,
        message: json.message,
      };
    } catch (err: any) {
      console.error("uploadChatAttachment error:", err);
      return {
        success: false,
        message: err?.message || "Network error uploading file attachment",
      };
    }
  },
};
