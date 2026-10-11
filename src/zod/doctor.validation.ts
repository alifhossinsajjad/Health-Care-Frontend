import { z } from "zod";

export const createDoctorValidationSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  doctor: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    contactNumber: z.string().min(11, "Valid contact number required"),
    address: z.string().min(1, "Address is required"),
    registrationNumber: z.string().min(1, "Registration number is required"),
    experience: z.string().min(1, "Experience is required"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    appointmentFee: z.string().min(1, "Fee is required"),
    qualification: z.string().min(1, "Qualification is required"),
    currentWorkingPlace: z.string().min(1, "Working place is required"),
    designation: z.string().min(1, "Designation is required"),
  }),
  specialties: z.array(z.string()).min(1, "At least one specialty must be selected"),
});

export type DoctorFormValues = z.infer<typeof createDoctorValidationSchema>;

export const updateDoctorValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  address: z.string().min(1, "Address is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  experience: z.union([z.string(), z.number()]),
  appointmentFee: z.union([z.string(), z.number()]),
  qualification: z.string().min(1, "Qualification is required"),
  currentWorkingPlace: z.string().min(1, "Working place is required"),
  designation: z.string().min(1, "Designation is required"),
  specialties: z.array(z.string()).optional(),
});

export type UpdateDoctorFormValues = z.infer<typeof updateDoctorValidationSchema>;
