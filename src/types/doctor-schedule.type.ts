import { IDoctor } from "./doctor.type";
import { ISchedule } from "./schedule.type";

export interface IDoctorScheduleAppointment {
  id: string;
  videoCallingId?: string;
  status: "SCHEDULED" | "INPROGRESS" | "COMPLETED" | "CANCELED";
  paymentStatus: "PAID" | "UNPAID";
  createdAt: string;
  updatedAt: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  patient?: {
    id: string;
    name: string;
    email: string;
    contactNumber?: string;
    profilePhoto?: string | null;
  };
}

export interface IDoctorSchedule {
  id?: string;
  doctorId: string;
  scheduleId: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
  doctor?: IDoctor & {
    appointments?: IDoctorScheduleAppointment[];
    specialties?: Array<{
      id: string;
      doctorId: string;
      specialtyId: string;
      specialty?: {
        id: string;
        title: string;
        icon?: string;
      };
    }>;
  };
  schedule?: ISchedule;
}

export interface IDoctorScheduleFilters {
  page?: number;
  limit?: number;
  doctorId?: string;
  isBooked?: boolean | string;
  startDate?: string;
  endDate?: string;
  startDateTime?: string;
  endDateTime?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
}

export interface IDoctorScheduleMeta {
  page: number;
  limit: number;
  total: number;
}
