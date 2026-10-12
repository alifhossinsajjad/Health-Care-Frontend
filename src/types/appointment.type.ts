import { IDoctor } from "./doctor.type";
import { ISchedule } from "./schedule.type";

export type AppointmentStatus =
  | "SCHEDULED"
  | "INPROGRESS"
  | "COMPLETED"
  | "CANCELED";

export type PaymentStatus = "PAID" | "UNPAID";

export interface IBookAppointmentPayload {
  doctorId: string;
  scheduleId: string;
}

export interface IPatient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  gender?: "MALE" | "FEMALE" | "OTHER";
}

export interface IAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduleId: string;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  doctor?: IDoctor;
  patient?: IPatient;
  schedule?: ISchedule;
  payment?: {
    id: string;
    amount: number;
    transactionId: string;
    status: PaymentStatus;
    invoiceUrl?: string | null;
    stripeEventId?: string | null;
  };
}

export interface IBookAppointmentResponse {
  appointment: IAppointment;
  payment: {
    id: string;
    amount: number;
    transactionId: string;
  };
  paymentUrl?: string;
}
