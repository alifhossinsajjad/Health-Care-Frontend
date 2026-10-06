import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IRegisterPayload, registerZodSchema } from "@/src/zod/auth.validation";
import { registerAction } from "@/src/actions/auth.action";

export const useRegister = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<IRegisterPayload>({
    resolver: zodResolver(registerZodSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      password: "",
    },
  });

  const onSubmit = async (data: IRegisterPayload) => {
    setIsLoading(true);
    try {
      const response = await registerAction(data);
      if (response.success) {
        toast.success(response.message);
        router.push(`/verify-email?email=${encodeURIComponent(data.email)}`);
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
