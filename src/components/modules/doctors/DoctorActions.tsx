"use client";

import React, { useState } from "react";
import { IDoctor } from "@/src/types/doctor.type";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";

import { DoctorDetailsModal } from "@/src/components/modules/doctors/DoctorDetailsModal";
import { EditDoctorSheet } from "@/src/components/modules/doctors/EditDoctorSheet";
import { DeleteDoctorDialog } from "@/src/components/modules/doctors/DeleteDoctorDialog";

export function DoctorActions({ doctor }: { doctor: IDoctor }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setViewOpen(true)}
            className="cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2 text-zinc-500" />
            View Details
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setEditOpen(true)}
            className="cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2 text-blue-500" />
            Edit Doctor
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Doctor
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modular Components */}
      <DoctorDetailsModal
        doctor={doctor}
        open={viewOpen}
        onOpenChange={setViewOpen}
      />

      <EditDoctorSheet
        doctor={doctor}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteDoctorDialog
        doctor={doctor}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
