export interface ISpecialty {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
