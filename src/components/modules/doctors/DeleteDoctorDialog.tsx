"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { IDoctor } from "@/src/types/doctor.type";
import { deleteDoctor } from "@/src/services/doctor.service";
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

interface DeleteDoctorDialogProps {
  doctor: IDoctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDoctorDialog({
  doctor,
  open,
  onOpenChange,
}: DeleteDoctorDialogProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteDoctor(doctor.id);
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

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the doctor record for{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{doctor.name}</span>{" "}
            and revoke system access.
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
            Delete Doctor
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
