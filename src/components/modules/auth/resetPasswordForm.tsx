"use client";

import Link from "next/link";
import { useResetPassword } from "@/src/hooks/auth/useResetPassword";
import AppField from "../../sheard/form/AppField";
import AppSubmitButton from "../../sheard/form/AppSubmitButton";
import { Button } from "@/src/components/ui/button";

export default function ResetPasswordForm() {
  const { form, isLoading, isResending, onSubmit, onResendOtp } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Reset Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit OTP sent to your email and your new password.
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

          <AppField
            label="New Password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading || isResending}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
        </div>

        <AppSubmitButton isPending={isLoading} pendingLabel="Resetting Password...">
          Reset Password
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
