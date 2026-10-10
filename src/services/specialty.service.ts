import { httpClient } from "@/src/lib/axiosInstance";
import { ApiResponse } from "@/src/types/api.type";
import { ISpecialty } from "@/src/types/specialty.type";

interface SpecialtyFilters {
  searchTerm?: string;
  page?: number;
  limit?: number;
}

export const getAllSpecialties = async (
  filters?: SpecialtyFilters,
): Promise<ApiResponse<ISpecialty[]>> => {
  try {
    const params: Record<string, string | number | boolean> = {};

    if (filters?.searchTerm) {
      params["searchTerm"] = filters.searchTerm;
    }
    if (filters?.page) {
      params["page"] = filters.page;
    }
    if (filters?.limit) {
      params["limit"] = filters.limit;
    }

    return await httpClient.get<ISpecialty[]>("/specialties", { params });
  } catch (error: any) {
    console.error("Error fetching specialties:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to fetch specialties",
      data: [],
    };
  }
};

export const createSpecialty = async (
  data: FormData,
): Promise<ApiResponse<ISpecialty>> => {
  try {
    return await httpClient.post<ISpecialty>("/specialties", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error: any) {
    console.error("Error creating specialty:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to create specialty",
    };
  }
};

export const deleteSpecialty = async (
  id: string,
): Promise<ApiResponse<ISpecialty>> => {
  try {
    return await httpClient.delete<ISpecialty>(`/specialties/${id}`);
  } catch (error: any) {
    console.error("Error deleting specialty:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Failed to delete specialty",
    };
  }
};
