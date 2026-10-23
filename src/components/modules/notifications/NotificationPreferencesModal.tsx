"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Mail, Bell, Clock, X } from "lucide-react";
import { INotificationPreference } from "@/src/types/notification.type";

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: INotificationPreference | null;
  onUpdate: (partial: Partial<INotificationPreference>) => Promise<any>;
}

export function NotificationPreferencesModal({
  isOpen,
  onClose,
  preferences,
  onUpdate,
}: PreferencesModalProps) {
  const [sound, setSound] = useState(preferences?.soundEnabled ?? true);
  const [inApp, setInApp] = useState(preferences?.inAppAlerts ?? true);
  const [email, setEmail] = useState(preferences?.emailAlerts ?? true);
  const [reminders, setReminders] = useState(preferences?.appointmentReminders ?? true);
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleToggle = async (key: keyof INotificationPreference, value: boolean, setter: (v: boolean) => void) => {
    setter(value);
    setIsSaving(true);
    await onUpdate({ [key]: value });
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Bell className="h-4 w-4 text-blue-600" />
            Notification Preferences
          </h3>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/80 my-2">
          {/* Audio Chime */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              {sound ? <Volume2 className="h-4 w-4 text-blue-600" /> : <VolumeX className="h-4 w-4 text-zinc-400" />}
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Sound Effects</p>
                <p className="text-[10px] text-zinc-400">Play chime on incoming alerts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={sound}
              onChange={(e) => handleToggle("soundEnabled", e.target.checked, setSound)}
              className="h-4 w-4 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* In-App Alerts */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <Bell className="h-4 w-4 text-emerald-600" />
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">In-App Popups</p>
                <p className="text-[10px] text-zinc-400">Display toast messages</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={inApp}
              onChange={(e) => handleToggle("inAppAlerts", e.target.checked, setInApp)}
              className="h-4 w-4 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Email Alerts */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-violet-600" />
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Email Updates</p>
                <p className="text-[10px] text-zinc-400">Prescriptions & receipts</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={email}
              onChange={(e) => handleToggle("emailAlerts", e.target.checked, setEmail)}
              className="h-4 w-4 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* 5m Appointment Reminders */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-amber-500" />
              <div>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">Consultation Reminders</p>
                <p className="text-[10px] text-zinc-400">5-minute call warnings</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminders}
              onChange={(e) => handleToggle("appointmentReminders", e.target.checked, setReminders)}
              className="h-4 w-4 rounded-sm border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
