export interface PieChartData {
  status: string;
  count: number;
}

export interface BarChartData {
  month: string;
  count: number;
}

export interface DashboardStats {
  // Common
  appointmentCount?: number;
  totalRevenue?: number;
  appointmentStatusDistribution?: PieChartData[];
  
  // Admin/Super Admin specific
  doctorCount?: number;
  patientCount?: number;
  superAdminCount?: number;
  adminCount?: number;
  paymentCount?: number;
  userCount?: number;
  pieChartData?: PieChartData[];
  barChartData?: BarChartData[];

  // Patient/Doctor specific
  reviewCount?: number;
}
