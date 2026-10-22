import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CreditCard } from "lucide-react";
import { getMySingleAppointment } from "@/src/services/appointment.service";
import { ConsultationRoomClient } from "@/src/components/modules/consultation/ConsultationRoomClient";
import { Button } from "@/src/components/ui/button";

interface ConsultationPageProps {
  params: Promise<{ appointmentId: string }>;
}

export const metadata = {
  title: "Live Telehealth Consultation & Chat | HealthCare",
  description:
    "Secure real-time WebRTC video consultation and encrypted telemedicine messaging room.",
};

export default async function ConsultationRoomPage({
  params,
}: ConsultationPageProps) {
  const { appointmentId } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect(`/login?redirect=/consultation/${appointmentId}`);
  }

  let currentUserId = "";
  let currentUserName = "User";
  let currentUserRole: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN" = "PATIENT";

  try {
    const decoded: any = jwtDecode(token);
    currentUserId = decoded?.id || decoded?.userId || "";
    currentUserName = decoded?.name || decoded?.email?.split("@")[0] || "User";
    const rawRole = (decoded?.role || "PATIENT").toUpperCase();
    currentUserRole = rawRole as any;
  } catch (err) {
    console.error("JWT decode error in consultation page:", err);
  }

  const res = await getMySingleAppointment(appointmentId);
  const appointment = res?.data;

  if (!appointment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mb-3">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          Consultation Room Not Found
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
          Could not find an active appointment with ID: <span className="font-mono">{appointmentId}</span>. Please verify that this consultation is booked.
        </p>
        <Button asChild className="mt-6 rounded-xl">
          <Link href="/dashboard/my-appointments" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to My Appointments
          </Link>
        </Button>
      </div>
    );
  }

  // Payment Confirmation Guard: Block entering the room if unpaid
  const isPaid =
    appointment.paymentStatus === "PAID" ||
    appointment.payment?.status === "PAID";

  if (!isPaid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-zinc-50 dark:bg-zinc-950">
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mb-4 border border-amber-200 dark:border-amber-900/50 shadow-md">
          <CreditCard className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Payment Confirmation Required
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md">
          {currentUserRole === "DOCTOR"
            ? "This consultation room is currently locked because the patient has not completed their payment yet."
            : "You must complete the payment for this appointment before entering the live video consultation room."}
        </p>

        <div className="flex items-center gap-3 mt-6">
          <Button asChild variant="outline" className="rounded-full">
            <Link
              href={
                currentUserRole === "DOCTOR"
                  ? "/doctor/dashboard/appointments"
                  : "/dashboard/my-appointments"
              }
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Appointments
            </Link>
          </Button>

          {currentUserRole === "PATIENT" && (
            <Button
              asChild
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2"
            >
              <Link href="/dashboard/my-appointments">
                <CreditCard className="h-4 w-4" /> Pay Online
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <ConsultationRoomClient
      appointment={appointment}
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      currentUserRole={currentUserRole}
    />
  );
}
