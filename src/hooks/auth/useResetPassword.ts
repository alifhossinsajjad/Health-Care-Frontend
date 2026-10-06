import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { IResetPasswordPayload, resetPasswordZodSchema } from "@/src/zod/auth.validation";
import { resetPasswordAction, forgotPasswordAction } from "@/src/actions/auth.action";

export const useResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<IResetPasswordPayload>({
    resolver: zodResolver(resetPasswordZodSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (emailParam) {
      form.setValue("email", emailParam);
    }
  }, [emailParam, form]);

  const onSubmit = async (data: IResetPasswordPayload) => {
    setIsLoading(true);
    try {
      const response = await resetPasswordAction(data);
      if (response.success) {
        toast.success(response.message);
        router.push("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResendOtp = async () => {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Please enter your email to resend OTP.");
      return;
    }

    setIsResending(true);
    try {
      // Re-using the forgotPasswordAction to resend the OTP as instructed
      const response = await forgotPasswordAction({ email });
      if (response.success) {
        toast.success("OTP resent successfully! Please check your email.");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to resend OTP.");
    } finally {
      setIsResending(false);
    }
  };

  return {
    form,
    isLoading,
    isResending,
    onSubmit,
    onResendOtp,
  };
};
