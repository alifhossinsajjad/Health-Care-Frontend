import { API_BASE_URL, httpClient } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import { IDoctor, IDoctorFilters } from "@/src/types/doctor.type";

interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export const getAllDoctors = async (
  filters: IDoctorFilters = {},
): Promise<{
  success: boolean;
  data?: IDoctor[];
  meta?: IMeta;
  message?: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    // Convert filters object into URLSearchParams
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = `${API_BASE_URL}/doctors${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch doctors",
      };
    }

    return { success: true, data: data.data, meta: data.meta };
  } catch (error: any) {
    console.error("Fetch Doctors Error:", error);
    return {
      success: false,
      message: "Internal server error fetching doctors",
    };
  }
};

export const getDoctorById = async (
  id: string,
): Promise<{ success: boolean; data?: IDoctor; message?: string }> => {
  try {
    const accessToken = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
      next: { revalidate: 60 },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch doctor details",
      };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch Doctor Error:", error);
    return {
      success: false,
      message: "Internal server error fetching doctor details",
    };
  }
};

export const createDoctor = async (
  payload: any,
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    // We use httpClient so it works smoothly on the client and handles tokens automatically via interceptors
    const response = await httpClient.post("/users/create-doctor", payload);
    return response as any;
  } catch (error: any) {
    console.error("Create Doctor Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Internal server error creating doctor",
    };
  }
};

export const updateDoctor = async (
  id: string,
  payload: any,
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await httpClient.patch(`/doctors/${id}`, payload);
    return response as any;
  } catch (error: any) {
    console.error("Update Doctor Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Internal server error updating doctor",
    };
  }
};

export const deleteDoctor = async (
  id: string,
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await httpClient.delete(`/doctors/${id}`);
    return response as any;
  } catch (error: any) {
    console.error("Delete Doctor Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Internal server error deleting doctor",
    };
  }
};
