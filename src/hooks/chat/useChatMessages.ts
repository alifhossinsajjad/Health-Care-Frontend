"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Socket } from "socket.io-client";
import { soundAlerts } from "@/src/lib/socket";
import { chatService } from "@/src/services/chat.service";
import { IChatMessage, ChatMessageType } from "@/src/types/chat.type";

interface UseChatMessagesProps {
  socket: Socket | null;
  appointmentId: string;
  currentUserId: string;
  currentUserRole: string;
  currentUserName: string;
  onMessageReceived?: () => void;
}

export const useChatMessages = ({
  socket,
  appointmentId,
  currentUserId,
  currentUserRole,
  currentUserName,
  onMessageReceived,
}: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onMessageReceivedRef = useRef(onMessageReceived);
  useEffect(() => {
    onMessageReceivedRef.current = onMessageReceived;
  }, [onMessageReceived]);

  // 1. Initial history fetch
  const loadChatHistory = useCallback(async () => {
    if (!appointmentId) return;
    setIsLoading(true);
    try {
      const res = await chatService.getChatHistory(appointmentId, 1, 100);
      if (res.success && Array.isArray(res.data)) {
        const normalized: IChatMessage[] = res.data.map((m: any) => ({
          ...m,
          id: m.id || m._id || `msg-${Date.now()}`,
          content: m.content || m.message || "",
          status: m.isRead ? "READ" : "DELIVERED",
        }));
        setMessages(normalized);
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    loadChatHistory();
  }, [loadChatHistory]);

  const lastMarkReadEmittedRef = useRef<number>(0);

  // 2. Mark messages read (pure persistent WebSocket; backend handles DB update & peer notification)
  const markAsRead = useCallback(() => {
    if (!appointmentId || !socket?.connected) return;
    const now = Date.now();
    if (now - lastMarkReadEmittedRef.current < 2500) return;
    lastMarkReadEmittedRef.current = now;

    socket.emit("chat:read", { appointmentId });
  }, [socket, appointmentId]);

  // 3. Socket incoming real-time listeners
  useEffect(() => {
    if (!socket || !appointmentId) return;

    // Normalizer for backend payloads (supports both chat:message & chat:new)
    const handleInboundMessage = (data: any) => {
      const raw = data?.message && typeof data.message === "object" ? data.message : data;
      const textContent = raw?.message || raw?.content || "";
      const senderObj = raw?.sender || {
        id: raw?.senderId || "",
        name: raw?.senderName || (raw?.senderRole === "DOCTOR" ? "Doctor" : "Patient"),
        role: raw?.senderRole || "PATIENT",
      };

      const normalizedMsg: IChatMessage = {
        ...raw,
        id: raw.id || raw._id || `msg-${Date.now()}`,
        appointmentId: raw.appointmentId || appointmentId,
        senderId: raw.senderId || senderObj.id,
        senderRole: raw.senderRole || senderObj.role,
        sender: senderObj,
        content: textContent,
        messageType: raw.messageType || "TEXT",
        attachmentUrl: raw.attachmentUrl || null,
        isRead: Boolean(raw.isRead),
        status: "DELIVERED",
        createdAt: raw.createdAt || new Date().toISOString(),
      };

      setMessages((prev) => {
        // Reconcile optimistic temp message if present
        const existingIdx = prev.findIndex(
          (m) =>
            m.id === normalizedMsg.id ||
            (m.id.startsWith("msg-temp-") &&
              m.content === normalizedMsg.content &&
              m.senderId === normalizedMsg.senderId)
        );

        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = { ...normalizedMsg, status: "DELIVERED" };
          return updated;
        }

        return [...prev, normalizedMsg];
      });

      onMessageReceivedRef.current?.();

      if (normalizedMsg.senderId !== currentUserId) {
        soundAlerts.playMessageChime();
        markAsRead();
      }
    };

    // Read receipt listener (supports chat:read_receipt & chat:messages-read)
    const handleReadReceipt = (data: any) => {
      const readerId = data?.readBy || data?.userId;
      if (readerId && readerId !== currentUserId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.senderId === currentUserId ? { ...msg, isRead: true, status: "READ" } : msg
          )
        );
      }
    };

    // Edit listener
    const handleEditedMessage = (data: any) => {
      const updated = data?.data || data;
      const targetId = updated?.id || updated?.messageId;
      const newText = updated?.message || updated?.content || updated?.newMessage;

      setMessages((prev) =>
        prev.map((m) =>
          m.id === targetId ? { ...m, content: newText, message: newText, isEdited: true } : m
        )
      );
    };

    // Delete listener
    const handleDeletedMessage = (data: any) => {
      const targetId = data?.messageId || data?.id;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === targetId
            ? { ...m, isDeleted: true, content: "🚫 This message was deleted", attachmentUrl: null }
            : m
        )
      );
    };

    // Attach listeners matching both backend and client event contracts
    socket.on("chat:message", handleInboundMessage);
    socket.on("chat:new", handleInboundMessage);
    socket.on("chat:read_receipt", handleReadReceipt);
    socket.on("chat:messages-read", handleReadReceipt);
    socket.on("chat:edited", handleEditedMessage);
    socket.on("chat:message-edited", handleEditedMessage);
    socket.on("chat:deleted", handleDeletedMessage);
    socket.on("chat:message-deleted", handleDeletedMessage);

    return () => {
      socket.off("chat:message", handleInboundMessage);
      socket.off("chat:new", handleInboundMessage);
      socket.off("chat:read_receipt", handleReadReceipt);
      socket.off("chat:messages-read", handleReadReceipt);
      socket.off("chat:edited", handleEditedMessage);
      socket.off("chat:message-edited", handleEditedMessage);
      socket.off("chat:deleted", handleDeletedMessage);
      socket.off("chat:message-deleted", handleDeletedMessage);
    };
  }, [socket, appointmentId, currentUserId, markAsRead]);

  // 4. Send Message (Optimistic UI)
  const sendMessage = useCallback(
    async (
      content: string,
      type: ChatMessageType = "TEXT",
      attachmentUrl: string | null = null
    ) => {
      if (!content.trim() && !attachmentUrl) return;

      const tempId = `msg-temp-${Date.now()}`;
      const now = new Date().toISOString();

      const optimisticMsg: IChatMessage = {
        id: tempId,
        appointmentId,
        senderId: currentUserId,
        senderRole: currentUserRole as any,
        sender: {
          id: currentUserId,
          name: currentUserName,
          role: currentUserRole as any,
        },
        content: content.trim(),
        messageType: type,
        attachmentUrl,
        isRead: false,
        status: "SENDING",
        createdAt: now,
      };

      setMessages((prev) => [...prev, optimisticMsg]);
      soundAlerts.playMessageSentTone();

      if (socket) {
        socket.emit("chat:send", {
          appointmentId,
          message: content.trim(),
          content: content.trim(),
          messageType: type,
          attachmentUrl,
          tempId,
        });

        socket.emit("chat:typing", {
          appointmentId,
          isTyping: false,
          userId: currentUserId,
          role: currentUserRole,
        });
      }

      // Transition optimistic status to SENT
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId && m.status === "SENDING" ? { ...m, status: "SENT" } : m))
        );
      }, 600);
    },
    [socket, appointmentId, currentUserId, currentUserRole, currentUserName]
  );

  // 5. Edit Message
  const editMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (!newContent.trim()) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, content: newContent.trim(), isEdited: true } : m))
      );
      socket?.emit("chat:edit", {
        appointmentId,
        messageId,
        newMessage: newContent.trim(),
        content: newContent.trim(),
      });
    },
    [socket, appointmentId]
  );

  // 6. Delete Message
  const deleteMessage = useCallback(
    (messageId: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, isDeleted: true, content: "🚫 This message was deleted", attachmentUrl: null }
            : m
        )
      );
      socket?.emit("chat:delete", {
        appointmentId,
        messageId,
      });
    },
    [socket, appointmentId]
  );

  // 7. Upload Attachment
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

        const textContent = msgType === "AUDIO" ? "Voice Note" : file.name;
        await sendMessage(textContent, msgType, res.data.url);
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
    isUploading,
    uploadProgress,
    sendMessage,
    markAsRead,
    editMessage,
    deleteMessage,
    uploadAndSendAttachment,
    refreshHistory: loadChatHistory,
  };
};
