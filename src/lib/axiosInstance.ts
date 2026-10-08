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
  withCredentials: true, // Crucial for sending HttpOnly cookies (like refreshToken)
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

// Response Interceptor: Global Error Handling & Refresh Token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 Unauthorized and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, put this request in a queue
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh token API
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }, // Ensure refresh token cookie is sent
        );

        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;

        if (newAccessToken) {
          // Update Local Storage if on client
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", newAccessToken);
          }

          // Update Authorization headers
          axiosInstance.defaults.headers.common["Authorization"] =
            "Bearer " + newAccessToken;
          originalRequest.headers.Authorization = "Bearer " + newAccessToken;

          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest); // Retry the original request
        } else {
          throw new Error("No access token returned from refresh API");
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // If refresh fails (e.g. refresh token expired), log out the user
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
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
  get: async <T>(
    url: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, options);
    return response.data;
  },
  post: async <T>(
    url: string,
    data: unknown,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.post<ApiResponse<T>>(
      url,
      data,
      options,
    );
    return response.data;
  },
  put: async <T>(
    url: string,
    data: unknown,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.put<ApiResponse<T>>(
      url,
      data,
      options,
    );
    return response.data;
  },
  patch: async <T>(
    url: string,
    data: unknown,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(
      url,
      data,
      options,
    );
    return response.data;
  },
  delete: async <T>(
    url: string,
    options?: ApiRequestOptions,
  ): Promise<ApiResponse<T>> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, options);
    return response.data;
  },
};

export default axiosInstance;
