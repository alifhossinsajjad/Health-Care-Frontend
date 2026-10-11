"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IDoctor } from "@/src/types/doctor.type";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { DoctorStatusToggle } from "@/src/components/modules/doctors/DoctorStatusToggle";
import { DoctorActions } from "@/src/components/modules/doctors/DoctorActions";

export const doctorColumns: ColumnDef<IDoctor>[] = [
  {
    accessorKey: "name",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original;
      const specialties = doctor.specialties?.map((s) => s.specialty?.title || (s as any).title).filter(Boolean) || [];
      return (
        <div className="flex items-center gap-3">
          <DoctorAvatar
            src={doctor.profilePhoto}
            alt={doctor.name}
            className="w-10 h-10 border-none shadow-none"
          />
          <div className="flex flex-col">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {doctor.name}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-zinc-500">
                {doctor.qualification}
              </span>
              {specialties.length > 0 && (
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {specialties[0]}
                  {specialties.length > 1 ? ` +${specialties.length - 1}` : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "contactInfo", // We use a pseudo key because we are combining two fields
    header: "Contact",
    cell: ({ row }) => {
      const doctor = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-zinc-900 dark:text-zinc-200">
            {doctor.email}
          </span>
          <span className="text-xs text-zinc-500">{doctor.contactNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "designation",
    header: "Designation",
    cell: ({ row }) => {
      const doctor = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-zinc-900 dark:text-zinc-200">
            {doctor.designation}
          </span>
          <span className="text-xs text-zinc-500 truncate max-w-[150px]">
            {doctor.currentWorkingPlace}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "appointmentFee",
    header: "Fee",
    cell: ({ row }) => {
      const fee = row.getValue("appointmentFee") as number;
      return (
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          ৳{fee}
        </div>
      );
    },
  },
  {
    accessorKey: "avarageRating",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.avarageRating;
      return (
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>{rating > 0 ? rating.toFixed(1) : "New"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return <DoctorStatusToggle doctor={row.original} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <DoctorActions doctor={row.original} />;
    },
  },
];
