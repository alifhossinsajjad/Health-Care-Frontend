"use client";

import React, { useState } from "react";
import { CheckCheck, Settings, Trash2, Bell, Loader2 } from "lucide-react";
import { INotification, INotificationPreference } from "@/src/types/notification.type";
import { NotificationItem } from "./NotificationItem";
import { NotificationPreferencesModal } from "./NotificationPreferencesModal";

interface NotificationDropdownProps {
  notifications: INotification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  activeTab: "all" | "unread";
  preferences: INotificationPreference | null;
  onTabChange: (tab: "all" | "unread") => void;
  onItemClick: (item: INotification) => void;
  onDelete: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onLoadMore: () => void;
  onUpdatePreferences: (partial: Partial<INotificationPreference>) => Promise<any>;
  onClose: () => void;
}

export function NotificationDropdown({
  notifications,
  unreadCount,
  isLoading,
  hasMore,
  activeTab,
  preferences,
  onTabChange,
  onItemClick,
  onDelete,
  onMarkAllAsRead,
  onClearAll,
  onLoadMore,
  onUpdatePreferences,
  onClose,
}: NotificationDropdownProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <div className="flex flex-col w-[340px] sm:w-[380px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/90 dark:border-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white font-mono">
                {unreadCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllAsRead}
                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Notification Settings"
            >
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold px-4 pt-1 gap-4">
          <button
            type="button"
            onClick={() => onTabChange("all")}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === "all" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onTabChange("unread")}
            className={`pb-2 transition-colors border-b-2 ${
              activeTab === "unread" ? "border-blue-600 text-blue-600 dark:text-blue-400" : "border-transparent text-zinc-400 hover:text-zinc-600"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Scrollable List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {isLoading && notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <span className="text-xs">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2">
              <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                <Bell className="h-5 w-5 text-zinc-400" />
              </div>
              <p className="text-xs font-medium">No notifications right now</p>
            </div>
          ) : (
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                notification={item}
                onClick={(n) => {
                  onItemClick(n);
                  onClose();
                }}
                onDelete={onDelete}
              />
            ))
          )}

          {hasMore && !isLoading && (
            <div className="p-2 text-center">
              <button
                type="button"
                onClick={onLoadMore}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium py-1 px-3 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/40"
              >
                Load older notifications
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center text-xs text-zinc-400">
            <span>Showing recent activity</span>
            <button
              type="button"
              onClick={onClearAll}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-rose-500 font-medium transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Clear all
            </button>
          </div>
        )}
      </div>

      <NotificationPreferencesModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        preferences={preferences}
        onUpdate={onUpdatePreferences}
      />
    </>
  );
}
