export interface ISchedule {
  id: string;
  startDateTime: string;
  endDateTime: string;
  createdAt: string;
  updatedAt: string;
  appointments?: any[];
  doctorSchedules?: any[];
}

export interface IScheduleFilters {
  page?: number;
  limit?: number;
  startDateTime?: string;
  endDateTime?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ICreateSchedulePayload {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface IScheduleMeta {
  page: number;
  limit: number;
  total: number;
}
