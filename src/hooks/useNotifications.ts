"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSocket } from "@/src/lib/socket";
import { soundAlerts } from "@/src/lib/soundAlerts";
import { notificationService } from "@/src/services/notification.service";
import {
  INotification,
  INotificationPreference,
  ILiveNotificationPayload,
  IUserBlockedPayload,
} from "@/src/types/notification.type";

export function useNotifications() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [preferences, setPreferences] = useState<INotificationPreference | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const pathname = usePathname();
  const router = useRouter();
  const socketRef = useRef<any>(null);

  // 1. Fetch initial unread count
  const fetchUnreadCount = useCallback(async () => {
    const res = await notificationService.getUnreadCount();
    if (res.success && res.data) {
      setUnreadCount(res.data.unreadCount);
    }
  }, []);

  // 2. Fetch notification preferences
  const fetchPreferences = useCallback(async () => {
    const res = await notificationService.getPreferences();
    if (res.success && res.data) setPreferences(res.data);
  }, []);

  // 3. Lazy-load notifications list
  const loadNotifications = useCallback(async (targetPage = 1, filterTab = activeTab) => {
    setIsLoading(true);
    const isUnread = filterTab === "unread" ? true : undefined;
    const res = await notificationService.getNotifications({ page: targetPage, limit: 10, isRead: isUnread });
    if (res.success) {
      setNotifications((prev) => (targetPage === 1 ? res.data : [...prev, ...res.data]));
      setPage(targetPage);
      setHasMore(Boolean(res.meta && res.meta.page * res.meta.limit < res.meta.total));
    }
    setIsLoading(false);
  }, [activeTab]);

  // 4. WebSocket Event Handlers with Smart Route Suppression
  useEffect(() => {
    let isMounted = true;
    fetchUnreadCount();
    fetchPreferences();

    const setupSocket = async () => {
      try {
        const socket = await getSocket();
        if (!isMounted) return;
        socketRef.current = socket;

        // A. Persistent notification
        socket.on("notification:new", (item: INotification) => {
          if (!isMounted) return;
          const isUrgent = item.type === "APPOINTMENT_REMINDER" || item.type === "PEER_WAITING_IN_ROOM" || item.type === "CONSULTATION_JOIN";
          if (preferences?.soundEnabled ?? true) {
            const playSound = isUrgent ? soundAlerts.playUrgentAlertChime : soundAlerts.playNotificationChime;
            playSound();
          }
          setUnreadCount((prev) => prev + 1);
          setNotifications((prev) => [item, ...prev]);

          toast.info(item.title, {
            description: item.message,
            action: item.link ? { label: "View", onClick: () => router.push(item.link!) } : undefined,
          });
        });

        // B. Ephemeral Live Alert (Route Check & Urgent Tone)
        socket.on("notification:live", (payload: ILiveNotificationPayload) => {
          if (!isMounted) return;
          const soundOn = preferences?.soundEnabled ?? true;

          switch (payload.type) {
            case "PEER_WAITING_IN_ROOM":
            case "CONSULTATION_JOIN": {
              const inRoom = payload.link && (pathname === payload.link || pathname.startsWith(payload.link));
              if (inRoom) return; // Suppress alert when user is actively inside consultation room!

              if (soundOn) soundAlerts.playUrgentAlertChime();
              toast.success(payload.title, {
                description: payload.message || "Your consultation partner has arrived.",
                duration: 10000,
                icon: "🟢",
                action: payload.link ? { label: "Join Now", onClick: () => router.push(payload.link!) } : undefined,
              });
              break;
            }
            case "APPOINTMENT_REMINDER": {
              if (soundOn) soundAlerts.playUrgentAlertChime();
              toast.warning(payload.title, {
                description: payload.message,
                duration: 10000,
                icon: "🚨",
                action: payload.link ? { label: "Enter Room", onClick: () => router.push(payload.link!) } : undefined,
              });
              break;
            }
            case "NEW_MESSAGE":
            default: {
              if (soundOn) soundAlerts.playMessageChime();
              toast(payload.title, { description: payload.message });
              break;
            }
          }
        });

        // C. Security Action: Force logout when user is blocked
        socket.on("user:blocked", (data: IUserBlockedPayload) => {
          toast.error("Account Suspended", { description: data.reason || "Your account has been deactivated." });
          try {
            localStorage.removeItem("accessToken");
            document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
          } catch {}
          setTimeout(() => router.push("/login?error=blocked"), 1500);
        });

        // D. Reconnect sync
        socket.on("connect", () => { fetchUnreadCount(); });
      } catch (err) {
        console.warn("Notification socket setup skipped:", err);
      }
    };

    setupSocket();

    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off("notification:new");
        socketRef.current.off("notification:live");
        socketRef.current.off("user:blocked");
      }
    };
  }, [fetchUnreadCount, fetchPreferences, pathname, preferences?.soundEnabled, router]);

  // 5. Actions with Optimistic UI updates
  const markAsRead = useCallback(async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    await notificationService.markAsRead(id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    await notificationService.markAllAsRead();
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    const target = notifications.find((n) => n.id === id);
    if (target && !target.isRead) setUnreadCount((prev) => Math.max(0, prev - 1));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await notificationService.deleteNotification(id);
  }, [notifications]);

  const clearAll = useCallback(async () => {
    setNotifications([]);
    setUnreadCount(0);
    await notificationService.clearAllNotifications();
  }, []);

  const updatePreferences = useCallback(async (partial: Partial<INotificationPreference>) => {
    const res = await notificationService.updatePreferences(partial);
    if (res.success && res.data) setPreferences(res.data);
    return res;
  }, []);

  const handleNotificationClick = useCallback((item: INotification) => {
    if (!item.isRead) markAsRead(item.id);
    if (item.link) router.push(item.link);
  }, [markAsRead, router]);

  return {
    unreadCount, notifications, preferences, isLoading, hasMore, activeTab,
    setActiveTab: (tab: "all" | "unread") => { setActiveTab(tab); loadNotifications(1, tab); },
    loadNotifications, loadMore: () => loadNotifications(page + 1),
    markAsRead, markAllAsRead, deleteNotification, clearAll, updatePreferences,
    handleNotificationClick, refreshUnreadCount: fetchUnreadCount,
  };
}
