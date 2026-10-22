"use client";

import { io, Socket } from "socket.io-client";
import { getAuthToken } from "@/src/utils/auth-token";
export { soundAlerts } from "./soundAlerts";

let socketInstance: Socket | null = null;
let currentToken: string | null = null;

/**
 * Determine the Socket.IO server URL
 */
export const getSocketUrl = (): string => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_SOCKET_URL;
  }
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return window.location.origin;
  }
  return "http://localhost:5000";
};

/**
 * Initialize or retrieve the shared Socket.io client instance
 * Uses 100% persistent pure WebSocket transport (no HTTP polling)
 */
export const getSocket = async (): Promise<Socket> => {
  const token = (await getAuthToken()) || "";

  if (socketInstance && currentToken === token) {
    if (!socketInstance.connected) {
      socketInstance.connect();
    }
    return socketInstance;
  }

  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }

  currentToken = token;
  const socketUrl = getSocketUrl();
  const bearerToken = token ? (token.startsWith("Bearer ") ? token : `Bearer ${token}`) : "";

  socketInstance = io(socketUrl, {
    auth: {
      token,
      authorization: bearerToken,
    },
    extraHeaders: bearerToken ? { Authorization: bearerToken } : undefined,
    transports: ["websocket"], // Pure WebSocket for zero server HTTP polling overhead
    reconnection: true,
    reconnectionAttempts: 20,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  });

  return socketInstance;
};

/**
 * Disconnect and destroy the socket connection
 */
export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    currentToken = null;
  }
};
