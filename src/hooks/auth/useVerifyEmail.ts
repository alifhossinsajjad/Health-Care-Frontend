import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  IVerifyEmailPayload,
  verifyEmailZodSchema,
} from "@/src/zod/auth.validation";
import {
  verifyEmailAction,
  resendVerifyOtpAction,
} from "@/src/actions/auth.action";

export const useVerifyEmail = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<IVerifyEmailPayload>({
    resolver: zodResolver(verifyEmailZodSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  // Automatically set email from URL if available
  useEffect(() => {
    if (emailParam) {
      form.setValue("email", emailParam);
    }
  }, [emailParam, form]);

  const onSubmit = async (data: IVerifyEmailPayload) => {
    setIsLoading(true);
    try {
      const response = await verifyEmailAction(data);
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
      const response = await resendVerifyOtpAction({ email });
      if (response.success) {
        toast.success(response.message);
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
