"use client";

import React, { useState } from "react";
import { ISchedule } from "@/src/types/schedule.type";
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
import { ScheduleDetailsModal } from "@/src/components/modules/schedules/ScheduleDetailsModal";
import { EditScheduleSheet } from "@/src/components/modules/schedules/EditScheduleSheet";
import { DeleteScheduleDialog } from "@/src/components/modules/schedules/DeleteScheduleDialog";

export function ScheduleActions({ schedule }: { schedule: ISchedule }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
            onClick={() => setDetailsOpen(true)}
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
            Edit Slot
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setDeleteOpen(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Slot
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ScheduleDetailsModal
        schedule={schedule}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      <EditScheduleSheet
        schedule={schedule}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <DeleteScheduleDialog
        schedule={schedule}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
