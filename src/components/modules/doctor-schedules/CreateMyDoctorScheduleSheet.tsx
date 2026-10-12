"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, isValid } from "date-fns";
import { toast } from "sonner";
import { 
  Plus, 
  Clock, 
  Calendar, 
  Check, 
  Loader2, 
  CheckCircle2,
  CalendarPlus
} from "lucide-react";
import { getAllSchedules } from "@/src/services/schedule.service";
import { createMyDoctorSchedule } from "@/src/services/doctor-schedule.service";
import { ISchedule } from "@/src/types/schedule.type";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";

interface CreateMyDoctorScheduleSheetProps {
  existingScheduleIds?: string[];
}

export function CreateMyDoctorScheduleSheet({
  existingScheduleIds = [],
}: CreateMyDoctorScheduleSheetProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("");

  // Fetch all master schedules when sheet opens
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        ).toISOString();

        const res = await getAllSchedules({
          limit: 500,
          sortBy: "startDateTime",
          sortOrder: "asc",
        });

        if (isMounted && res.success && res.data) {
          const nowMs = Date.now();
          // Strictly exclude any past/expired slots according to user's current clock
          const upcomingOnly = res.data.filter((item) => {
            if (!item.startDateTime) return false;
            const slotEndTime = new Date(
              item.endDateTime || item.startDateTime
            ).getTime();
            return slotEndTime >= nowMs;
          });
          setSchedules(upcomingOnly);
        } else if (isMounted && res.message) {
          toast.error(res.message);
        }
      } catch (err: any) {
        toast.error("Failed to load available schedules");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSchedules();

    return () => {
      isMounted = false;
    };
  }, [open]);

  // Group master schedules by Date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, ISchedule[]> = {};

    schedules.forEach((item) => {
      if (!item.startDateTime) return;
      try {
        const dateKey = format(parseISO(item.startDateTime), "yyyy-MM-dd");
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(item);
      } catch {
        // Skip invalid date
      }
    });

    // Sort time slots chronologically within each date
    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
      );
    });

    return groups;
  }, [schedules]);

  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedByDate).sort();
  }, [groupedByDate]);

  const displayDateKeys = useMemo(() => {
    if (!dateFilter) return sortedDateKeys;
    return sortedDateKeys.filter((key) => key === dateFilter);
  }, [sortedDateKeys, dateFilter]);

  const toggleSelectSlot = (id: string) => {
    if (existingScheduleIds.includes(id)) return; // Already assigned

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllForDate = (dateKey: string) => {
    const slots = groupedByDate[dateKey] || [];
    const availableSlotIds = slots
      .map((s) => s.id)
      .filter((id) => !existingScheduleIds.includes(id));

    const allSelected = availableSlotIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !availableSlotIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...availableSlotIds])));
    }
  };

  const handleSubmit = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one schedule slot.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await createMyDoctorSchedule({ scheduleIds: selectedIds });

      if (res.success) {
        toast.success(res.message || "Doctor schedule created successfully!");
        setSelectedIds([]);
        setOpen(false);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to create doctor schedule.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" />
          <span>Assign Schedule Slots</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-950"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 shrink-0">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <CalendarPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Assign Consultation Schedule
            </SheetTitle>
            <SheetDescription className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
              Select upcoming time intervals from system master schedules to publish them as your available patient consultation slots.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Date Filter Bar */}
        <div className="px-6 py-2.5 bg-zinc-50/80 dark:bg-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              Filter by Date:
            </span>
            <input
              type="date"
              value={dateFilter}
              min={format(new Date(), "yyyy-MM-dd")}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-2.5 py-1 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            />
            {dateFilter && (
              <button
                type="button"
                onClick={() => setDateFilter("")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-zinc-500 font-medium">
            {displayDateKeys.length} upcoming {displayDateKeys.length === 1 ? "day" : "days"} available
          </div>
        </div>

        {/* Body: Scrollable list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm">Loading available schedules...</p>
            </div>
          ) : displayDateKeys.length === 0 ? (
            <div className="py-16 text-center text-zinc-500">
              <Clock className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
              <p className="text-base font-semibold">
                {dateFilter ? "No Slots Found for Selected Date" : "No Upcoming Master Schedules Found"}
              </p>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                {dateFilter
                  ? "There are no master schedules created for this specific date. Try picking another date."
                  : "All available schedule slots have expired or none were generated yet."}
              </p>
            </div>
          ) : (
            displayDateKeys.map((dateKey) => {
              const slots = groupedByDate[dateKey] || [];
              const parsedHeaderDate = new Date(dateKey + "T00:00:00");
              const formattedDateHeader = isValid(parsedHeaderDate)
                ? format(parsedHeaderDate, "EEEE, dd MMMM yyyy")
                : dateKey;

              const availableCount = slots.filter(
                (s) => !existingScheduleIds.includes(s.id)
              ).length;

              return (
                <div
                  key={dateKey}
                  className="p-4 rounded-2xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{formattedDateHeader}</span>
                    </div>

                    {availableCount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleSelectAllForDate(dateKey)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                      >
                        Toggle All ({availableCount})
                      </button>
                    )}
                  </div>

                  {/* Slot chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {slots.map((slot) => {
                      const isAlreadyAssigned = existingScheduleIds.includes(slot.id);
                      const isSelected = selectedIds.includes(slot.id);

                      const start = new Date(slot.startDateTime);
                      const end = new Date(slot.endDateTime);
                      const startTime = isValid(start) ? format(start, "hh:mm a") : "";
                      const endTime = isValid(end) ? format(end, "hh:mm a") : "";

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={isAlreadyAssigned}
                          onClick={() => toggleSelectSlot(slot.id)}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                            isAlreadyAssigned
                              ? "bg-zinc-100 dark:bg-zinc-800/50 text-zinc-400 border-zinc-200 dark:border-zinc-800 cursor-not-allowed opacity-60"
                              : isSelected
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 ring-2 ring-blue-500/50 font-bold"
                              : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 hover:bg-zinc-50"
                          }`}
                        >
                          <span className="truncate">
                            {startTime} - {endTime}
                          </span>

                          {isAlreadyAssigned ? (
                            <span className="text-[10px] text-zinc-400">Added</span>
                          ) : isSelected ? (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-1">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Sticky bottom */}
        <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-zinc-600 dark:text-zinc-400">
            Selected: <strong className="text-blue-600 dark:text-blue-400 font-bold">{selectedIds.length}</strong> slots
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
              disabled={submitting}
              className="rounded-full text-xs h-10 px-5"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || selectedIds.length === 0}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 shadow-sm disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Saving...
                </>
              ) : (
                `Add ${selectedIds.length > 0 ? `(${selectedIds.length}) ` : ""}to My Schedules`
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
