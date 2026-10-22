import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import { IIceServer, IVideoConsultationLog } from "@/src/types/webrtc.type";

const DEFAULT_STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
];

export const webrtcService = {
  /**
   * Fetch public STUN/TURN servers for WebRTC peer connection
   * Seamlessly falls back to Google's public STUN servers for 100% reliability
   */
  getIceServers: async (): Promise<RTCIceServer[]> => {
    try {
      const accessToken = await getAuthToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const res = await fetch(`${API_BASE_URL}/webrtc/ice-servers`, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        return DEFAULT_STUN_SERVERS;
      }

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }

      return DEFAULT_STUN_SERVERS;
    } catch (err) {
      console.warn("Could not reach backend ice-servers, falling back to Google STUN:", err);
      return DEFAULT_STUN_SERVERS;
    }
  },

  /**
   * Fetch call audit trail & duration logs for a specific appointment
   */
  getCallLogs: async (
    appointmentId: string
  ): Promise<{
    success: boolean;
    data: IVideoConsultationLog[];
    message?: string;
  }> => {
    try {
      const accessToken = await getAuthToken();
      if (!accessToken) {
        return { success: false, data: [], message: "Not authenticated" };
      }

      const res = await fetch(`${API_BASE_URL}/webrtc/${appointmentId}/logs`, {
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
        data: json.data || [],
        message: json.message,
      };
    } catch (err: any) {
      console.error("getCallLogs error:", err);
      return {
        success: false,
        data: [],
        message: err?.message || "Failed to load consultation logs",
      };
    }
  },
};
