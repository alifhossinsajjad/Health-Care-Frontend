"use client";

import Link from "next/link";
import { useRegister } from "@/src/hooks/auth/useRegister";
import AppField from "../../sheard/form/AppField";
import AppSubmitButton from "../../sheard/form/AppSubmitButton";

export default function RegisterForm() {
  const { form, isLoading, onSubmit } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-sm">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Enter your details below to create your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <AppField
            label="Name"
            type="text"
            placeholder="John Doe"
            disabled={isLoading}
            error={errors.name?.message}
            {...register("name")}
          />

          <AppField
            label="Email"
            type="email"
            placeholder="m@example.com"
            disabled={isLoading}
            error={errors.email?.message}
            {...register("email")}
          />
          
          <AppField
            label="Contact Number"
            type="tel"
            placeholder="016xxxxxxxx"
            disabled={isLoading}
            error={errors.contactNumber?.message}
            {...register("contactNumber")}
          />

          <AppField
            label="Password"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <AppSubmitButton isPending={isLoading} pendingLabel="Creating account...">
          Sign up
        </AppSubmitButton>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
