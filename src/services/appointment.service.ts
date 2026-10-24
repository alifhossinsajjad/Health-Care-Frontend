import { API_BASE_URL } from "@/src/lib/axiosInstance";
import { getAuthToken } from "@/src/utils/auth-token";
import {
  IBookAppointmentPayload,
  IBookAppointmentResponse,
  IAppointment,
} from "@/src/types/appointment.type";

export const bookAppointment = async (
  payload: IBookAppointmentPayload,
  paymentMethod: "PAY_NOW" | "PAY_LATER" = "PAY_LATER"
): Promise<{
  success: boolean;
  message?: string;
  data?: IBookAppointmentResponse;
}> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        message: "You must be logged in to book an appointment.",
      };
    }

    const endpoint =
      paymentMethod === "PAY_NOW"
        ? `${API_BASE_URL}/appointments/book-appointment`
        : `${API_BASE_URL}/appointments/book-appointment-with-pay-later`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to book appointment",
      };
    }

    return {
      success: true,
      message: data.message || "Appointment booked successfully!",
      data: data.data,
    };
  } catch (error: any) {
    console.error("Book Appointment Error:", error);
    return {
      success: false,
      message: error?.message || "Internal server error booking appointment",
    };
  }
};

export const getMyAppointments = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}): Promise<{
  success: boolean;
  message?: string;
  data?: IAppointment[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
}> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Not authenticated",
        data: [],
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

    const response = await fetch(
      `${API_BASE_URL}/appointments/my-appointments${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 0 },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch appointments",
        data: [],
      };
    }

    return {
      success: true,
      message: data.message,
      data: data.data || [],
      meta: data.meta,
    };
  } catch (error: any) {
    console.error("Fetch Appointments Error:", error);
    return {
      success: false,
      message: error?.message || "Internal server error fetching appointments",
      data: [],
    };
  }
};

export const initiatePayment = async (
  appointmentId: string
): Promise<{
  success: boolean;
  message?: string;
  data?: { paymentUrl: string };
}> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        message: "You must be logged in to make a payment.",
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/appointments/initiate-payment/${appointmentId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to initiate online payment",
      };
    }

    return {
      success: true,
      message: data.message || "Payment session created",
      data: data.data,
    };
  } catch (error: any) {
    console.error("Initiate Payment Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to initiate payment session",
    };
  }
};

export const getMySingleAppointment = async (
  appointmentId: string
): Promise<{
  success: boolean;
  message?: string;
  data?: IAppointment;
}> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        message: "Not authenticated",
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/appointments/my-single-appointment/${appointmentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        next: { revalidate: 0 },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to fetch appointment details",
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error: any) {
    console.error("Get Single Appointment Error:", error);
    return {
      success: false,
      message: error?.message || "Failed to fetch appointment details",
    };
  }
};

export const changeAppointmentStatus = async (
  appointmentId: string,
  status: "COMPLETED" | "SCHEDULED" | "INPROGRESS" | "CANCELED"
): Promise<{
  success: boolean;
  message?: string;
  data?: IAppointment;
}> => {
  try {
    const accessToken = await getAuthToken();

    if (!accessToken) {
      return {
        success: false,
        message: "You must be authenticated to update consultation status.",
      };
    }

    const response = await fetch(
      `${API_BASE_URL}/appointments/change-appointment-status/${appointmentId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || "Failed to update consultation status",
      };
    }

    return {
      success: true,
      message: data.message || "Consultation status updated successfully",
      data: data.data,
    };
  } catch (error: any) {
    console.error("Change Appointment Status Error:", error);
    return {
      success: false,
      message: error?.message || "Internal server error updating consultation status",
    };
  }
};
