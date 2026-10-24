export interface IPrescriptionDoctor {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  designation?: string | null;
  specialties?: Array<{
    id?: string;
    title?: string;
    specialty?: { title: string; icon?: string | null };
  }>;
}

export interface IPrescriptionPatient {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  address?: string | null;
}

export interface IPrescriptionAppointment {
  id: string;
  status: string;
  schedule?: {
    startDateTime: string;
    endDateTime?: string;
  };
}

export interface IPrescription {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  instructions: string;
  followUpDate?: string | null;
  pdfUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  doctor?: IPrescriptionDoctor;
  patient?: IPrescriptionPatient;
  appointment?: IPrescriptionAppointment;
}

export interface ICreatePrescriptionPayload {
  appointmentId: string;
  instructions: string;
  followUpDate?: string;
}

export interface IUpdatePrescriptionPayload {
  instructions?: string;
  followUpDate?: string;
}

export interface IPrescriptionMeta {
  page: number;
  limit: number;
  total: number;
}

export interface IPrescriptionListResponse {
  success: boolean;
  message?: string;
  meta?: IPrescriptionMeta;
  data: IPrescription[];
}
