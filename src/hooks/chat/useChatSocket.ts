"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "@/src/lib/socket";

interface UseChatSocketProps {
  appointmentId: string;
  currentUserId: string;
  currentUserRole: string;
  currentUserName: string;
}

export const useChatSocket = ({
  appointmentId,
  currentUserId,
  currentUserRole,
  currentUserName,
}: UseChatSocketProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPeerOnline, setIsPeerOnline] = useState(false);
  const [isPeerTyping, setIsPeerTyping] = useState(false);
  const [peerTypingUser, setPeerTypingUser] = useState<string>("");

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingEmittedRef = useRef<number>(0);

  // Initialize socket client
  useEffect(() => {
    let mounted = true;
    getSocket().then((s) => {
      if (mounted) setSocket(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Room presence & typing listener
  useEffect(() => {
    if (!socket || !appointmentId) return;

    const joinAndSync = () => {
      socket.emit("join:appointment", { appointmentId, videoCallingId: appointmentId });
      socket.emit("call:join", { appointmentId, videoCallingId: appointmentId });
      socket.emit("participant:online", { userId: currentUserId, role: currentUserRole, appointmentId });
      socket.emit("participant:ping", { appointmentId, userId: currentUserId, role: currentUserRole });
    };

    joinAndSync();
    socket.on("connect", joinAndSync);
    socket.on("reconnect", joinAndSync);

    // Periodic heartbeat to guarantee peer presence updates live without flooding
    const heartbeatTimer = setInterval(() => {
      if (socket.connected) {
        socket.emit("participant:ping", { appointmentId, userId: currentUserId, role: currentUserRole });
      }
    }, 15000);

    // Presence listeners
    const handlePresence = (data: any) => {
      const isMe =
        (Boolean(data?.userId) && Boolean(currentUserId) && data.userId === currentUserId) ||
        (Boolean(data?.role) && data.role === currentUserRole);

      if (!isMe) {
        setIsPeerOnline((prev) => (prev ? prev : true));
      }
    };

    socket.on("participant:online", handlePresence);

    socket.on("participant:ping", (data: any) => {
      const isMe =
        (Boolean(data?.userId) && Boolean(currentUserId) && data.userId === currentUserId) ||
        (Boolean(data?.role) && data.role === currentUserRole);

      if (!isMe) {
        setIsPeerOnline((prev) => (prev ? prev : true));
        socket.emit("participant:online", { userId: currentUserId, role: currentUserRole, appointmentId });
      }
    });

    // Typing listener with strict anti-self check
    const handleTyping = (data: any) => {
      const isMe =
        (Boolean(data?.userId) && Boolean(currentUserId) && data.userId === currentUserId) ||
        (Boolean(data?.role) && data.role === currentUserRole);

      if (isMe) {
        // Never show typing indicator for yourself!
        return;
      }

      setIsPeerOnline(true);
      const isTyping = Boolean(data?.isTyping);
      setIsPeerTyping(isTyping);
      setPeerTypingUser(data?.userName || (data?.role === "DOCTOR" ? "Doctor" : "Patient"));

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (isTyping) {
        typingTimeoutRef.current = setTimeout(() => {
          setIsPeerTyping(false);
        }, 3000);
      }
    };

    socket.on("chat:user-typing", handleTyping);
    socket.on("chat:typing", handleTyping);

    return () => {
      clearInterval(heartbeatTimer);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.off("connect", joinAndSync);
      socket.off("reconnect", joinAndSync);
      socket.off("participant:online", handlePresence);
      socket.off("participant:ping");
      socket.off("chat:user-typing", handleTyping);
      socket.off("chat:typing", handleTyping);
    };
  }, [socket, appointmentId, currentUserId, currentUserRole]);

  // Send typing event
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      const now = Date.now();
      if (isTyping && now - lastTypingEmittedRef.current < 1200) {
        return;
      }
      lastTypingEmittedRef.current = now;

      if (socket?.connected) {
        socket.emit("chat:typing", {
          appointmentId,
          isTyping,
          userId: currentUserId,
          role: currentUserRole,
          userName: currentUserName,
        });
      }
    },
    [socket, appointmentId, currentUserId, currentUserRole, currentUserName]
  );

  return {
    socket,
    isPeerOnline,
    setIsPeerOnline,
    isPeerTyping,
    peerTypingUser,
    sendTyping,
  };
};
