import { API_BASE_URL, httpClient } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  IDoctorSchedule,
  IDoctorScheduleFilters,
  IDoctorScheduleMeta,
} from "@/src/types/doctor-schedule.type";

export const getAllDoctorSchedules = async (
  filters: IDoctorScheduleFilters = {}
): Promise<{
  success: boolean;
  data?: IDoctorSchedule[];
  meta?: IDoctorScheduleMeta;
  message?: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = `${API_BASE_URL}/doctor-schedules${queryString ? `?${queryString}` : ""}`;

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
        message: data.message || "Failed to fetch doctor schedules",
        data: [],
      };
    }

    return {
      success: true,
      data: data.data || [],
      meta: data.meta,
      message: data.message,
    };
  } catch (error: any) {
    console.error("Fetch Doctor Schedules Error:", error);
    return {
      success: false,
      message: "Internal server error fetching doctor schedules",
      data: [],
    };
  }
};

export const getMyDoctorSchedules = async (
  filters: IDoctorScheduleFilters = {}
): Promise<{
  success: boolean;
  data?: IDoctorSchedule[];
  meta?: IDoctorScheduleMeta;
  message?: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const candidateUrls = [
      `${API_BASE_URL}/doctor-schedules/my-doctor-schedules${queryString ? `?${queryString}` : ""}`,
      `${API_BASE_URL}/doctor-schedules/my-doctor-schedule${queryString ? `?${queryString}` : ""}`,
    ];

    for (const url of candidateUrls) {
      try {
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
        if (response.ok && data.success) {
          return {
            success: true,
            data: data.data || [],
            meta: data.meta,
            message: data.message,
          };
        }
      } catch {
        // Continue to fallback
      }
    }

    return getAllDoctorSchedules(filters);
  } catch (error: any) {
    console.error("Fetch My Doctor Schedules Error:", error);
    return getAllDoctorSchedules(filters);
  }
};

export const getDoctorScheduleById = async (
  doctorId: string,
  scheduleId: string
): Promise<{
  success: boolean;
  data?: IDoctorSchedule;
  message?: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    const url = `${API_BASE_URL}/doctor-schedules/${doctorId}/schedule/${scheduleId}`;

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
        message: data.message || "Failed to retrieve doctor schedule details",
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    console.error("Get Doctor Schedule By ID Error:", error);
    return {
      success: false,
      message: error?.message || "Internal server error retrieving schedule details",
    };
  }
};

export const createMyDoctorSchedule = async (
  payload: { scheduleIds: string[] }
): Promise<{
  success: boolean;
  message?: string;
  data?: { count: number };
}> => {
  try {
    const response = await httpClient.post<{ count: number }>(
      "/doctor-schedules/create-my-doctor-schedule",
      payload
    );
    return response as any;
  } catch (error: any) {
    console.error("Create My Doctor Schedule Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create doctor schedule",
    };
  }
};

export const updateMyDoctorSchedule = async (
  payload: { scheduleIds: { id: string; shouldDelete: boolean }[] }
): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  try {
    const response = await httpClient.patch(
      "/doctor-schedules/update-my-doctor-schedule",
      payload
    );
    return response as any;
  } catch (error: any) {
    console.error("Update My Doctor Schedule Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update doctor schedule",
    };
  }
};

export const deleteMyDoctorSchedule = async (
  scheduleId: string
): Promise<{
  success: boolean;
  message?: string;
  data?: any;
}> => {
  try {
    const response = await httpClient.delete(
      `/doctor-schedules/delete-my-doctor-schedule/${scheduleId}`
    );
    return response as any;
  } catch (error: any) {
    console.error("Delete My Doctor Schedule Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete doctor schedule",
    };
  }
};

