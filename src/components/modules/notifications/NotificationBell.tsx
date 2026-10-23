"use client";

import React, { useState } from "react";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { useNotifications } from "@/src/hooks/useNotifications";
import { NotificationDropdown } from "./NotificationDropdown";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    unreadCount,
    notifications,
    isLoading,
    hasMore,
    activeTab,
    preferences,
    setActiveTab,
    loadNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    updatePreferences,
    handleNotificationClick,
  } = useNotifications();

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && notifications.length === 0) {
      loadNotifications(1);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="h-5 w-5" />

          {/* Unread Alert Badge */}
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white font-mono shadow-xs">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative">{unreadCount > 99 ? "99+" : unreadCount}</span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="p-0 border-0 bg-transparent shadow-none w-auto overflow-visible focus:outline-none"
      >
        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          isLoading={isLoading}
          hasMore={hasMore}
          activeTab={activeTab}
          preferences={preferences}
          onTabChange={setActiveTab}
          onItemClick={handleNotificationClick}
          onDelete={deleteNotification}
          onMarkAllAsRead={markAllAsRead}
          onClearAll={clearAll}
          onLoadMore={loadMore}
          onUpdatePreferences={updatePreferences}
          onClose={() => setIsOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
