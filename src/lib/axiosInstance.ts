import axios from "axios";
import { ApiResponse } from "@/src/types/api.type";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_BASE_URL is not defined in the environment variables.",
  );
}

// Base API URL
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Universal (Works on both Server and Client)
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = null;

    if (typeof window === "undefined") {
      // Server-side Environment
      try {
        // Dynamically import next/headers to avoid breaking Client Components
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        token = cookieStore.get("accessToken")?.value;

        // Optional: Token Refresh Logic on Server can be added here
      } catch (error) {
        console.error("Failed to get cookies on server", error);
      }
    } else {
      // Client-side Environment (Browser)
      token = localStorage.getItem("accessToken");
    }

    // Attach token to headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Global Error Handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.error("Unauthorized! Redirecting to login...");
      if (typeof window !== "undefined") {
        // localStorage.removeItem('accessToken');
        // window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

// --- FACADE PATTERN (httpClient) ---
export interface ApiRequestOptions {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export const httpClient = {
  get: async <T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, options);
    return response.data;
  },
  post: async <T>(url: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, options);
    return response.data;
  },
  put: async <T>(url: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data, options);
    return response.data;
  },
  patch: async <T>(url: string, data: unknown, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data, options);
    return response.data;
  },
  delete: async <T>(url: string, options?: ApiRequestOptions): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, options);
    return response.data;
  },
};

export default axiosInstance;
