"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ISchedule } from "@/src/types/schedule.type";
import { format, differenceInMinutes } from "date-fns";
import { Clock, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { ScheduleActions } from "@/src/components/modules/schedules/ScheduleActions";

export const scheduleColumns: ColumnDef<ISchedule>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const schedule = row.original;
      const startDate = new Date(schedule.startDateTime);
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {format(startDate, "MMM dd, yyyy")}
            </span>
            <span className="text-xs text-zinc-500 font-medium">
              {format(startDate, "EEEE")}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "timeSlot",
    header: "Time Window",
    cell: ({ row }) => {
      const schedule = row.original;
      const startDate = new Date(schedule.startDateTime);
      const endDate = new Date(schedule.endDateTime);
      return (
        <div className="flex items-center gap-1.5 font-semibold text-zinc-800 dark:text-zinc-200 text-sm">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{format(startDate, "hh:mm a")}</span>
          <span className="text-zinc-400">-</span>
          <span>{format(endDate, "hh:mm a")}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const schedule = row.original;
      const mins = differenceInMinutes(
        new Date(schedule.endDateTime),
        new Date(schedule.startDateTime)
      );
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {mins} Mins
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Availability",
    cell: ({ row }) => {
      const schedule = row.original;
      const isClaimed =
        (schedule.doctorSchedules && schedule.doctorSchedules.length > 0) ||
        (schedule.appointments && schedule.appointments.length > 0);

      if (isClaimed) {
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Claimed / Booked
          </span>
        );
      }

      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Available
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <span className="whitespace-nowrap text-xs text-zinc-600 dark:text-zinc-400">
          {format(new Date(date), "MMM dd, yyyy")}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ScheduleActions schedule={row.original} />;
    },
  },
];
