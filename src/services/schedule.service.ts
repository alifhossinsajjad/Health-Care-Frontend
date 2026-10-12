import { API_BASE_URL, httpClient } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  ISchedule,
  IScheduleFilters,
  ICreateSchedulePayload,
  IScheduleMeta,
} from "@/src/types/schedule.type";

export const getAllSchedules = async (
  filters: IScheduleFilters = {}
): Promise<{
  success: boolean;
  data?: ISchedule[];
  meta?: IScheduleMeta;
  message?: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });

    const queryString = params.toString();
    const url = `${API_BASE_URL}/schedules${queryString ? `?${queryString}` : ""}`;

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
        message: data.message || "Failed to fetch schedules",
        data: [],
      };
    }

    return {
      success: true,
      data: data.data || [],
      meta: data.meta,
    };
  } catch (error: any) {
    console.error("Fetch Schedules Error:", error);
    return {
      success: false,
      message: "Internal server error fetching schedules",
      data: [],
    };
  }
};

export const getScheduleById = async (
  id: string
): Promise<{
  success: boolean;
  data?: ISchedule;
  message?: string;
}> => {
  try {
    const accessToken = await getAuthToken();

    const response = await fetch(`${API_BASE_URL}/schedules/${id}`, {
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
        message: data.message || "Failed to fetch schedule details",
      };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch Schedule By ID Error:", error);
    return {
      success: false,
      message: "Internal server error fetching schedule details",
    };
  }
};

export const createSchedule = async (
  payload: ICreateSchedulePayload
): Promise<{
  success: boolean;
  data?: ISchedule[];
  message?: string;
}> => {
  try {
    const response = await httpClient.post("/schedules", payload);
    return response as any;
  } catch (error: any) {
    console.error("Create Schedule Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message || "Internal server error creating schedule",
    };
  }
};

export const updateSchedule = async (
  id: string,
  payload: Partial<ICreateSchedulePayload>
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await httpClient.patch(`/schedules/${id}`, payload);
    return response as any;
  } catch (error: any) {
    console.error("Update Schedule Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message || "Internal server error updating schedule",
    };
  }
};

export const deleteSchedule = async (
  id: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> => {
  try {
    const response = await httpClient.delete(`/schedules/${id}`);
    return response as any;
  } catch (error: any) {
    console.error("Delete Schedule Error:", error);
    return {
      success: false,
      message:
        error?.response?.data?.message || "Internal server error deleting schedule",
    };
  }
};
