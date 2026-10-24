import React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Video, 
  User, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { getMyAppointments } from "@/src/services/appointment.service";
import { Button } from "@/src/components/ui/button";
import { JoinConsultationButton } from "@/src/components/modules/appointments/JoinConsultationButton";

export const metadata = {
  title: "Patient Appointments | Doctor Dashboard",
  description: "View and manage consultations booked by patients.",
};

export default async function DoctorAppointmentsPage() {
  const res = await getMyAppointments();
  const appointments = res.success && res.data ? res.data : [];

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </span>
            Patient Appointments
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 pt-1">
            View upcoming patient consultations, join video calls, and track consultation statuses.
          </p>
        </div>
      </div>

      {/* Appointments Grid */}
      {appointments.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No Patient Appointments Yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-sm">
            You don't have any booked appointments from patients right now. Make sure your schedule slots are published so patients can book.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((appt) => {
            const patient = appt.patient;
            const schedule = appt.schedule;

            const isScheduled = appt.status === "SCHEDULED";
            const isCompleted = appt.status === "COMPLETED";
            const isCanceled = appt.status === "CANCELED";

            const formattedDate = schedule?.startDateTime
              ? format(parseISO(schedule.startDateTime), "EEE, MMM dd, yyyy")
              : "Date unavailable";

            const formattedTime =
              schedule?.startDateTime && schedule?.endDateTime
                ? `${format(parseISO(schedule.startDateTime), "hh:mm a")} - ${format(
                    parseISO(schedule.endDateTime),
                    "hh:mm a"
                  )}`
                : "Time unavailable";

            return (
              <div
                key={appt.id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                <div>
                  {/* Card Header: Patient Info */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold border border-blue-100 dark:border-blue-900/40">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                          {patient?.name || "Patient"}
                        </h4>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {patient?.gender || "Patient"}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                        isScheduled
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/50"
                          : isCompleted
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/50"
                          : isCanceled
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/50"
                          : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  {/* Patient Contact Info */}
                  <div className="space-y-1.5 mb-3 text-xs text-zinc-600 dark:text-zinc-400">
                    {patient?.contactNumber && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{patient.contactNumber}</span>
                      </div>
                    )}
                    {patient?.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                    )}
                    {patient?.address && (
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Scheduled Timing */}
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>{formattedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Payment Status & Video Call CTA */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      Payment
                    </span>
                    <span
                      className={`text-xs font-bold inline-flex items-center gap-1 ${
                        appt.paymentStatus === "PAID"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {appt.paymentStatus === "PAID" ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Paid
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 text-amber-500" /> Payment Pending
                        </>
                      )}
                    </span>
                  </div>

                  {appt.videoCallingId && (isScheduled || appt.status === "INPROGRESS") && (
                    <JoinConsultationButton
                      appointmentId={appt.id}
                      isPaid={
                        appt.paymentStatus === "PAID" ||
                        appt.payment?.status === "PAID"
                      }
                      status={appt.status}
                      endDateTime={schedule?.endDateTime}
                      userRole="DOCTOR"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}