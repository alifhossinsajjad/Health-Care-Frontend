"use client";

import React, { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  CreditCard, 
  Building2, 
  Stethoscope, 
  Loader2,
  ShieldCheck,
  ArrowRight,
  Check
} from "lucide-react";
import { IDoctor } from "@/src/types/doctor.type";
import { IDoctorScheduleWithSlot } from "./types";
import { getDoctorScheduleById } from "@/src/services/doctor-schedule.service";
import { bookAppointment } from "@/src/services/appointment.service";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { BookingSuccessView } from "./BookingSuccessView";

interface BookingReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: IDoctor;
  selectedSlot: IDoctorScheduleWithSlot;
  onBookingComplete: (bookedScheduleId: string) => void;
}

export function BookingReviewModal({
  isOpen,
  onClose,
  doctor,
  selectedSlot,
  onBookingComplete,
}: BookingReviewModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"PAY_NOW" | "PAY_LATER">("PAY_NOW");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSlotAvailable, setIsSlotAvailable] = useState<boolean>(!selectedSlot?.isBooked);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Avoid duplicated "Dr. Dr. Abdullah"
  const doctorDisplayName = doctor.name.startsWith("Dr.")
    ? doctor.name
    : `Dr. ${doctor.name}`;

  // Real-time verification of slot status when modal opens
  useEffect(() => {
    if (!isOpen || !selectedSlot) return;

    let isMounted = true;

    // Initialize with local slot state immediately so button is never stuck
    setIsSlotAvailable(!selectedSlot.isBooked);

    const verifySlotStatus = async () => {
      try {
        setIsVerifying(true);
        const res = await getDoctorScheduleById(doctor.id, selectedSlot.scheduleId);
        
        if (isMounted) {
          if (res.success && res.data) {
            setIsSlotAvailable(!res.data.isBooked);
          } else {
            setIsSlotAvailable(!selectedSlot.isBooked);
          }
        }
      } catch (err) {
        if (isMounted) {
          setIsSlotAvailable(!selectedSlot.isBooked);
        }
      } finally {
        if (isMounted) {
          setIsVerifying(false);
        }
      }
    };

    verifySlotStatus();

    return () => {
      isMounted = false;
    };
  }, [isOpen, doctor.id, selectedSlot]);

  const formattedDate = format(
    parseISO(selectedSlot.schedule.startDateTime),
    "EEEE, dd MMMM yyyy"
  );
  const startTime = format(
    parseISO(selectedSlot.schedule.startDateTime),
    "hh:mm a"
  );
  const endTime = format(
    parseISO(selectedSlot.schedule.endDateTime),
    "hh:mm a"
  );

  const handleConfirm = async () => {
    if (!isSlotAvailable) {
      toast.error("This slot has already been booked. Please choose another time slot.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await bookAppointment(
        {
          doctorId: doctor.id,
          scheduleId: selectedSlot.scheduleId,
        },
        paymentMethod
      );

      if (!res.success) {
        toast.error(res.message || "Failed to book appointment. Please try again.");
        return;
      }

      // If Pay Now (Stripe) and paymentUrl provided
      if (paymentMethod === "PAY_NOW") {
        const paymentUrl =
          res.data?.paymentUrl || (res.data as any)?.data?.paymentUrl;
        if (paymentUrl) {
          toast.success("Redirecting to secure payment checkout...");
          window.location.href = paymentUrl;
          return;
        } else {
          toast.error("Could not obtain payment gateway URL. Please try again or select Pay Later.");
          return;
        }
      }

      // If Pay Later
      toast.success("Appointment booked successfully!");
      setIsSuccess(true);
      onBookingComplete(selectedSlot.scheduleId);
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isSubmitting) {
          if (!open) {
            setIsSuccess(false);
          }
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[88vh] flex flex-col p-0 overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-950">
        {isSuccess ? (
          <div className="p-6 sm:p-8">
            <BookingSuccessView
              doctorName={doctorDisplayName}
              onClose={() => {
                setIsSuccess(false);
                onClose();
              }}
            />
          </div>
        ) : (
          <>
            {/* Header: Fixed top */}
            <div className="p-5 sm:p-6 pb-4 border-b border-zinc-100 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-950">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100">
                  <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <CalendarIcon className="w-4 h-4" />
                  </span>
                  Confirm Appointment Booking
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm mt-1">
                  Please review your consultation details and choose your payment preference.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-left">
              {/* Top Row: Doctor Info & Appointment Timing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Doctor Card */}
                <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3.5">
                  <DoctorAvatar
                    src={doctor.profilePhoto}
                    alt={doctor.name}
                    className="w-12 h-12 ring-2 ring-white dark:ring-zinc-900 shadow-sm shrink-0"
                    fallbackClassName="text-base"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">
                      {doctorDisplayName}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                      {doctor.designation}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {doctor.currentWorkingPlace || doctor.qualification}
                    </p>
                  </div>
                </div>

                {/* Timing & Slot Verification Card */}
                <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400 mt-1">
                      <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{startTime} - {endTime}</span>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-200/80 dark:border-zinc-800 text-xs">
                    <span className="text-[11px] text-zinc-500 font-medium">Slot Status:</span>
                    {isVerifying ? (
                      <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                        Verifying...
                      </span>
                    ) : isSlotAvailable ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/50">
                        <CheckCircle className="w-3 h-3" /> Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full border border-rose-200/50">
                        <AlertCircle className="w-3 h-3" /> Already Booked
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Consultation Fee Bar */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-zinc-50 dark:from-blue-950/20 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 block">
                    Consultation Fee
                  </span>
                  <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
                    Includes 30 mins video consultation & doctor prescription
                  </span>
                </div>
                <span className="text-xl font-black text-blue-600 dark:text-blue-400">
                  ৳ {doctor.appointmentFee}
                </span>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2 block">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Pay Online Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PAY_NOW")}
                    className={`relative p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      paymentMethod === "PAY_NOW"
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/50 shadow-xs"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">Pay Online (Card / Stripe)</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-600 text-white">
                          Fast
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                        Instant card payment with instant PDF receipt
                      </p>
                    </div>
                  </button>

                  {/* Pay Later Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PAY_LATER")}
                    className={`relative p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                      paymentMethod === "PAY_LATER"
                        ? "border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-2 ring-blue-500/50 shadow-xs"
                        : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs">Pay Later</div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                        Pay at the clinic / hospital on visit day
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Footer: ALWAYS visible at bottom */}
            <div className="p-4 sm:p-5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Secure 256-bit SSL encrypted booking</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="rounded-full text-xs h-10 px-5 flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSubmitting || !isSlotAvailable}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-6 shadow-md shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2 flex-1 sm:flex-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : !isSlotAvailable ? (
                    "Slot Unavailable"
                  ) : paymentMethod === "PAY_NOW" ? (
                    <>
                      <span>Pay ৳{doctor.appointmentFee} & Confirm</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      <span>Confirm (Pay Later)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
