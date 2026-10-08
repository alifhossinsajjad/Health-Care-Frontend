import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/src/lib/axiosInstance";

interface UserProfile {
  id: string;
  name?: string;
  email: string;
  role: string;
  profilePhoto?: string;

  // Add other fields as needed
}

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserProfile> => {
      const response = await httpClient.get<UserProfile>("/auth/me");
      console.log("API Response:", response);
      // Let's also check if it's nested in response.data.data just in case
      return (response as any).data?.data || response.data || response;
    },
    retry: false, // Don't retry if it fails (e.g., token expired)
  });
};
