export type NotificationType =
  | "ADMIN_LOGIN_ALERT"
  | "USER_BLOCKED"
  | "NEW_SCHEDULES_AVAILABLE"
  | "APPOINTMENT_BOOKED"
  | "APPOINTMENT_CANCELLED"
  | "APPOINTMENT_REMINDER"
  | "PEER_WAITING_IN_ROOM"
  | "CONSULTATION_JOIN"
  | "PAYMENT_CONFIRMED"
  | "PRESCRIPTION_ISSUED"
  | "NEW_REVIEW"
  | "NEW_MESSAGE"
  | "SYSTEM";

export interface INotificationMetadata {
  event?: "PEER_WAITING_IN_ROOM" | "APPOINTMENT_REMINDER" | "CONSULTATION_JOIN" | "NEW_MESSAGE" | string;
  appointmentId?: string;
  roomId?: string;
  doctorId?: string;
  patientId?: string;
  doctorName?: string;
  patientName?: string;
  [key: string]: unknown;
}

export interface INotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string | null;
  metadata?: INotificationMetadata | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface INotificationPreference {
  id: string;
  userId: string;
  emailAlerts: boolean;
  inAppAlerts: boolean;
  appointmentReminders: boolean;
  marketingAlerts: boolean;
  soundEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LiveNotificationType =
  | "PEER_WAITING_IN_ROOM"
  | "APPOINTMENT_REMINDER"
  | "NEW_MESSAGE"
  | "CONSULTATION_JOIN";

export interface ILiveNotificationPayload {
  type: LiveNotificationType;
  title: string;
  message: string;
  link?: string;
  createdAt?: string;
  metadata?: INotificationMetadata;
}

export interface IUserBlockedPayload {
  reason?: string;
  blockedAt?: string;
}

export interface IUnreadCountResponse {
  unreadCount: number;
}

export interface INotificationFilters {
  page?: number;
  limit?: number;
  searchTerm?: string;
  type?: NotificationType;
  isRead?: boolean | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface INotificationListResponse {
  data: INotification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
}
