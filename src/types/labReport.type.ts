export type LabReportType =
  | "CBC"
  | "LIPID_PROFILE"
  | "LIVER_FUNCTION"
  | "KIDNEY_FUNCTION"
  | "THYROID_PROFILE"
  | "BLOOD_SUGAR"
  | "URINE_ANALYSIS"
  | "ELECTROLYTES"
  | "XRAY_IMAGING"
  | "OTHER";

export type LabReportUrgency = "ROUTINE" | "ATTENTION" | "CRITICAL";

export type LabReportStatus = "PROCESSING" | "COMPLETED" | "FAILED";

export type ParameterStatus = "NORMAL" | "HIGH" | "LOW" | "CRITICAL";

export type FindingSeverity = "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";

export interface ILabParameter {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: ParameterStatus;
  clinicalNote?: string;
}

export interface IAbnormalFinding {
  parameter: string;
  value: string;
  referenceRange: string;
  severity: FindingSeverity;
  clinicalNote: string;
}

export interface ILabReport {
  id: string;
  userId?: string;
  reportName: string;
  reportUrl: string;
  fileType: string;
  fileSize?: number;
  status: LabReportStatus;
  reportType: LabReportType;
  urgency: LabReportUrgency;
  patientName?: string;
  patientAge?: string;
  patientGender?: string;
  testDate?: string;
  labName?: string;
  referringDoctor?: string;
  parameters: ILabParameter[];
  abnormalFindings: IAbnormalFinding[];
  summaryEn?: string;
  summaryBn?: string;
  doctorQuestions: string[];
  recommendedSpecialties: string[];
  disclaimer?: string;
  appointmentId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ILabReportFilters {
  page?: number;
  limit?: number;
  reportType?: LabReportType | string;
  urgency?: LabReportUrgency | string;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ILabReportListResponse {
  data: ILabReport[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
}
