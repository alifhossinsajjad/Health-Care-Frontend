"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";


import { loginZodSchema, ILoginPayload } from "@/src/zod/auth.validation";
import { loginAction } from "@/src/actions/auth.action";

import AppField from "../../sheard/form/AppField";
import AppSubmitButton from "../../sheard/form/AppSubmitButton";


export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginPayload>({
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
        }
        toast.success(response.message);
        router.push("/dashboard");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl transition-all">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Welcome Back
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <AppField
          label="Email"
          type="email"
          placeholder="name@example.com"
          disabled={isLoading}
          error={errors.email?.message}
          {...register("email")}
        />

        <AppField
          label={
            <div className="flex items-center justify-between w-full">
              <span>Password</span>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>
          }
          type="password"
          placeholder="••••••••"
          disabled={isLoading}
          error={errors.password?.message}
          {...register("password")}
        />

        <AppSubmitButton isPending={isLoading} pendingLabel="Signing in...">
          Sign in
        </AppSubmitButton>
      </form>

      <div className="mt-6 text-center text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">
          Don't have an account?{" "}
        </span>
        <Link
          href="/register"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
