"use client";

import { useChatSocket } from "./chat/useChatSocket";
import { useChatMessages } from "./chat/useChatMessages";

interface UseRealtimeChatProps {
  appointmentId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserRole?: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
}

export const useRealtimeChat = ({
  appointmentId,
  currentUserId = "",
  currentUserName = "User",
  currentUserRole = "PATIENT",
}: UseRealtimeChatProps) => {
  // 1. Socket and presence hook
  const {
    socket,
    isPeerOnline,
    setIsPeerOnline,
    isPeerTyping,
    peerTypingUser,
    sendTyping,
  } = useChatSocket({
    appointmentId,
    currentUserId,
    currentUserRole,
    currentUserName,
  });

  // 2. Chat messages and attachments hook
  const {
    messages,
    isLoading,
    isUploading,
    uploadProgress,
    sendMessage,
    markAsRead,
    editMessage,
    deleteMessage,
    uploadAndSendAttachment,
    refreshHistory,
  } = useChatMessages({
    socket,
    appointmentId,
    currentUserId,
    currentUserRole,
    currentUserName,
    onMessageReceived: () => {
      setIsPeerOnline(true);
    },
  });

  return {
    messages,
    isLoading,
    isPeerOnline,
    isPeerTyping,
    peerTypingUser,
    isUploading,
    uploadProgress,
    sendMessage,
    sendTyping,
    markAsRead,
    editMessage,
    deleteMessage,
    uploadAndSendAttachment,
    refreshHistory,
  };
};
