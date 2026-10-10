"use client";

import { ColumnDef } from "@tanstack/react-table";
import { IDoctor } from "@/src/types/doctor.type";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { format } from "date-fns";

export const doctorColumns: ColumnDef<IDoctor>[] = [
  {
    accessorKey: "name",
    header: "Doctor",
    cell: ({ row }) => {
      const doctor = row.original;
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
            <span className="text-xs text-zinc-500">
              {doctor.qualification}
            </span>
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
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
          ৳{fee}
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
        <span className="whitespace-nowrap">
          {format(new Date(date), "MMM dd, yyyy")}
        </span>
      );
    },
  },
];
