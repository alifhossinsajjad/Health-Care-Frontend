"use client";

import Link from "next/link";
import { useVerifyEmail } from "@/src/hooks/auth/useVerifyEmail";
import AppField from "../../sheard/form/AppField";
import AppSubmitButton from "../../sheard/form/AppSubmitButton";
import { Button } from "@/src/components/ui/button";

export default function VerifyEmailForm() {
  const { form, isLoading, isResending, onSubmit, onResendOtp } =
    useVerifyEmail();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Verify Email</h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit OTP to your email. Please enter it below.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AppField
            label="Email"
            type="email"
            placeholder="m@example.com"
            disabled={isLoading || isResending}
            error={errors.email?.message}
            {...register("email")}
          />

          <AppField
            label="OTP Code"
            type="text"
            placeholder="123456"
            maxLength={6}
            disabled={isLoading || isResending}
            error={errors.otp?.message}
            {...register("otp")}
          />
        </div>

        <AppSubmitButton isPending={isLoading} pendingLabel="Verifying...">
          Verify Account
        </AppSubmitButton>
      </form>

      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          variant="link"
          type="button"
          onClick={onResendOtp}
          disabled={isResending || isLoading}
          className="text-sm"
        >
          {isResending ? "Resending..." : "Didn't receive code? Resend OTP"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Back to{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
