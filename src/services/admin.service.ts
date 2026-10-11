import { httpClient } from "@/src/lib/axiosInstance";

export const changeUserStatus = async (
  userId: string,
  userStatus: "ACTIVE" | "BLOCKED"
): Promise<{ success: boolean; data?: any; message?: string }> => {
  try {
    const response = await httpClient.patch("/admin/change-user-status", {
      userId,
      userStatus,
    });
    return response as any;
  } catch (error: any) {
    console.error("Change User Status Error:", error);
    return {
      success: false,
      message: error?.response?.data?.message || "Internal server error changing status",
    };
  }
};
