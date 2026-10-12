"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Eye,
  CheckCircle2,
  CalendarClock,
  Stethoscope,
  Trash2,
  Loader2,
} from "lucide-react";
import { format, isValid } from "date-fns";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { IDoctorSchedule } from "@/src/types/doctor-schedule.type";
import { deleteMyDoctorSchedule } from "@/src/services/doctor-schedule.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";
import { DoctorScheduleDetailsModal } from "./DoctorScheduleDetailsModal";

function BrowseActionCell({ scheduleItem }: { scheduleItem: IDoctorSchedule }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setModalOpen(true)}
        className="h-8 px-2.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg cursor-pointer"
      >
        <Eye className="w-3.5 h-3.5 mr-1" />
        View Details
      </Button>

      <DoctorScheduleDetailsModal
        scheduleItem={scheduleItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}

function MyScheduleActionCell({ scheduleItem }: { scheduleItem: IDoctorSchedule }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const res = await deleteMyDoctorSchedule(scheduleItem.scheduleId);
      if (res.success) {
        toast.success(res.message || "Schedule slot deleted successfully");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to delete schedule slot");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to delete schedule slot");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setModalOpen(true)}
        className="h-8 px-2.5 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg cursor-pointer"
      >
        <Eye className="w-3.5 h-3.5 mr-1" />
        View Details
      </Button>

      {scheduleItem.isBooked ? (
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="h-8 w-8 p-0 text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
          title="Booked slots cannot be removed"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDeleteOpen(true)}
          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer transition-colors"
          title="Delete this schedule slot"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      )}

      <DoctorScheduleDetailsModal
        scheduleItem={scheduleItem}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-zinc-900 dark:text-zinc-50 font-bold">
              <span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </span>
              Delete Schedule Slot
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-600 dark:text-zinc-400 text-sm mt-2">
              Are you sure you want to remove this time slot from your consultation schedule? Patients will no longer be able to book this slot.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2">
            <AlertDialogCancel disabled={deleting} className="rounded-full text-xs">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
              className="rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                  Deleting...
                </>
              ) : (
                "Delete Slot"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Columns for Public / Patient / All Doctor Schedule Browsing (NO DELETE BUTTON)
export const doctorScheduleColumns: ColumnDef<IDoctorSchedule>[] = [
  {
    accessorKey: "doctor",
    header: "Doctor Info",
    cell: ({ row }) => {
      const doctor = row.original.doctor;
      if (!doctor) {
        return (
          <span className="text-xs text-zinc-400 italic">No doctor data</span>
        );
      }

      return (
        <div className="flex items-center gap-3">
          <DoctorAvatar
            src={doctor.profilePhoto}
            alt={doctor.name}
            className="h-10 w-10"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
              {doctor.name}
            </span>
            <span className="text-xs text-zinc-500 truncate max-w-[180px]">
              {doctor.designation || doctor.email}
            </span>
            {doctor.currentWorkingPlace && (
              <span className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                {doctor.currentWorkingPlace}
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "schedule.startDateTime",
    header: "Schedule Date",
    cell: ({ row }) => {
      const startDateTime = row.original.schedule?.startDateTime;
      if (!startDateTime) return <span className="text-xs text-zinc-400">-</span>;

      const dateObj = new Date(startDateTime);
      if (!isValid(dateObj)) return <span className="text-xs text-zinc-400">-</span>;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            {format(dateObj, "MMM dd, yyyy")}
          </span>
          <span className="text-[11px] text-zinc-400 pl-5">
            {format(dateObj, "EEEE")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "scheduleTimeSlot",
    header: "Time Slot",
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      if (!schedule?.startDateTime || !schedule?.endDateTime) {
        return <span className="text-xs text-zinc-400">-</span>;
      }

      const start = new Date(schedule.startDateTime);
      const end = new Date(schedule.endDateTime);
      if (!isValid(start) || !isValid(end)) {
        return <span className="text-xs text-zinc-400">-</span>;
      }

      const formattedStart = format(start, "hh:mm a");
      const formattedEnd = format(end, "hh:mm a");
      const durationMins = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {formattedStart} - {formattedEnd}
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-4 border-zinc-200 dark:border-zinc-800 font-normal text-zinc-500"
          >
            {durationMins}m
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isBooked",
    header: "Status",
    cell: ({ row }) => {
      const isBooked = row.original.isBooked;

      return isBooked ? (
        <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 gap-1 font-medium text-xs">
          <CalendarClock className="w-3 h-3" />
          Booked
        </Badge>
      ) : (
        <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 gap-1 font-medium text-xs">
          <CheckCircle2 className="w-3 h-3" />
          Available
        </Badge>
      );
    },
  },
  {
    accessorKey: "appointmentStatus",
    header: "Appointment",
    cell: ({ row }) => {
      const scheduleItem = row.original;
      if (!scheduleItem.isBooked) {
        return <span className="text-xs text-zinc-400">-</span>;
      }

      const linkedApp = scheduleItem.doctor?.appointments?.find(
        (app) => app.scheduleId === scheduleItem.scheduleId
      );

      if (!linkedApp) {
        return (
          <span className="text-xs text-amber-700 dark:text-amber-300">
            Booked Slot
          </span>
        );
      }

      return (
        <Badge
          className={
            linkedApp.status === "COMPLETED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
              : linkedApp.status === "SCHEDULED"
              ? "bg-blue-50 text-blue-700 border-blue-200 text-[11px]"
              : "bg-zinc-50 text-zinc-700 border-zinc-200 text-[11px]"
          }
        >
          {linkedApp.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <BrowseActionCell scheduleItem={row.original} />,
  },
];

// Columns for Doctor Personal Dashboard: "My Schedules" (HAS DELETE BUTTON FOR OWN UNBOOKED SLOTS)
export const myDoctorScheduleColumns: ColumnDef<IDoctorSchedule>[] = [
  {
    accessorKey: "schedule.startDateTime",
    header: "Schedule Date",
    cell: ({ row }) => {
      const startDateTime = row.original.schedule?.startDateTime;
      if (!startDateTime) return <span className="text-xs text-zinc-400">-</span>;

      const dateObj = new Date(startDateTime);
      if (!isValid(dateObj)) return <span className="text-xs text-zinc-400">-</span>;

      return (
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            {format(dateObj, "MMM dd, yyyy")}
          </span>
          <span className="text-[11px] text-zinc-400 pl-5">
            {format(dateObj, "EEEE")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "scheduleTimeSlot",
    header: "Time Slot",
    cell: ({ row }) => {
      const schedule = row.original.schedule;
      if (!schedule?.startDateTime || !schedule?.endDateTime) {
        return <span className="text-xs text-zinc-400">-</span>;
      }

      const start = new Date(schedule.startDateTime);
      const end = new Date(schedule.endDateTime);
      if (!isValid(start) || !isValid(end)) {
        return <span className="text-xs text-zinc-400">-</span>;
      }

      const formattedStart = format(start, "hh:mm a");
      const formattedEnd = format(end, "hh:mm a");
      const durationMins = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              {formattedStart} - {formattedEnd}
            </span>
          </div>
          <Badge
            variant="outline"
            className="text-[10px] px-1.5 py-0 h-4 border-zinc-200 dark:border-zinc-800 font-normal text-zinc-500"
          >
            {durationMins}m
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "isBooked",
    header: "Status",
    cell: ({ row }) => {
      const isBooked = row.original.isBooked;

      return isBooked ? (
        <Badge className="bg-amber-100 hover:bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800 gap-1 font-medium text-xs">
          <CalendarClock className="w-3 h-3" />
          Booked
        </Badge>
      ) : (
        <Badge className="bg-emerald-100 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 gap-1 font-medium text-xs">
          <CheckCircle2 className="w-3 h-3" />
          Available
        </Badge>
      );
    },
  },
  {
    accessorKey: "appointmentStatus",
    header: "Appointment",
    cell: ({ row }) => {
      const scheduleItem = row.original;
      if (!scheduleItem.isBooked) {
        return <span className="text-xs text-zinc-400">-</span>;
      }

      const linkedApp = scheduleItem.doctor?.appointments?.find(
        (app) => app.scheduleId === scheduleItem.scheduleId
      );

      if (!linkedApp) {
        return (
          <span className="text-xs text-amber-700 dark:text-amber-300">
            Booked Slot
          </span>
        );
      }

      return (
        <Badge
          className={
            linkedApp.status === "COMPLETED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[11px]"
              : linkedApp.status === "SCHEDULED"
              ? "bg-blue-50 text-blue-700 border-blue-200 text-[11px]"
              : "bg-zinc-50 text-zinc-700 border-zinc-200 text-[11px]"
          }
        >
          {linkedApp.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <MyScheduleActionCell scheduleItem={row.original} />,
  },
];
