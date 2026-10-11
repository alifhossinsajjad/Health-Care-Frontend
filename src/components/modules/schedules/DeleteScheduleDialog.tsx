"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ISchedule } from "@/src/types/schedule.type";
import { deleteSchedule } from "@/src/services/schedule.service";
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
import { Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

interface DeleteScheduleDialogProps {
  schedule: ISchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteScheduleDialog({
  schedule,
  open,
  onOpenChange,
}: DeleteScheduleDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteSchedule(schedule.id);
      if (res.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedStart = format(
    new Date(schedule.startDateTime),
    "MMM dd, yyyy - hh:mm a"
  );
  const formattedEnd = format(new Date(schedule.endDateTime), "hh:mm a");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Schedule Slot?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this schedule slot (
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {formattedStart} to {formattedEnd}
            </span>
            )? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4 mr-2" />
            )}
            Delete Slot
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
