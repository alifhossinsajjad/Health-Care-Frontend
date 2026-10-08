import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { ILoginPayload, loginZodSchema } from "@/src/zod/auth.validation";
import { loginAction } from "@/src/actions/auth.action";

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ILoginPayload>({
    resolver: zodResolver(loginZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: ILoginPayload) => {
    setIsLoading(true);

    try {
      const response = await loginAction(data);

      if (response.success) {
        if (response.accessToken) {
          localStorage.setItem("accessToken", response.accessToken);

          try {
            const decodedToken: any = jwtDecode(response.accessToken);
            const userRole = decodedToken?.role?.toUpperCase();

            toast.success(response.message);

            const redirectPath = searchParams.get("redirect");
            if (redirectPath) {
              router.push(redirectPath);
            } else if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
              router.push("/admin/dashboard");
            } else if (userRole === "DOCTOR") {
              router.push("/doctor/dashboard");
            } else {
              router.push("/dashboard");
            }
          } catch (error) {
            toast.success(response.message);
            const redirectPath = searchParams.get("redirect");
            router.push(redirectPath || "/dashboard");
          }
        } else {
          toast.success(response.message);
          const redirectPath = searchParams.get("redirect");
          router.push(redirectPath || "/dashboard");
        }
      } else {
        // Here we handle the unverified email edge-case!
        // The backend sends: "Your email is not verified. A new OTP has been sent to your email."
        if (response.message?.toLowerCase().includes("not verified")) {
          toast.error(response.message);
          // Redirect the user to verify-email with their email in the URL so they don't have to re-type it
          router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    onSubmit,
  };
};
