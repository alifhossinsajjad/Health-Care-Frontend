"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { toast } from "sonner";
import {
  Trash2,
  Calendar,
  Clock,
  Loader2,
  AlertTriangle,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { updateMyDoctorSchedule } from "@/src/services/doctor-schedule.service";
import { IDoctorSchedule } from "@/src/types/doctor-schedule.type";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";

interface BulkUpdateDoctorScheduleModalProps {
  schedules: IDoctorSchedule[];
}

export function BulkUpdateDoctorScheduleModal({
  schedules,
}: BulkUpdateDoctorScheduleModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Filter only unbooked schedules eligible for deletion
  const eligibleSchedules = schedules.filter((s) => !s.isBooked);

  const toggleSelect = (scheduleId: string) => {
    setSelectedIds((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === eligibleSchedules.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(eligibleSchedules.map((s) => s.scheduleId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one schedule to remove.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        scheduleIds: selectedIds.map((id) => ({
          id,
          shouldDelete: true,
        })),
      };

      const res = await updateMyDoctorSchedule(payload);

      if (res.success) {
        toast.success(
          res.message || `Successfully removed ${selectedIds.length} schedule slots.`
        );
        setSelectedIds([]);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update doctor schedules.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-xs h-10 px-4 flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Bulk Manage ({eligibleSchedules.length})</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-5 h-5" />
            </span>
            <div>
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                Bulk Update & Remove Schedules
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Select multiple available (unbooked) consultation slots to remove them from your active schedule in batch.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {eligibleSchedules.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-sm font-semibold">No Available Slots to Remove</p>
              <p className="text-xs text-zinc-400 mt-1">
                All your existing slots are currently booked by patients or no schedules are assigned.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  {selectedIds.length} of {eligibleSchedules.length} slots selected
                </span>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                >
                  {selectedIds.length === eligibleSchedules.length
                    ? "Deselect All"
                    : "Select All Available"}
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {eligibleSchedules.map((item) => {
                  const isSelected = selectedIds.includes(item.scheduleId);
                  const start = item.schedule?.startDateTime
                    ? new Date(item.schedule.startDateTime)
                    : null;
                  const end = item.schedule?.endDateTime
                    ? new Date(item.schedule.endDateTime)
                    : null;

                  const dateFormatted =
                    start && isValid(start)
                      ? format(start, "EEE, MMM dd, yyyy")
                      : "Date N/A";
                  const timeFormatted =
                    start && end && isValid(start) && isValid(end)
                      ? `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`
                      : "Time N/A";

                  return (
                    <div
                      key={item.scheduleId}
                      onClick={() => toggleSelect(item.scheduleId)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "border-red-500 bg-red-50/60 dark:bg-red-950/20 text-zinc-900 dark:text-zinc-100 ring-1 ring-red-400/50"
                          : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 text-zinc-700 dark:text-zinc-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by row click
                          className="h-4 w-4 rounded border-zinc-300 text-red-600 focus:ring-red-500 cursor-pointer pointer-events-none"
                        />
                        <div className="flex flex-col">
                          <span className="text-xs font-bold flex items-center gap-1.5 text-zinc-900 dark:text-zinc-100">
                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                            {dateFormatted}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-emerald-500" />
                            {timeFormatted}
                          </span>
                        </div>
                      </div>

                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200"
                      >
                        Available
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/50 flex items-center justify-between gap-3 shrink-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={submitting}
            className="rounded-full text-xs h-9 px-4"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleBulkDelete}
            disabled={submitting || selectedIds.length === 0}
            className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-9 px-5 shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Removing Slots...
              </>
            ) : (
              `Remove (${selectedIds.length}) Selected`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
