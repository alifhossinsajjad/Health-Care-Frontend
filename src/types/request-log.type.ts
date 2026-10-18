export interface IRequestLogSummary {
  totalRecorded: number;
  success2xx: number;
  clientErrors4xx: number;
  serverErrors5xx: number;
}

export interface IRequestLogUser {
  id?: string;
  email?: string;
  role?: string;
  name?: string;
}

export interface IRequestLog {
  id: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;
  statusCode: number;
  duration?: string | number;
  device?: string;
  browser?: string;
  ip?: string;
  user?: IRequestLogUser | null;
  createdAt: string;
}

export interface IRequestLogFilters {
  limit?: number;
  page?: number;
  method?: string;
  statusCode?: string | number;
  search?: string;
}

export interface IRequestLogResponse {
  success: boolean;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
    summary?: IRequestLogSummary;
  };
  data: IRequestLog[];
}
