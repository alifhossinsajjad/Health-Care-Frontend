import React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { 
  Calendar, 
  Clock, 
  Video, 
  Stethoscope, 
  CreditCard, 
  Building2, 
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Download
} from "lucide-react";
import { getMyAppointments } from "@/src/services/appointment.service";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { PayNowButton } from "@/src/components/modules/appointments/PayNowButton";

export const metadata = {
  title: "My Appointments | Health Care",
  description: "View and manage all your scheduled healthcare appointments.",
};

export default async function MyAppointmentsPage() {
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
            My Appointments
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 pt-1">
            Manage your scheduled doctor consultations, video calls, and payment statuses.
          </p>
        </div>

        <Link href="/doctors">
          <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-sm">
            <Stethoscope className="w-4 h-4" />
            Book New Appointment
          </Button>
        </Link>
      </div>

      {/* Appointments List */}
      {appointments.length === 0 ? (
        <div className="py-16 px-4 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center text-center shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4 shadow-inner">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            No Appointments Scheduled Yet
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-sm">
            You don't have any upcoming doctor appointments. Browse top specialists and schedule your consultation today.
          </p>
          <Link href="/doctors" className="mt-6">
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-6">
              Browse Doctors
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((appt) => {
            const doctor = appt.doctor;
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

            const isPaid =
              appt.paymentStatus === "PAID" ||
              appt.payment?.status === "PAID";

            return (
              <div
                key={appt.id}
                className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between gap-4"
              >
                {/* Card Top: Doctor Info */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <DoctorAvatar
                        src={doctor?.profilePhoto}
                        alt={doctor?.name || "Doctor"}
                        className="w-12 h-12 ring-2 ring-zinc-100 dark:ring-zinc-800"
                        fallbackClassName="text-sm"
                      />
                      <div>
                        <h4 className="font-bold text-zinc-900 dark:text-zinc-50 text-base">
                          {doctor?.name || "Doctor"}
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                          {doctor?.designation || "Specialist"}
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

                  {/* Workplace */}
                  {doctor?.currentWorkingPlace && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 mb-3 truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{doctor.currentWorkingPlace}</span>
                    </div>
                  )}

                  {/* Schedule Details Box */}
                  <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 space-y-2">
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

                {/* Card Bottom: Payment & Action */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      Payment
                    </span>
                    <span
                      className={`text-xs font-bold inline-flex items-center gap-1 ${
                        isPaid
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {isPaid ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Paid
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" /> Pay at Clinic
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {/* Pay Online Now if unpaid */}
                    {!isPaid && isScheduled && (
                      <PayNowButton
                        appointmentId={appt.id}
                        fee={appt.payment?.amount || doctor?.appointmentFee}
                      />
                    )}

                    {/* Download Invoice if available */}
                    {appt.payment?.invoiceUrl && (
                      <a
                        href={appt.payment.invoiceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 py-1.5 px-3 rounded-full text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Invoice
                      </a>
                    )}

                    {/* Video Call Button */}
                    {appt.videoCallingId && isScheduled ? (
                      <Button
                        size="sm"
                        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Video Call
                      </Button>
                    ) : (
                      <Link href={`/doctors/${appt.doctorId}`}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                        >
                          Doctor Profile
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
