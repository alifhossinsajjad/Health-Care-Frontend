import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { IDoctor, IDoctorFilters } from "@/src/types/doctor.type";
import { cookies } from "next/headers";

interface IMeta {
  page: number;
  limit: number;
  total: number;
}

export const getAllDoctors = async (
  filters: IDoctorFilters = {}
): Promise<{ success: boolean; data?: IDoctor[]; meta?: IMeta; message?: string }> => {
  try {
    // We pass cookies just in case the API returns more details for authenticated users
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

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
      // Keep caching enabled for public routes but allow revalidation
      // If search params are heavily used, it's basically dynamic rendering
      next: { revalidate: 0 },
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, message: data.message || "Failed to fetch doctors" };
    }

    return { success: true, data: data.data, meta: data.meta };
  } catch (error: any) {
    console.error("Fetch Doctors Error:", error);
    return { success: false, message: "Internal server error fetching doctors" };
  }
};

export const getDoctorById = async (
  id: string
): Promise<{ success: boolean; data?: IDoctor; message?: string }> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      next: { revalidate: 60 }, // Cache individual doctor for 60 seconds
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return { success: false, message: data.message || "Failed to fetch doctor details" };
    }

    return { success: true, data: data.data };
  } catch (error: any) {
    console.error("Fetch Doctor Error:", error);
    return { success: false, message: "Internal server error fetching doctor details" };
  }
};
