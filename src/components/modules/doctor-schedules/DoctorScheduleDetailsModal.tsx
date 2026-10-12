"use client";

import React from "react";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  CalendarClock,
  Video,
  CreditCard,
  Building,
  Award,
} from "lucide-react";
import { format, isValid } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Badge } from "@/src/components/ui/badge";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { IDoctorSchedule } from "@/src/types/doctor-schedule.type";

interface DoctorScheduleDetailsModalProps {
  scheduleItem: IDoctorSchedule | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DoctorScheduleDetailsModal({
  scheduleItem,
  open,
  onOpenChange,
}: DoctorScheduleDetailsModalProps) {
  if (!scheduleItem) return null;

  const doctor = scheduleItem.doctor;
  const schedule = scheduleItem.schedule;

  // Format dates safely
  let formattedDate = "N/A";
  let formattedTime = "N/A";
  let durationMins = 30;

  if (schedule?.startDateTime && schedule?.endDateTime) {
    const start = new Date(schedule.startDateTime);
    const end = new Date(schedule.endDateTime);
    if (isValid(start) && isValid(end)) {
      formattedDate = format(start, "EEEE, MMMM dd, yyyy");
      formattedTime = `${format(start, "hh:mm a")} - ${format(end, "hh:mm a")}`;
      durationMins = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }
  }

  // Find linked appointment if booked
  const linkedAppointment = doctor?.appointments?.find(
    (app) => app.scheduleId === scheduleItem.scheduleId
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-linear-to-r from-blue-50/50 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-blue-600" />
                Doctor Schedule Slot Details
              </DialogTitle>
              {scheduleItem.isBooked ? (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                  <CalendarClock className="w-3.5 h-3.5 mr-1" />
                  Booked
                </Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Available
                </Badge>
              )}
            </div>
            <DialogDescription className="text-xs text-zinc-500 pt-1">
              Detailed breakdown of doctor availability, assigned timing window, and booking status.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Schedule Timing Details */}
          <div className="p-5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-3">
            <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Schedule Timing
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-blue-100 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 block">Date</span>
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {formattedDate}
                </strong>
              </div>

              <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-blue-100 dark:border-zinc-800">
                <span className="text-xs text-zinc-500 block">Time Slot</span>
                <strong className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  {formattedTime} ({durationMins} mins)
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2: Doctor Information */}
          {doctor && (
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                <Stethoscope className="w-4 h-4 text-blue-600" />
                Doctor Profile
              </h4>

              <div className="flex items-start gap-4">
                <DoctorAvatar
                  src={doctor.profilePhoto}
                  alt={doctor.name}
                  className="h-14 w-14"
                />
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {doctor.designation} • {doctor.qualification}
                  </p>
                  <p className="text-xs text-zinc-500 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-zinc-400" />
                    {doctor.currentWorkingPlace}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{doctor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{doctor.contactNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <Award className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Reg: {doctor.registrationNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{doctor.address}</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Linked Appointment (if booked) */}
          {linkedAppointment && (
            <div className="p-5 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-600" />
                Booked Appointment Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-amber-100 dark:border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">Appointment Status</span>
                  <Badge
                    className={
                      linkedAppointment.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-800"
                        : linkedAppointment.status === "SCHEDULED"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-zinc-100 text-zinc-800"
                    }
                  >
                    {linkedAppointment.status}
                  </Badge>
                </div>

                <div className="p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-amber-100 dark:border-zinc-800 space-y-1">
                  <span className="text-zinc-500 block">Payment Status</span>
                  <Badge
                    className={
                      linkedAppointment.paymentStatus === "PAID"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    <CreditCard className="w-3 h-3 mr-1" />
                    {linkedAppointment.paymentStatus}
                  </Badge>
                </div>

                {linkedAppointment.videoCallingId && (
                  <div className="sm:col-span-2 p-3 rounded-lg bg-white/90 dark:bg-zinc-900/90 border border-amber-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-zinc-500 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      Video Session ID:
                    </span>
                    <code className="font-mono text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[11px]">
                      {linkedAppointment.videoCallingId}
                    </code>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
