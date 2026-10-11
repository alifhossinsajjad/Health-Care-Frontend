"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  CalendarPlus,
  AlertCircle,
} from "lucide-react";
import {
  format,
  addDays,
  differenceInCalendarDays,
  isValid,
  parseISO,
} from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import AppSubmitButton from "@/src/components/shared/form/AppSubmitButton";
import { createSchedule } from "@/src/services/schedule.service";
import {
  createScheduleValidationSchema,
  type CreateScheduleFormValues,
} from "@/src/zod/schedule.validation";

// Modular Sub-components
import {
  ScheduleDateRangeSection,
  type DatePresetType,
} from "./components/ScheduleDateRangeSection";
import {
  ScheduleTimeWindowSection,
  type TimePresetType,
} from "./components/ScheduleTimeWindowSection";
import { SchedulePreviewSummary } from "./components/SchedulePreviewSummary";

export function CreateScheduleSheet() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeDatePreset, setActiveDatePreset] = useState<DatePresetType>("3days");
  const [activeTimePreset, setActiveTimePreset] = useState<TimePresetType>("fullday");

  // Helper date formatters in local timezone
  const getTodayStr = () => format(new Date(), "yyyy-MM-dd");
  const getFutureDateStr = (daysToAdd: number) =>
    format(addDays(new Date(), daysToAdd), "yyyy-MM-dd");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateScheduleFormValues>({
    resolver: zodResolver(createScheduleValidationSchema),
    defaultValues: {
      startDate: getTodayStr(),
      endDate: getFutureDateStr(2), // Today + 2 days = exactly 3 days (e.g. Oct 11, 12, 13)
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // Calculate live date information
  let daysCount = 0;
  let formattedStartDate = "";
  let isDateRangeValid = false;

  if (startDate && endDate) {
    const startObj = parseISO(startDate);
    const endObj = parseISO(endDate);
    if (isValid(startObj) && isValid(endObj) && endObj >= startObj) {
      isDateRangeValid = true;
      daysCount = differenceInCalendarDays(endObj, startObj) + 1;
      formattedStartDate = format(startObj, "MMM dd, yyyy");
    }
  }

  // Calculate live daily time information
  let dailyMinutes = 0;
  let isTimeWindowValid = false;

  if (startTime && endTime) {
    const [sH, sM] = startTime.split(":").map(Number);
    const [eH, eM] = endTime.split(":").map(Number);
    if (!isNaN(sH) && !isNaN(sM) && !isNaN(eH) && !isNaN(eM)) {
      const startTotal = sH * 60 + sM;
      const endTotal = eH * 60 + eM;
      if (endTotal > startTotal) {
        isTimeWindowValid = true;
        dailyMinutes = endTotal - startTotal;
      }
    }
  }

  const slotsPerDay = isTimeWindowValid ? Math.floor(dailyMinutes / 30) : 0;
  const dailyHours = (dailyMinutes / 60).toFixed(dailyMinutes % 60 === 0 ? 0 : 1);
  const totalSlots = isDateRangeValid && isTimeWindowValid ? daysCount * slotsPerDay : 0;

  // Preset Handlers
  const handleDatePresetClick = (preset: DatePresetType, totalDays: number) => {
    setActiveDatePreset(preset);
    const start = getTodayStr();
    const end = getFutureDateStr(totalDays - 1);
    setValue("startDate", start, { shouldValidate: true });
    setValue("endDate", end, { shouldValidate: true });
  };

  const handleTimePresetClick = (
    preset: TimePresetType,
    start: string,
    end: string
  ) => {
    setActiveTimePreset(preset);
    setValue("startTime", start, { shouldValidate: true });
    setValue("endTime", end, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateScheduleFormValues) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await createSchedule(data);
      if (res.success) {
        setOpen(false);
        reset();
        router.refresh();
      } else {
        setErrorMsg(res.message || "Failed to create schedule slots");
      }
    } catch (error: any) {
      setErrorMsg(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md font-medium px-5 cursor-pointer">
          <CalendarPlus className="w-4 h-4 mr-2" />
          Create Schedule
        </Button>
      </SheetTrigger>

      {/* Spacious, wide sheet width to avoid cramped UI */}
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl p-0 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <SheetHeader>
            <SheetTitle className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CalendarPlus className="w-5 h-5" />
              </span>
              Generate Schedule Slots
            </SheetTitle>
            <SheetDescription className="text-xs sm:text-sm text-zinc-500 pt-1">
              Define a date range and daily working window. Automatically generates 30-minute booking intervals for appointments.
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-7 space-y-6"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Modular Date Range */}
          <ScheduleDateRangeSection
            register={register}
            errors={errors}
            startDate={startDate}
            endDate={endDate}
            activePreset={activeDatePreset}
            onSelectPreset={handleDatePresetClick}
            onCustomChange={() => setActiveDatePreset("custom")}
          />

          {/* Section 2: Modular Daily Time Window */}
          <ScheduleTimeWindowSection
            register={register}
            errors={errors}
            startTime={startTime}
            endTime={endTime}
            activePreset={activeTimePreset}
            onSelectPreset={handleTimePresetClick}
            onCustomChange={() => setActiveTimePreset("custom")}
          />

          {/* Section 3: Modular Live Schedule Generation Summary Box */}
          <SchedulePreviewSummary
            daysCount={daysCount}
            slotsPerDay={slotsPerDay}
            dailyHours={dailyHours}
            formattedStartDate={formattedStartDate}
            totalSlots={totalSlots}
          />
        </form>

        {/* Fixed Footer with Reusable AppSubmitButton */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3 mt-auto shrink-0">
          <div className="text-xs sm:text-sm text-zinc-500 hidden sm:block">
            {totalSlots > 0 ? (
              <span>
                Ready to generate <strong className="text-zinc-900 dark:text-zinc-100 font-bold">{totalSlots} appointment slots</strong>
              </span>
            ) : (
              <span>Select valid dates and daily time range</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-full px-5 text-sm cursor-pointer"
            >
              Cancel
            </Button>

            <AppSubmitButton
              isPending={isLoading}
              pendingLabel="Generating Slots..."
              disabled={totalSlots === 0 || !isDateRangeValid || !isTimeWindowValid}
              onClick={handleSubmit(onSubmit)}
              className="w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm font-medium text-sm cursor-pointer disabled:opacity-50"
            >
              {totalSlots > 0
                ? `Generate ${totalSlots} Slots (${daysCount} ${daysCount === 1 ? "Day" : "Days"})`
                : "Generate Slots"}
            </AppSubmitButton>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
