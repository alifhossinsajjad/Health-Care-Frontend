import React from "react";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  CreditCard, 
  Download, 
  ArrowRight, 
  Stethoscope, 
  FileText,
  Video
} from "lucide-react";
import { getMySingleAppointment } from "@/src/services/appointment.service";
import { Button } from "@/src/components/ui/button";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    appointment_id?: string;
    payment_id?: string;
  }>;
}

export const metadata = {
  title: "Payment Successful | Health Care",
  description: "Your appointment consultation payment was successfully processed.",
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const resolvedParams = await searchParams;
  const appointmentId = resolvedParams.appointment_id;

  let appointment = null;
  if (appointmentId) {
    const res = await getMySingleAppointment(appointmentId);
    if (res.success && res.data) {
      appointment = res.data;
    }
  }

  const doctor = appointment?.doctor;
  const schedule = appointment?.schedule;
  const payment = appointment?.payment;

  const formattedDate = schedule?.startDateTime
    ? format(parseISO(schedule.startDateTime), "EEEE, dd MMMM yyyy")
    : null;

  const formattedTime =
    schedule?.startDateTime && schedule?.endDateTime
      ? `${format(parseISO(schedule.startDateTime), "hh:mm a")} - ${format(
          parseISO(schedule.endDateTime),
          "hh:mm a"
        )}`
      : null;

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 min-h-[80vh] max-w-2xl mx-auto w-full">
      {/* Success Card */}
      <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col items-center text-center">
        {/* Animated Badge Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-950/20 shadow-lg shadow-emerald-600/10 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Payment Successful!
        </h1>
        <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-2 max-w-md">
          Your appointment has been confirmed and the consultation fee was securely processed via Stripe.
        </p>

        {/* Appointment & Receipt Breakdown */}
        {appointment && (
          <div className="w-full mt-8 p-5 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-left space-y-4">
            {/* Doctor Info */}
            {doctor && (
              <div className="flex items-start gap-3.5 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-50 text-sm sm:text-base">
                    Dr. {doctor.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {doctor.designation} • {doctor.currentWorkingPlace}
                  </p>
                </div>
              </div>
            )}

            {/* Schedule Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {formattedDate && (
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              )}
              {formattedTime && (
                <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{formattedTime}</span>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">Amount Paid:</span>
              <span className="font-bold text-base text-zinc-900 dark:text-zinc-50 flex items-center gap-1">
                ৳ {payment?.amount || doctor?.appointmentFee}
              </span>
            </div>

            {payment?.transactionId && (
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-zinc-600 dark:text-zinc-400">
                  {payment.transactionId}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Invoice Download Action (If Cloudinary URL available) */}
        {payment?.invoiceUrl ? (
          <div className="w-full mt-5">
            <a
              href={payment.invoiceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm transition-all"
            >
              <Download className="w-4 h-4" />
              Download Official Invoice (PDF)
            </a>
          </div>
        ) : (
          <div className="w-full mt-5 p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center gap-2 text-xs text-blue-700 dark:text-blue-300">
            <FileText className="w-4 h-4 shrink-0" />
            <span>An official PDF invoice has also been sent to your email.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/my-appointments" className="flex-1">
            <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 shadow-md shadow-blue-600/20">
              <span>View My Appointments</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full rounded-full py-3">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
