/**
 * ==============================================================================
 * Real-Time Telemedicine Chat — Domain Types & Contracts
 * ==============================================================================
 * Covers WhatsApp / Messenger UX:
 * - Text, Image, Audio, Video, Document Attachments
 * - Optimistic Delivery Status (Sending -> Sent -> Delivered -> Read)
 * - Typing Indicators, Real-Time Edit, Unsend/Delete, and Seen Receipts
 */

export type ChatMessageType =
  | "TEXT"
  | "IMAGE"
  | "AUDIO"
  | "VIDEO"
  | "DOCUMENT";

export type ChatMessageStatus =
  | "SENDING"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED";

export interface IChatAttachment {
  url: string;
  mimetype: string;
  size: number;
  publicId?: string;
  originalName?: string;
}

export interface IChatSender {
  id: string;
  name?: string;
  role?: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
  profilePhoto?: string | null;
}

export interface IChatMessage {
  id: string;
  appointmentId: string;
  senderId: string;
  senderRole?: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
  sender?: IChatSender;
  content: string;
  messageType: ChatMessageType;
  attachmentUrl?: string | null;
  attachmentMeta?: IChatAttachment | null;
  isRead: boolean;
  readAt?: string | null;
  isEdited?: boolean;
  editedAt?: string | null;
  isDeleted?: boolean;
  status?: ChatMessageStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface IChatHistoryResponse {
  data: IChatMessage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage?: number;
  };
}

export interface IUnreadCountResponse {
  totalUnread: number;
  unreadPerAppointment: Array<{
    appointmentId: string;
    count: number;
  }>;
}

export interface IChatSendPayload {
  appointmentId: string;
  content: string;
  messageType?: ChatMessageType;
  attachmentUrl?: string | null;
  tempId?: string;
}

export interface IChatTypingPayload {
  appointmentId: string;
  isTyping: boolean;
}

export interface IChatUserTypingEvent {
  userId: string;
  role: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
  isTyping: boolean;
}

export interface IChatMessagesReadEvent {
  appointmentId: string;
  readBy: string;
  readAt: string;
}

export interface IChatEditPayload {
  appointmentId: string;
  messageId: string;
  content: string;
}

export interface IChatDeletePayload {
  appointmentId: string;
  messageId: string;
}
