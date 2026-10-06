import { z } from "zod";

// লগিনের জন্য বেসিক চেকিং (শুধু ঘর পূরণ করেছে কি না তা দেখা)
export const loginZodSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(1, "Password is required"), 
});

export const registerZodSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
  contactNumber: z
    .string({ message: "Contact number is required" })
    .min(10, "Contact number is too short"),
});

export const verifyEmailZodSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  otp: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits"), 
});

export const forgotPasswordZodSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
});

export const resetPasswordZodSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  otp: z
    .string({ message: "OTP is required" })
    .length(6, "OTP must be exactly 6 digits"),
  newPassword: z
    .string({ message: "New Password is required" })
    .min(8, "Password must be at least 8 characters long"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
});

export type ILoginPayload = z.infer<typeof loginZodSchema>;
export type IRegisterPayload = z.infer<typeof registerZodSchema>;
export type IVerifyEmailPayload = z.infer<typeof verifyEmailZodSchema>;
export type IForgotPasswordPayload = z.infer<typeof forgotPasswordZodSchema>;
export type IResetPasswordPayload = z.infer<typeof resetPasswordZodSchema>;
