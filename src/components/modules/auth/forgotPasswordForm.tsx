"use client";

import Link from "next/link";
import { useForgotPassword } from "@/src/hooks/auth/useForgotPassword";
import AppField from "../../sheard/form/AppField";
import AppSubmitButton from "../../sheard/form/AppSubmitButton";

export default function ForgotPasswordForm() {
  const { form, isLoading, onSubmit } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we will send you a 6-digit OTP to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AppField
            label="Email"
            type="email"
            placeholder="m@example.com"
            disabled={isLoading}
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <AppSubmitButton isPending={isLoading} pendingLabel="Sending OTP...">
          Send OTP
        </AppSubmitButton>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
