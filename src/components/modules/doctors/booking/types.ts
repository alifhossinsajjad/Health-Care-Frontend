import { IDoctorSchedule } from "@/src/types/doctor-schedule.type";

export type IDoctorScheduleWithSlot = IDoctorSchedule & {
  schedule: NonNullable<IDoctorSchedule["schedule"]>;
};
