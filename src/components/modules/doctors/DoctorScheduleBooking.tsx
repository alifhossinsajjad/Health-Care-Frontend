"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { 
  Calendar as CalendarIcon, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { IDoctor } from "@/src/types/doctor.type";
import { IDoctorSchedule } from "@/src/types/doctor-schedule.type";
import { Button } from "@/src/components/ui/button";

import { jwtDecode } from "jwt-decode";
import { IDoctorScheduleWithSlot } from "./booking/types";
import { BlockedDoctorNotice } from "./booking/BlockedDoctorNotice";
import { EmptyScheduleNotice } from "./booking/EmptyScheduleNotice";
import { DateSelectorTabs } from "./booking/DateSelectorTabs";
import { TimeSlotGrid } from "./booking/TimeSlotGrid";
import { BookingReviewModal } from "./booking/BookingReviewModal";

interface DoctorScheduleBookingProps {
  doctor: IDoctor;
  initialSchedules: IDoctorSchedule[];
}

export function DoctorScheduleBooking({
  doctor,
  initialSchedules,
}: DoctorScheduleBookingProps) {
  const router = useRouter();

  // Filter out any already booked schedules and ensure schedule slot is present and not elapsed in the past
  const [schedules, setSchedules] = useState<IDoctorScheduleWithSlot[]>(() => {
    const now = Date.now();
    return initialSchedules.filter(
      (s): s is IDoctorScheduleWithSlot =>
        !s.isBooked &&
        Boolean(s.schedule?.startDateTime) &&
        new Date(
          (s.schedule?.endDateTime || s.schedule?.startDateTime) as string
        ).getTime() >= now
    );
  });

  const isDoctorBlocked =
    doctor.user?.status === "BLOCKED" || Boolean(doctor.isDeleted);

  // Group available schedules by Date string (yyyy-MM-dd)
  const groupedByDate = useMemo(() => {
    const groups: Record<string, IDoctorScheduleWithSlot[]> = {};

    schedules.forEach((item) => {
      if (!item.schedule?.startDateTime) return;
      try {
        const dateKey = format(
          parseISO(item.schedule.startDateTime),
          "yyyy-MM-dd"
        );
        if (!groups[dateKey]) {
          groups[dateKey] = [];
        }
        groups[dateKey].push(item);
      } catch (err) {
        console.error("Invalid schedule startDateTime:", item.schedule);
      }
    });

    // Sort time slots chronologically within each date
    Object.keys(groups).forEach((key) => {
      groups[key].sort(
        (a, b) =>
          new Date(a.schedule.startDateTime).getTime() -
          new Date(b.schedule.startDateTime).getTime()
      );
    });

    return groups;
  }, [schedules]);

  const sortedDateKeys = useMemo(() => {
    return Object.keys(groupedByDate).sort();
  }, [groupedByDate]);

  // Selected Date Key
  const [selectedDateKey, setSelectedDateKey] = useState<string>(() => {
    return sortedDateKeys[0] || "";
  });

  // Selected schedule ID
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    null
  );

  // Review & Confirmation Modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Auto-sync selectedDateKey if not valid
  const effectiveDateKey =
    selectedDateKey && groupedByDate[selectedDateKey]
      ? selectedDateKey
      : sortedDateKeys[0] || "";

  const availableSlotsForSelectedDate =
    groupedByDate[effectiveDateKey] || [];

  const selectedSlot = useMemo(() => {
    return schedules.find((s) => s.scheduleId === selectedScheduleId);
  }, [schedules, selectedScheduleId]);

  // Handle Book Appointment Click with Auth Guard
  const handleProceedToBook = () => {
    if (isDoctorBlocked) {
      toast.error("This doctor is currently unavailable for appointments.");
      return;
    }

    if (!selectedScheduleId || !selectedSlot) {
      toast.error("Please choose a time slot to proceed.");
      return;
    }

    // Check Authentication Guard (Universal: checks localStorage and document.cookie)
    let token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
        try {
          localStorage.setItem("accessToken", token);
        } catch {}
      }
    }

    if (!token) {
      toast.info("Please login to proceed with booking your appointment.");
      router.push(
        `/login?redirect=${encodeURIComponent(
          `/doctors/${doctor.id}?scheduleId=${selectedScheduleId}`
        )}`
      );
      return;
    }

    // Role Guard: Only PATIENT accounts can book appointments
    try {
      const decoded: any = jwtDecode(token);
      const userRole = decoded?.role ? String(decoded.role).toUpperCase() : "";
      if (userRole && userRole !== "PATIENT") {
        toast.error(
          `You are signed in as ${userRole.toLowerCase()}. Only registered patients can book doctor appointments.`
        );
        return;
      }
    } catch {
      // If decode fails, proceed to backend validation
    }

    // Authenticated Patient -> Open Booking Review Modal
    setIsReviewOpen(true);
  };

  // Called when booking is completed successfully
  const handleBookingComplete = (bookedScheduleId: string) => {
    setSchedules((prev) =>
      prev.filter((item) => item.scheduleId !== bookedScheduleId)
    );
    setSelectedScheduleId(null);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Book an Appointment
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Select a date and available time slot that fits your schedule.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 text-blue-700 dark:text-blue-300 w-fit">
          <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-semibold">
            ৳{doctor.appointmentFee}
          </span>
          <span className="text-xs text-blue-600/70 dark:text-blue-400/70 font-normal">
            / consultation
          </span>
        </div>
      </div>

      {/* Case 1: Doctor is Blocked / Inactive */}
      {isDoctorBlocked ? (
        <BlockedDoctorNotice doctorName={doctor.name} />
      ) : sortedDateKeys.length === 0 ? (
        /* Case 2: No Available Schedules */
        <EmptyScheduleNotice doctorName={doctor.name} />
      ) : (
        /* Case 3: Active Doctor with Available Slots */
        <div className="mt-6 space-y-6">
          {/* Date Selector Tabs */}
          <DateSelectorTabs
            sortedDateKeys={sortedDateKeys}
            effectiveDateKey={effectiveDateKey}
            groupedByDate={groupedByDate}
            onSelectDate={(dateKey) => {
              setSelectedDateKey(dateKey);
              if (
                selectedSlot &&
                format(
                  parseISO(selectedSlot.schedule.startDateTime),
                  "yyyy-MM-dd"
                ) !== dateKey
              ) {
                setSelectedScheduleId(null);
              }
            }}
          />

          {/* Time Slots Grid */}
          <TimeSlotGrid
            slots={availableSlotsForSelectedDate}
            selectedScheduleId={selectedScheduleId}
            onSelectSlot={(scheduleId) => setSelectedScheduleId(scheduleId)}
          />

          {/* Booking Summary & Action Bar */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="text-sm">
              {selectedSlot ? (
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    Selected:{" "}
                    <strong>
                      {format(
                        parseISO(selectedSlot.schedule.startDateTime),
                        "EEE, MMM dd"
                      )}
                    </strong>{" "}
                    at{" "}
                    <strong>
                      {format(
                        parseISO(selectedSlot.schedule.startDateTime),
                        "hh:mm a"
                      )}
                    </strong>
                  </span>
                </div>
              ) : (
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Select an available slot above to proceed.
                </span>
              )}
            </div>

            <Button
              onClick={handleProceedToBook}
              disabled={!selectedScheduleId || isDoctorBlocked}
              className="py-3 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Booking Review & Real-time Verification Modal */}
      {selectedSlot && (
        <BookingReviewModal
          isOpen={isReviewOpen}
          onClose={() => setIsReviewOpen(false)}
          doctor={doctor}
          selectedSlot={selectedSlot}
          onBookingComplete={handleBookingComplete}
        />
      )}
    </div>
  );
}
