"use client";

import React, { useState } from "react";
import { Video, MessageSquare } from "lucide-react";
import { IAppointment } from "@/src/types/appointment.type";
import { useWebRtc } from "@/src/hooks/useWebRtc";
import { useRealtimeChat } from "@/src/hooks/useRealtimeChat";
import { useConsultationLifecycle } from "@/src/hooks/useConsultationLifecycle";
import { ConsultationTopBar } from "./ConsultationTopBar";
import { ConsultationVideoRoom } from "./ConsultationVideoRoom";
import { ConsultationChatPanel } from "./ConsultationChatPanel";
import { IncomingCallModal } from "./IncomingCallModal";
import { MediaPermissionModal } from "./MediaPermissionModal";
import { CompleteConsultationModal } from "./CompleteConsultationModal";
import { PatientEndConsultationModal } from "./PatientEndConsultationModal";
import { CreatePrescriptionModal } from "./CreatePrescriptionModal";
import { ConsultationLabReportsDrawer } from "@/src/components/modules/labReport/ConsultationLabReportsDrawer";

interface ConsultationRoomClientProps {
  appointment: IAppointment;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "DOCTOR" | "PATIENT" | "ADMIN" | "SUPER_ADMIN";
}

export function ConsultationRoomClient({
  appointment,
  currentUserId,
  currentUserName,
  currentUserRole,
}: ConsultationRoomClientProps) {
  const [mobileTab, setMobileTab] = useState<"video" | "chat">("video");
  const [isReportsOpen, setIsReportsOpen] = useState(false);

  const isDoctor =
    String(currentUserRole).toUpperCase() === "DOCTOR" ||
    (Boolean(appointment.doctorId) && currentUserId === appointment.doctorId) ||
    (Boolean(appointment.doctor?.userId) && currentUserId === appointment.doctor?.userId) ||
    (Boolean(appointment.doctor?.id) && currentUserId === appointment.doctor?.id);

  const partnerName = isDoctor ? appointment.patient?.name || "Patient" : appointment.doctor?.name || "Doctor";
  const partnerRole = isDoctor ? "Patient" : "Doctor";
  const partnerPhoto = isDoctor ? appointment.patient?.profilePhoto : appointment.doctor?.profilePhoto;
  const partnerSpecialty = isDoctor ? "Scheduled Patient" : appointment.doctor?.designation || "Clinical Specialist";

  const webRtc = useWebRtc({
    appointmentId: appointment.id,
    videoCallingId: appointment.videoCallingId || appointment.id,
    currentUserId,
    currentUserName,
    currentUserRole,
  });

  const chat = useRealtimeChat({
    appointmentId: appointment.id,
    currentUserId,
    currentUserName,
    currentUserRole,
  });

  const lifecycle = useConsultationLifecycle({
    appointmentId: appointment.id,
    isDoctor,
    callState: webRtc.callState,
    endCall: webRtc.endCall,
    doctorName: isDoctor ? currentUserName : partnerName,
    patientName: isDoctor ? partnerName : currentUserName,
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950">
      <ConsultationTopBar
        partnerName={partnerName}
        partnerRole={partnerRole}
        partnerPhoto={partnerPhoto}
        partnerSpecialty={partnerSpecialty}
        callState={webRtc.callState}
        formattedDuration={webRtc.formattedDuration}
        isPeerOnline={chat.isPeerOnline}
        onExit={lifecycle.handleExit}
        onOpenLabReports={() => setIsReportsOpen(true)}
        isDoctor={isDoctor}
        onCompleteConsultation={() => lifecycle.setShowCompleteModal(true)}
        isCompleting={lifecycle.isCompleting}
        onOpenPrescription={() => lifecycle.setShowPrescriptionModal(true)}
      />

      <div className="flex lg:hidden bg-zinc-900 border-b border-zinc-800 p-1 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("video")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === "video" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Video Consultation</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === "chat" ? "bg-blue-600 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Live Chat ({chat.messages.length})</span>
        </button>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className={`flex-1 h-full flex flex-col min-w-0 ${mobileTab === "video" ? "flex" : "hidden lg:flex"}`}>
          <ConsultationVideoRoom
            partnerName={partnerName}
            partnerRole={partnerRole}
            partnerPhoto={partnerPhoto}
            callState={webRtc.callState}
            activeCallType={webRtc.activeCallType}
            localVideoRef={webRtc.localVideoRef}
            remoteVideoRef={webRtc.remoteVideoRef}
            isAudioMuted={webRtc.isAudioMuted}
            isVideoMuted={webRtc.isVideoMuted}
            isScreenSharing={webRtc.isScreenSharing}
            peerAudioMuted={webRtc.peerAudioMuted}
            peerVideoMuted={webRtc.peerVideoMuted}
            formattedDuration={webRtc.formattedDuration}
            onInitiateCall={webRtc.initiateCall}
            onToggleAudio={webRtc.toggleAudio}
            onToggleVideo={webRtc.toggleVideo}
            onToggleScreenShare={webRtc.toggleScreenShare}
            onEndCall={webRtc.endCall}
          />
        </div>

        <div className={`w-full lg:w-[420px] xl:w-[480px] h-full flex flex-col shrink-0 ${mobileTab === "chat" ? "flex" : "hidden lg:flex"}`}>
          <ConsultationChatPanel
            messages={chat.messages}
            currentUserId={currentUserId}
            partnerName={partnerName}
            partnerPhoto={partnerPhoto}
            partnerRole={partnerRole}
            isPeerOnline={chat.isPeerOnline}
            isPeerTyping={chat.isPeerTyping}
            peerTypingUser={chat.peerTypingUser}
            isUploading={chat.isUploading}
            onSendMessage={chat.sendMessage}
            onSendTyping={chat.sendTyping}
            onEditMessage={chat.editMessage}
            onDeleteMessage={chat.deleteMessage}
            onUploadAttachment={chat.uploadAndSendAttachment}
            onMarkAsRead={chat.markAsRead}
          />
        </div>
      </div>

      <IncomingCallModal incomingCall={webRtc.incomingCall} onAccept={webRtc.acceptCall} onReject={webRtc.rejectCall} />
      <MediaPermissionModal
        error={webRtc.permissionError}
        onClose={() => webRtc.setPermissionError(null)}
        onRetry={() => {
          webRtc.setPermissionError(null);
          webRtc.initiateCall(webRtc.activeCallType);
        }}
      />
      <ConsultationLabReportsDrawer
        appointmentId={appointment.id}
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
      />
      <CompleteConsultationModal
        isOpen={lifecycle.showCompleteModal}
        isCompleting={lifecycle.isCompleting}
        isWaitingForPatient={lifecycle.isWaitingForPatient}
        patientName={partnerName}
        onRequestEnd={lifecycle.handleRequestEnd}
        onForceComplete={lifecycle.executeComplete}
        onClose={() => lifecycle.setShowCompleteModal(false)}
      />
      <PatientEndConsultationModal
        isOpen={lifecycle.showPatientEndModal}
        doctorName={partnerName}
        isCompleting={lifecycle.isCompleting}
        onConfirm={lifecycle.handlePatientConfirmEnd}
        onDecline={lifecycle.handlePatientDeclineEnd}
      />
      <CreatePrescriptionModal
        isOpen={lifecycle.showPrescriptionModal}
        appointmentId={appointment.id}
        patientName={partnerName}
        onSuccess={lifecycle.handlePrescriptionSuccess}
        onClose={() => lifecycle.setShowPrescriptionModal(false)}
      />
    </div>
  );
}
