"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getSocket, soundAlerts } from "@/src/lib/socket";
import { changeAppointmentStatus } from "@/src/services/appointment.service";
import { CallState } from "@/src/types/webrtc.type";

interface UseConsultationLifecycleProps {
  appointmentId: string;
  isDoctor: boolean;
  callState: CallState;
  endCall: () => void;
  doctorName?: string;
  patientName?: string;
}

export function useConsultationLifecycle({
  appointmentId,
  isDoctor,
  callState,
  endCall,
  doctorName = "Doctor",
  patientName = "Patient",
}: UseConsultationLifecycleProps) {
  const router = useRouter();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isWaitingForPatient, setIsWaitingForPatient] = useState(false);
  const [showPatientEndModal, setShowPatientEndModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const socketRef = useRef<any>(null);

  useEffect(() => {
    getSocket().then((s) => {
      socketRef.current = s;
    });
  }, []);

  const handleExit = useCallback(() => {
    if (callState === "CONNECTED" || callState === "CALLING") endCall();
    router.push(isDoctor ? "/doctor/dashboard/appointments" : "/dashboard/my-appointments");
  }, [callState, endCall, isDoctor, router]);

  const executeComplete = useCallback(async () => {
    setIsCompleting(true);
    try {
      const res = await changeAppointmentStatus(appointmentId, "COMPLETED");
      if (res.success) {
        toast.success("Consultation officially completed!");
        if (callState === "CONNECTED" || callState === "CALLING") endCall();
        router.push(isDoctor ? "/doctor/dashboard/appointments" : "/dashboard/my-appointments");
      } else {
        toast.error(res.message || "Failed to complete consultation.");
      }
    } catch {
      toast.error("Network error completing consultation.");
    } finally {
      setIsCompleting(false);
      setShowCompleteModal(false);
      setIsWaitingForPatient(false);
    }
  }, [appointmentId, callState, endCall, isDoctor, router]);

  // Doctor sends end request to patient
  const handleRequestEnd = useCallback(() => {
    if (socketRef.current) {
      const payload = { appointmentId, doctorName };
      socketRef.current.emit("consultation:request_end", payload);
      socketRef.current.emit("call:request-end", payload);
      socketRef.current.emit("chat:send", {
        appointmentId,
        content: `__CONSULTATION_REQUEST_END__:${JSON.stringify(payload)}`,
        message: `__CONSULTATION_REQUEST_END__:${JSON.stringify(payload)}`,
        messageType: "TEXT",
      });
    }
    setIsWaitingForPatient(true);
    toast.info(`End request sent to ${patientName}. Awaiting confirmation...`);
  }, [appointmentId, doctorName, patientName]);

  // Patient confirms end
  const handlePatientConfirmEnd = useCallback(() => {
    setShowPatientEndModal(false);
    if (socketRef.current) {
      socketRef.current.emit("consultation:end_confirmed", { appointmentId });
      socketRef.current.emit("call:end-confirmed", { appointmentId });
      socketRef.current.emit("chat:send", {
        appointmentId,
        content: `__CONSULTATION_END_CONFIRMED__:${JSON.stringify({ appointmentId })}`,
        message: `__CONSULTATION_END_CONFIRMED__:${JSON.stringify({ appointmentId })}`,
        messageType: "TEXT",
      });
    }
    toast.info("Ending consultation session...");
  }, [appointmentId]);

  // Patient declines end
  const handlePatientDeclineEnd = useCallback(() => {
    setShowPatientEndModal(false);
    if (socketRef.current) {
      socketRef.current.emit("consultation:end_declined", { appointmentId });
      socketRef.current.emit("call:end-declined", { appointmentId });
      socketRef.current.emit("chat:send", {
        appointmentId,
        content: `__CONSULTATION_END_DECLINED__:${JSON.stringify({ appointmentId })}`,
        message: `__CONSULTATION_END_DECLINED__:${JSON.stringify({ appointmentId })}`,
        messageType: "TEXT",
      });
    }
    toast.info("Consultation ongoing. Feel free to discuss with the doctor.");
  }, [appointmentId]);

  const handlePrescriptionSuccess = useCallback(() => {
    setShowPrescriptionModal(false);
    toast.success("Prescription saved. You can now discuss it with the patient.");
  }, []);

  // Socket event listeners
  useEffect(() => {
    let mounted = true;

    getSocket().then((socket) => {
      if (!mounted || !socket) return;

      const onRequestEnd = () => {
        if (!isDoctor) {
          setShowPatientEndModal(true);
          soundAlerts.playMessageChime();
        }
      };

      const onEndDeclined = () => {
        if (isDoctor) {
          setIsWaitingForPatient(false);
          setShowCompleteModal(false);
          toast.info(`${patientName} has more questions. Consultation continues.`, { duration: 5000 });
        }
      };

      const onEndConfirmed = () => {
        if (isDoctor) executeComplete();
      };

      const onCompleted = () => {
        if (callState === "CONNECTED" || callState === "CALLING") endCall();
        toast.success("Consultation finalized successfully!");
        router.push(isDoctor ? "/doctor/dashboard/appointments" : "/dashboard/my-prescriptions");
      };

      const handleChatMessage = (data: any) => {
        const raw = data?.message && typeof data.message === "object" ? data.message : data;
        const text = String(raw?.content || raw?.message || "");

        if (text.startsWith("__CONSULTATION_REQUEST_END__:") && !isDoctor) {
          onRequestEnd();
        } else if (text.startsWith("__CONSULTATION_END_DECLINED__:") && isDoctor) {
          onEndDeclined();
        } else if (text.startsWith("__CONSULTATION_END_CONFIRMED__:") && isDoctor) {
          onEndConfirmed();
        }
      };

      socket.on("prescription:issued", (d: any) => {
        if (!isDoctor) toast.success(d?.message || "Doctor has issued your prescription! You can discuss it now.");
      });
      socket.on("consultation:request_end", onRequestEnd);
      socket.on("call:request-end", onRequestEnd);
      socket.on("consultation:end_declined", onEndDeclined);
      socket.on("call:end-declined", onEndDeclined);
      socket.on("consultation:end_confirmed", onEndConfirmed);
      socket.on("call:end-confirmed", onEndConfirmed);
      socket.on("consultation:completed", onCompleted);
      socket.on("chat:message", handleChatMessage);
      socket.on("chat:new", handleChatMessage);

      return () => {
        socket.off("prescription:issued");
        socket.off("consultation:request_end", onRequestEnd);
        socket.off("call:request-end", onRequestEnd);
        socket.off("consultation:end_declined", onEndDeclined);
        socket.off("call:end-declined", onEndDeclined);
        socket.off("consultation:end_confirmed", onEndConfirmed);
        socket.off("call:end-confirmed", onEndConfirmed);
        socket.off("consultation:completed", onCompleted);
        socket.off("chat:message", handleChatMessage);
        socket.off("chat:new", handleChatMessage);
      };
    });

    return () => {
      mounted = false;
    };
  }, [appointmentId, isDoctor, router, callState, endCall, executeComplete, patientName]);

  return {
    showCompleteModal,
    setShowCompleteModal,
    isWaitingForPatient,
    showPatientEndModal,
    showPrescriptionModal,
    setShowPrescriptionModal,
    isCompleting,
    handleExit,
    handleRequestEnd,
    executeComplete,
    handlePatientConfirmEnd,
    handlePatientDeclineEnd,
    handlePrescriptionSuccess,
  };
}
