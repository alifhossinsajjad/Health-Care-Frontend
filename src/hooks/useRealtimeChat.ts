"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket, soundAlerts } from "@/src/lib/socket";
import { chatService } from "@/src/services/chat.service";
import {
  IChatMessage,
  ChatMessageType,
  IChatUserTypingEvent,
  IChatMessagesReadEvent,
} from "@/src/types/chat.type";

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
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPeerOnline, setIsPeerOnline] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [peerTypingUser, setPeerTypingUser] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingEmittedRef = useRef<number>(0);

  // ----------------------------------------------------------------------------
  // 1. Load Initial Chat History
  // ----------------------------------------------------------------------------
  const loadChatHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await chatService.getChatHistory(appointmentId, 1, 100);
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  // ----------------------------------------------------------------------------
  // 2. Mark Messages as Read (Seen receipt)
  // ----------------------------------------------------------------------------
  const markAsRead = useCallback(async () => {
    if (!appointmentId) return;

    // 1. Emit Socket read receipt for real-time double blue ticks
    if (socketRef.current?.connected) {
      socketRef.current.emit("chat:read", { appointmentId });
    }

    // 2. Persist read status via REST endpoint
    await chatService.markMessagesAsRead(appointmentId);
  }, [appointmentId]);

  // ----------------------------------------------------------------------------
  // 3. Socket Initialization & Room Handshake
  // ----------------------------------------------------------------------------
  useEffect(() => {
    let mounted = true;

    const setupSocket = async () => {
      loadChatHistory();

      const socket = await getSocket();
      if (!mounted) return;
      socketRef.current = socket;

      // 1. Join Appointment Consultation Room
      socket.emit(
        "join:appointment",
        { appointmentId },
        (res?: { success: boolean }) => {
          if (res?.success) {
            // Room joined successfully
          }
        }
      );

      // 2. Listen to Peer Presence
      socket.on(
        "participant:online",
        (data: { userId: string; role: string; appointmentId: string }) => {
          if (data.userId !== currentUserId) {
            setIsPeerOnline(true);
          }
        }
      );

      // 3. Listen to Incoming Messages
      socket.on("chat:new", (newMsg: IChatMessage) => {
        setMessages((prev) => {
          // If optimistic message exists with matching temporary ID or content, replace it
          const existingIdx = prev.findIndex(
            (m) =>
              m.id === newMsg.id ||
              (m.id.startsWith("msg-temp-") &&
                m.content === newMsg.content &&
                m.senderId === newMsg.senderId)
          );

          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = { ...newMsg, status: "DELIVERED" };
            return updated;
          }

          return [...prev, { ...newMsg, status: "DELIVERED" }];
        });

        // Trigger message sound chime if sent by the other party
        if (newMsg.senderId !== currentUserId) {
          soundAlerts.playMessageChime();
          markAsRead();
        }
      });

      // 4. Listen to Typing Indicator
      socket.on("chat:user-typing", (data: IChatUserTypingEvent) => {
        if (data.userId !== currentUserId) {
          setIsPeerTyping(data.isTyping);
          setPeerTypingUser(data.role === "DOCTOR" ? "Doctor" : "Patient");

          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          if (data.isTyping) {
            typingTimeoutRef.current = setTimeout(() => {
              setIsPeerTyping(false);
            }, 3000);
          }
        }
      });

      // 5. Listen to Read Receipts (Turns Double Checks Blue!)
      socket.on("chat:messages-read", (data: IChatMessagesReadEvent) => {
        if (data.appointmentId === appointmentId && data.readBy !== currentUserId) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.senderId === currentUserId ? { ...msg, isRead: true, status: "READ" } : msg
            )
          );
        }
      });

      // 6. Listen to Edited Message
      socket.on("chat:message-edited", (updatedMsg: IChatMessage) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === updatedMsg.id ? { ...m, ...updatedMsg, isEdited: true } : m))
        );
      });

      // 7. Listen to Deleted Message
      socket.on("chat:message-deleted", ({ messageId }: { messageId: string }) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? {
                  ...m,
                  isDeleted: true,
                  content: "🚫 This message was deleted",
                  attachmentUrl: null,
                }
              : m
          )
        );
      });
    };

    setupSocket();

    return () => {
      mounted = false;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.off("participant:online");
        socketRef.current.off("chat:new");
        socketRef.current.off("chat:user-typing");
        socketRef.current.off("chat:messages-read");
        socketRef.current.off("chat:message-edited");
        socketRef.current.off("chat:message-deleted");
      }
    };
  }, [appointmentId, currentUserId, loadChatHistory, markAsRead]);

  // ----------------------------------------------------------------------------
  // 4. Send Message (Optimistic UI Delivery)
  // ----------------------------------------------------------------------------
  const sendMessage = useCallback(
    async (
      content: string,
      type: ChatMessageType = "TEXT",
      attachmentUrl: string | null = null
    ) => {
      if (!content.trim() && !attachmentUrl) return;

      const tempId = `msg-temp-${Date.now()}`;
      const now = new Date().toISOString();

      // 1. Optimistic Bubble in UI
      const optimisticMsg: IChatMessage = {
        id: tempId,
        appointmentId,
        senderId: currentUserId,
        senderRole: currentUserRole,
        sender: {
          id: currentUserId,
          name: currentUserName,
          role: currentUserRole,
        },
        content: content.trim(),
        messageType: type,
        attachmentUrl,
        isRead: false,
        status: "SENDING",
        createdAt: now,
      };

      setMessages((prev) => [...prev, optimisticMsg]);

      // 2. Emit over socket
      const socket = socketRef.current || (await getSocket());
      socket.emit("chat:send", {
        appointmentId,
        content: content.trim(),
        messageType: type,
        attachmentUrl,
        tempId,
      });

      // Send typing false on submit
      socket.emit("chat:typing", { appointmentId, isTyping: false });
    },
    [appointmentId, currentUserId, currentUserName, currentUserRole]
  );

  // ----------------------------------------------------------------------------
  // 5. Send Typing with Debounce
  // ----------------------------------------------------------------------------
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const now = Date.now();
      // Throttle typing emissions to once every 1200ms
      if (isTyping && now - lastTypingEmittedRef.current < 1200) {
        return;
      }
      lastTypingEmittedRef.current = now;

      if (socketRef.current?.connected) {
        socketRef.current.emit("chat:typing", { appointmentId, isTyping });
      }
    },
    [appointmentId]
  );

  // ----------------------------------------------------------------------------
  // 6. Edit Message
  // ----------------------------------------------------------------------------
  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;

      // Optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: newContent.trim(), isEdited: true } : m
        )
      );

      socketRef.current?.emit("chat:edit", {
        appointmentId,
        messageId,
        content: newContent.trim(),
      });
    },
    [appointmentId]
  );

  // ----------------------------------------------------------------------------
  // 7. Delete / Unsend Message for Everyone
  // ----------------------------------------------------------------------------
  const deleteMessage = useCallback(
    (messageId: string) => {
      // Optimistic update
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                isDeleted: true,
                content: "🚫 This message was deleted",
                attachmentUrl: null,
              }
            : m
        )
      );

      socketRef.current?.emit("chat:delete", {
        appointmentId,
        messageId,
      });
    },
    [appointmentId]
  );

  // ----------------------------------------------------------------------------
  // 8. Upload Attachment & Send
  // ----------------------------------------------------------------------------
  const uploadAndSendAttachment = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const res = await chatService.uploadChatAttachment(appointmentId, file);
      setUploadProgress(80);

      if (res.success && res.data) {
        let msgType: ChatMessageType = "DOCUMENT";
        if (file.type.startsWith("image/")) msgType = "IMAGE";
        else if (file.type.startsWith("audio/")) msgType = "AUDIO";
        else if (file.type.startsWith("video/")) msgType = "VIDEO";

        await sendMessage(file.name, msgType, res.data.url);
      }
    } catch (err) {
      console.error("Failed to upload attachment:", err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
    refreshHistory: loadChatHistory,
  };
};
