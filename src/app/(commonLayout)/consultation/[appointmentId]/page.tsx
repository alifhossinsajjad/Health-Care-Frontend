import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
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
    currentUserRole = decoded?.role || "PATIENT";
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

  return (
    <ConsultationRoomClient
      appointment={appointment}
      currentUserId={currentUserId}
      currentUserName={currentUserName}
      currentUserRole={currentUserRole}
    />
  );
}
