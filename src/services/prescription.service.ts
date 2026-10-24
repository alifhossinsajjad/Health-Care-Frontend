import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  ICreatePrescriptionPayload,
  IUpdatePrescriptionPayload,
  IPrescription,
  IPrescriptionListResponse,
} from "@/src/types/prescription.type";

const getHeaders = async () => {
  const token = await getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const prescriptionService = {
  /**
   * 1. Create a new prescription (Doctor only)
   * Auto-completes appointment, generates PDF, and emits consultation:completed
   */
  createPrescription: async (
    payload: ICreatePrescriptionPayload
  ): Promise<{ success: boolean; data?: IPrescription; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/prescriptions`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to create prescription" };
      }
      return { success: true, data: data.data, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Error creating prescription" };
    }
  },

  /**
   * 2. Fetch prescriptions of the logged-in doctor or patient
   */
  getMyPrescriptions: async (params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<IPrescriptionListResponse> => {
    try {
      const headers = await getHeaders();
      const query = new URLSearchParams();
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.sortBy) query.append("sortBy", params.sortBy);
      if (params?.sortOrder) query.append("sortOrder", params.sortOrder);

      const qs = query.toString() ? `?${query.toString()}` : "";
      const res = await fetch(`${API_BASE_URL}/prescriptions/my-prescriptions${qs}`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to fetch prescriptions", data: [] };
      }
      return { success: true, data: data.data || [], meta: data.meta, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Error fetching prescriptions", data: [] };
    }
  },

  /**
   * 3. Fetch all prescriptions for Admin / Super Admin
   */
  getAllPrescriptions: async (params?: {
    page?: number;
    limit?: number;
    email?: string;
  }): Promise<IPrescriptionListResponse> => {
    try {
      const headers = await getHeaders();
      const query = new URLSearchParams();
      if (params?.page) query.append("page", params.page.toString());
      if (params?.limit) query.append("limit", params.limit.toString());
      if (params?.email) query.append("email", params.email);

      const qs = query.toString() ? `?${query.toString()}` : "";
      const res = await fetch(`${API_BASE_URL}/prescriptions${qs}`, {
        method: "GET",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to fetch prescriptions", data: [] };
      }
      return { success: true, data: data.data || [], meta: data.meta, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Error fetching prescriptions", data: [] };
    }
  },

  /**
   * 4. Update a prescription (Doctor only)
   */
  updatePrescription: async (
    prescriptionId: string,
    payload: IUpdatePrescriptionPayload
  ): Promise<{ success: boolean; data?: IPrescription; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to update prescription" };
      }
      return { success: true, data: data.data, message: data.message };
    } catch (err: any) {
      return { success: false, message: err?.message || "Error updating prescription" };
    }
  },

  /**
   * 5. Delete a prescription (Doctor only)
   */
  deletePrescription: async (
    prescriptionId: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const headers = await getHeaders();
      const res = await fetch(`${API_BASE_URL}/prescriptions/${prescriptionId}`, {
        method: "DELETE",
        headers,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, message: data.message || "Failed to delete prescription" };
      }
      return { success: true, message: data.message || "Prescription deleted successfully" };
    } catch (err: any) {
      return { success: false, message: err?.message || "Error deleting prescription" };
    }
  },
};
