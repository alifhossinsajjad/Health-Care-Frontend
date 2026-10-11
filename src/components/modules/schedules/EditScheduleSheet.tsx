"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Edit,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import AppField from "@/src/components/shared/form/AppField";
import AppSubmitButton from "@/src/components/shared/form/AppSubmitButton";
import { ISchedule } from "@/src/types/schedule.type";
import { updateSchedule } from "@/src/services/schedule.service";
import {
  updateScheduleValidationSchema,
  type UpdateScheduleFormValues,
} from "@/src/zod/schedule.validation";
import { format, isValid, parseISO } from "date-fns";

interface EditScheduleSheetProps {
  schedule: ISchedule;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditScheduleSheet({
  schedule,
  open,
  onOpenChange,
}: EditScheduleSheetProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const getFormattedDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return isValid(d) ? format(d, "yyyy-MM-dd") : new Date().toISOString().split("T")[0];
    } catch {
      return new Date().toISOString().split("T")[0];
    }
  };

  const getFormattedTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return isValid(d) ? format(d, "HH:mm") : "09:00";
    } catch {
      return "09:00";
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateScheduleFormValues>({
    resolver: zodResolver(updateScheduleValidationSchema),
    defaultValues: {
      startDate: getFormattedDate(schedule.startDateTime),
      endDate: getFormattedDate(schedule.endDateTime),
      startTime: getFormattedTime(schedule.startDateTime),
      endTime: getFormattedTime(schedule.endDateTime),
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  useEffect(() => {
    if (open) {
      reset({
        startDate: getFormattedDate(schedule.startDateTime),
        endDate: getFormattedDate(schedule.endDateTime),
        startTime: getFormattedTime(schedule.startDateTime),
        endTime: getFormattedTime(schedule.endDateTime),
      });
      setErrorMsg(null);
    }
  }, [open, schedule, reset]);

  // Calculations for live preview
  let formattedStartTime = "";
  let formattedEndTime = "";
  let durationMins = 0;
  if (startTime && endTime) {
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    if (!isNaN(sH) && !isNaN(sM) && !isNaN(eH) && !isNaN(eM)) {
      const startTotal = sH * 60 + sM;
      const endTotal = eH * 60 + eM;
      if (endTotal > startTotal) {
        durationMins = endTotal - startTotal;
        const dummyStart = new Date();
        dummyStart.setHours(sH, sM, 0, 0);
        formattedStartTime = format(dummyStart, "hh:mm a");

        const dummyEnd = new Date();
        dummyEnd.setHours(eH, eM, 0, 0);
        formattedEndTime = format(dummyEnd, "hh:mm a");
      }
    }
  }

  const setTimePreset = (start: string, end: string) => {
    setValue("startTime", start, { shouldValidate: true });
    setValue("endTime", end, { shouldValidate: true });
  };

  const handleEditSubmit = async (data: UpdateScheduleFormValues) => {
    setIsUpdating(true);
    setErrorMsg(null);
    try {
      const res = await updateSchedule(schedule.id, data);
      if (res.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to update schedule slot");
      }
    } catch (error: any) {
      setErrorMsg(error?.message || "An unexpected error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const startDayName = startDate && isValid(parseISO(startDate))
    ? format(parseISO(startDate), "EEE, MMM d")
    : null;

  const endDayName = endDate && isValid(parseISO(endDate))
    ? format(parseISO(endDate), "EEE, MMM d")
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <SheetHeader>
            <SheetTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Edit className="w-5 h-5" />
              </span>
              Edit Schedule Slot
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm text-zinc-500 pt-1">
              Modify the start date, end date, and timing window for this schedule slot.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(handleEditSubmit)}
          className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7 space-y-6"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Date Range */}
          <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </span>
              Schedule Dates
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppField
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                      Start Date
                    </span>
                    {startDayName && (
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/40">
                        {startDayName}
                      </span>
                    )}
                  </div>
                }
                type="date"
                error={errors.startDate?.message}
                className="bg-zinc-50 dark:bg-zinc-950 w-full"
                {...register("startDate")}
              />

              <AppField
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                      End Date
                    </span>
                    {endDayName && (
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-900/40">
                        {endDayName}
                      </span>
                    )}
                  </div>
                }
                type="date"
                error={errors.endDate?.message}
                className="bg-zinc-50 dark:bg-zinc-950 w-full"
                {...register("endDate")}
              />
            </div>
          </div>

          {/* Section 2: Time Window */}
          <div className="bg-white dark:bg-zinc-900 p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="space-y-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </span>
                  Time Window
                </h4>
                {durationMins > 0 && (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs">
                    {durationMins} Mins Duration
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mr-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Presets:
                </span>
                <button
                  type="button"
                  onClick={() => setTimePreset("09:00", "09:30")}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-medium transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  30 Mins (09:00 - 09:30)
                </button>
                <button
                  type="button"
                  onClick={() => setTimePreset("09:00", "13:00")}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-medium transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  Morning (09:00 - 13:00)
                </button>
                <button
                  type="button"
                  onClick={() => setTimePreset("14:00", "18:00")}
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 font-medium transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  Evening (14:00 - 18:00)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppField
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                      Start Time (HH:MM)
                    </span>
                    {formattedStartTime && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/40">
                        {formattedStartTime}
                      </span>
                    )}
                  </div>
                }
                type="time"
                error={errors.startTime?.message}
                className="bg-zinc-50 dark:bg-zinc-950 w-full"
                {...register("startTime")}
              />

              <AppField
                label={
                  <div className="flex items-center justify-between w-full">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs sm:text-sm">
                      End Time (HH:MM)
                    </span>
                    {formattedEndTime && (
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-900/40">
                        {formattedEndTime}
                      </span>
                    )}
                  </div>
                }
                type="time"
                error={errors.endTime?.message}
                className="bg-zinc-50 dark:bg-zinc-950 w-full"
                {...register("endTime")}
              />
            </div>

            {durationMins > 0 && (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-800 dark:text-emerald-200 flex items-center justify-between">
                <span className="font-medium">
                  {formattedStartTime} <ArrowRight className="inline w-3 h-3 mx-1 text-emerald-500" /> {formattedEndTime}
                </span>
                <span className="font-bold">
                  {durationMins} Minutes Duration
                </span>
              </div>
            )}
          </div>
        </form>

        {/* Fixed Footer with Reusable AppSubmitButton */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-end gap-3 mt-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-5 text-sm cursor-pointer"
          >
            Cancel
          </Button>

          <AppSubmitButton
            isPending={isUpdating}
            pendingLabel="Saving..."
            onClick={handleSubmit(handleEditSubmit)}
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm font-medium text-sm cursor-pointer"
          >
            Save Changes
          </AppSubmitButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
