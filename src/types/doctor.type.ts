export interface ISpecialty {
  id: string;
  title: string;
  description?: string | null;
  icon?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string | null;
}

export interface IDoctorSpecialty {
  id: string;
  doctorId: string;
  specialtyId: string;
  specialty: ISpecialty;
}

export interface IDoctor {
  id: string;
  name: string;
  email: string;
  profilePhoto: string | null;
  contactNumber: string;
  address: string;
  isDeleted: boolean;
  deletedAt: string | null;
  registrationNumber: string;
  experience: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  avarageRating: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  specialties: IDoctorSpecialty[];
}

export interface IDoctorFilters {
  searchTerm?: string;
  page?: number;
  limit?: number;
  gender?: string;
  appointmentFee?: number;
  "appointmentFee[gte]"?: number;
  "appointmentFee[lte]"?: number;
}
