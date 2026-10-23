"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  FileText,
  Calendar,
  CreditCard,
  MessageSquare,
  Clock,
  ShieldAlert,
  Bell,
  Trash2,
  Video,
} from "lucide-react";
import { INotification, NotificationType } from "@/src/types/notification.type";

interface NotificationItemProps {
  notification: INotification;
  onClick: (item: INotification) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "PEER_WAITING_IN_ROOM":
    case "CONSULTATION_JOIN":
      return <Video className="h-4 w-4 text-emerald-500" />;
    case "PRESCRIPTION_ISSUED":
      return <FileText className="h-4 w-4 text-emerald-500" />;
    case "APPOINTMENT_BOOKED":
    case "NEW_SCHEDULES_AVAILABLE":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "PAYMENT_CONFIRMED":
      return <CreditCard className="h-4 w-4 text-violet-500" />;
    case "APPOINTMENT_REMINDER":
      return <Clock className="h-4 w-4 text-amber-500" />;
    case "NEW_MESSAGE":
      return <MessageSquare className="h-4 w-4 text-sky-500" />;
    case "USER_BLOCKED":
    case "ADMIN_LOGIN_ALERT":
      return <ShieldAlert className="h-4 w-4 text-rose-500" />;
    default:
      return <Bell className="h-4 w-4 text-zinc-500" />;
  }
};

export function NotificationItem({ notification, onClick, onDelete }: NotificationItemProps) {
  const isPeerWaiting =
    notification.type === "PEER_WAITING_IN_ROOM" ||
    notification.type === "CONSULTATION_JOIN" ||
    notification.metadata?.event === "PEER_WAITING_IN_ROOM" ||
    notification.metadata?.event === "CONSULTATION_JOIN" ||
    notification.title.toLowerCase().includes("waiting");

  const isUrgent = notification.type === "APPOINTMENT_REMINDER";

  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "";

  // 1. Waiting Room Alert Card (Blueprint v2 Actionable Card)
  if (isPeerWaiting) {
    return (
      <div
        onClick={() => onClick(notification)}
        className="group relative p-3 border-b border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50/80 transition-colors cursor-pointer"
      >
        <div className="border-l-4 border-emerald-500 pl-2.5 py-0.5 flex items-center justify-between gap-2.5">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <h4 className="text-xs font-semibold text-emerald-900 dark:text-emerald-200 truncate">
                {notification.title}
              </h4>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1 line-clamp-2">
              {notification.message}
            </p>
          </div>
          {notification.link && (
            <Link
              href={notification.link}
              onClick={(e) => {
                e.stopPropagation();
                onClick(notification);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg shadow-xs shrink-0 transition-colors"
            >
              Join Room
            </Link>
          )}
        </div>
      </div>
    );
  }

  // 2. Standard & Urgent Notification Cards
  return (
    <div
      onClick={() => onClick(notification)}
      className={`group relative flex items-start gap-3 p-3.5 transition-all cursor-pointer border-b border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
        !notification.isRead ? "bg-blue-50/40 dark:bg-blue-950/20" : "bg-white dark:bg-zinc-900"
      } ${isUrgent ? "border-l-4 border-l-amber-500" : ""}`}
    >
      <div className="mt-0.5 relative shrink-0 p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
        {getNotificationIcon(notification.type)}
        {!notification.isRead && (
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-zinc-900" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {notification.title}
            </h4>
            {isUrgent && (
              <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 rounded">
                5m Final Call
              </span>
            )}
          </div>
          <span className="text-[10px] text-zinc-400 font-mono shrink-0">{timeAgo}</span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>

        {isUrgent && notification.link && (
          <div className="mt-2 flex items-center justify-end">
            <Link
              href={notification.link}
              onClick={(e) => {
                e.stopPropagation();
                onClick(notification);
              }}
              className="px-2.5 py-1 text-[11px] font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg"
            >
              Enter Room
            </Link>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(notification.id);
        }}
        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-500 p-1 transition-opacity shrink-0"
        title="Delete notification"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
