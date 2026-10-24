import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import { sanitizeAiErrorMessage } from "@/src/utils/aiErrorSanitizer";
import {
  ILabReport,
  ILabReportFilters,
  ILabReportListResponse,
} from "@/src/types/labReport.type";

const getHeaders = async (isJson = true) => {
  const token = await getAuthToken();
  return {
    ...(isJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const labReportService = {
  /**
   * 1. Upload & Analyze Lab Report via Multimodal AI
   */
  analyzeReport: async (
    file: File,
    appointmentId?: string,
    reportName?: string
  ): Promise<{ success: boolean; data?: ILabReport; message?: string }> => {
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append("file", file);
      if (appointmentId) formData.append("appointmentId", appointmentId);
      if (reportName) formData.append("reportName", reportName);

      const res = await fetch(`${API_BASE_URL}/lab-reports/analyze`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || json.success === false) {
        throw new Error(sanitizeAiErrorMessage(json.message || "Failed to analyze lab report"));
      }
      return { success: true, data: json.data, message: json.message };
    } catch (err: any) {
      return {
        success: false,
        message: sanitizeAiErrorMessage(err),
      };
    }
  },

  /**
   * 2. Fetch Patient Lab Reports with Filters & Pagination
   */
  getMyReports: async (
    filters: ILabReportFilters = {}
  ): Promise<{
    success: boolean;
    data: ILabReport[];
    meta?: ILabReportListResponse["meta"];
    message?: string;
  }> => {
    try {
      const headers = await getHeaders();
      const query = new URLSearchParams();
      if (filters.page) query.append("page", String(filters.page));
      if (filters.limit) query.append("limit", String(filters.limit));
      if (filters.reportType && filters.reportType !== "ALL") {
        query.append("reportType", filters.reportType);
      }
      if (filters.urgency && filters.urgency !== "ALL") {
        query.append("urgency", filters.urgency);
      }
      if (filters.searchTerm) query.append("searchTerm", filters.searchTerm);
      if (filters.sortBy) query.append("sortBy", filters.sortBy);
      if (filters.sortOrder) query.append("sortOrder", filters.sortOrder);

      const qs = query.toString();
      const url = `${API_BASE_URL}/lab-reports/my-reports${qs ? `?${qs}` : ""}`;

      const res = await fetch(url, { method: "GET", headers, cache: "no-store" });
      const json = await res.json();

      return {
        success: json.success ?? res.ok,
        data: json.data || [],
        meta: json.meta || {
          page: filters.page || 1,
          limit: filters.limit || 10,
          total: json.data?.length || 0,
        },
        message: json.message,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err?.message || "Failed to fetch lab reports",
      };
    }
  },

  /**
   * 3. Fetch Single Report by ID
   */
  getReportById: async (
    id: string
  ): Promise<{ success: boolean; data?: ILabReport; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/lab-reports/${id}`, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, data: json.data, message: json.message };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Failed to fetch report details",
      };
    }
  },

  /**
   * 4. In-Consultation: Fetch Reports Linked to an Appointment
   */
  getAppointmentReports: async (
    appointmentId: string
  ): Promise<{ success: boolean; data: ILabReport[]; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(
        `${API_BASE_URL}/lab-reports/appointment/${appointmentId}`,
        { method: "GET", headers, cache: "no-store" }
      );
      const json = await res.json();
      return {
        success: json.success ?? res.ok,
        data: Array.isArray(json.data) ? json.data : json.data ? [json.data] : [],
        message: json.message,
      };
    } catch (err: any) {
      return {
        success: false,
        data: [],
        message: err?.message || "Failed to fetch appointment lab reports",
      };
    }
  },

  /**
   * 5. Link Existing Lab Report to Appointment
   */
  linkReportToAppointment: async (
    reportId: string,
    appointmentId: string
  ): Promise<{ success: boolean; data?: ILabReport; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(
        `${API_BASE_URL}/lab-reports/${reportId}/link-appointment`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({ appointmentId }),
        }
      );
      const json = await res.json();
      return { success: json.success ?? res.ok, data: json.data, message: json.message };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Failed to link report to appointment",
      };
    }
  },

  /**
   * 6. Delete Lab Report
   */
  deleteReport: async (
    id: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/lab-reports/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      return { success: json.success ?? res.ok, message: json.message };
    } catch (err: any) {
      return {
        success: false,
        message: err?.message || "Failed to delete lab report",
      };
    }
  },
};
