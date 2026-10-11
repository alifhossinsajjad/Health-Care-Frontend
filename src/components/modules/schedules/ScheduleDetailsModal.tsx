"use client";

import React from "react";
import { ISchedule } from "@/src/types/schedule.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { format, differenceInMinutes } from "date-fns";
import { Clock, Calendar, CheckCircle2, AlertCircle, Hash } from "lucide-react";

interface ScheduleDetailsModalProps {
  schedule: ISchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDetailsModal({
  schedule,
  open,
  onOpenChange,
}: ScheduleDetailsModalProps) {
  const startDate = new Date(schedule.startDateTime);
  const endDate = new Date(schedule.endDateTime);
  const duration = differenceInMinutes(endDate, startDate);

  const isAssigned =
    (schedule.doctorSchedules && schedule.doctorSchedules.length > 0) ||
    (schedule.appointments && schedule.appointments.length > 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Schedule Slot Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Main Time Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {format(startDate, "EEEE, MMMM dd, yyyy")}
            </span>
            <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-1">
              {format(startDate, "hh:mm a")} - {format(endDate, "hh:mm a")}
            </div>
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
              <Clock className="w-3 h-3" />
              {duration} Minutes Slot
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5" /> Slot ID
              </span>
              <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate max-w-[180px]">
                {schedule.id}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500">Slot Status</span>
              {isAssigned ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  <AlertCircle className="w-3 h-3" /> Claimed / Booked
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Available
                </span>
              )}
            </div>

            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500">Doctor Claims</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {schedule.doctorSchedules?.length || 0} Doctor(s)
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500">Appointments</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {schedule.appointments?.length || 0} Patient(s)
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Created On
              </span>
              <span className="text-xs text-zinc-700 dark:text-zinc-300">
                {format(new Date(schedule.createdAt), "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
