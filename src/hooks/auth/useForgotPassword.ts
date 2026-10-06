import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IForgotPasswordPayload, forgotPasswordZodSchema } from "@/src/zod/auth.validation";
import { forgotPasswordAction } from "@/src/actions/auth.action";

export const useForgotPassword = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IForgotPasswordPayload>({
    resolver: zodResolver(forgotPasswordZodSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: IForgotPasswordPayload) => {
    setIsLoading(true);
    try {
      const response = await forgotPasswordAction(data);
      if (response.success) {
        toast.success(response.message);
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
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
