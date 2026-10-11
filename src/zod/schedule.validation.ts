import { z } from "zod";

export const createScheduleValidationSchema = z
  .object({
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    startTime: z
      .string()
      .min(1, "Start Time is required")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM expected, e.g. 09:00)"
      ),
    endTime: z
      .string()
      .min(1, "End Time is required")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM expected, e.g. 18:00)"
      ),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  );

export type CreateScheduleFormValues = z.infer<
  typeof createScheduleValidationSchema
>;

export const updateScheduleValidationSchema = z
  .object({
    startDate: z.string().min(1, "Start Date is required"),
    endDate: z.string().min(1, "End Date is required"),
    startTime: z
      .string()
      .min(1, "Start Time is required")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM expected, e.g. 09:00)"
      ),
    endTime: z
      .string()
      .min(1, "End Time is required")
      .regex(
        /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        "Invalid time format (HH:MM expected, e.g. 18:00)"
      ),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "End date must be on or after start date",
      path: ["endDate"],
    }
  );

export type UpdateScheduleFormValues = z.infer<
  typeof updateScheduleValidationSchema
>;
