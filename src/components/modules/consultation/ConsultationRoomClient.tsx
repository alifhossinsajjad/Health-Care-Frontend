"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Video, MessageSquare } from "lucide-react";
import { IAppointment } from "@/src/types/appointment.type";
import { useWebRtc } from "@/src/hooks/useWebRtc";
import { useRealtimeChat } from "@/src/hooks/useRealtimeChat";
import { ConsultationTopBar } from "./ConsultationTopBar";
import { ConsultationVideoRoom } from "./ConsultationVideoRoom";
import { ConsultationChatPanel } from "./ConsultationChatPanel";
import { IncomingCallModal } from "./IncomingCallModal";
import { MediaPermissionModal } from "./MediaPermissionModal";
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
  const router = useRouter();
  const [mobileActiveTab, setMobileActiveTab] = useState<"video" | "chat">("video");
  const [isLabReportsOpen, setIsLabReportsOpen] = useState(false);

  // Determine partner profile based on current role and ID matching
  const isDoctor =
    String(currentUserRole).toUpperCase() === "DOCTOR" ||
    (Boolean(appointment.doctorId) && currentUserId === appointment.doctorId) ||
    (Boolean(appointment.doctor?.userId) && currentUserId === appointment.doctor?.userId) ||
    (Boolean(appointment.doctor?.id) && currentUserId === appointment.doctor?.id);
  const partnerName = isDoctor
    ? appointment.patient?.name || "Patient"
    : appointment.doctor?.name || "Doctor";
  const partnerRole = isDoctor ? "Patient" : "Doctor";
  const partnerPhoto = isDoctor
    ? appointment.patient?.profilePhoto
    : appointment.doctor?.profilePhoto;
  const partnerSpecialty = isDoctor
    ? "Scheduled Patient"
    : appointment.doctor?.designation || "Clinical Specialist";

  // 1. WebRTC Calling Engine Hook
  const {
    callState,
    activeCallType,
    incomingCall,
    localVideoRef,
    remoteVideoRef,
    isAudioMuted,
    isVideoMuted,
    isScreenSharing,
    peerAudioMuted,
    peerVideoMuted,
    formattedDuration,
    permissionError,
    setPermissionError,
    initiateCall,
    acceptCall,
    rejectCall,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endCall,
  } = useWebRtc({
    appointmentId: appointment.id,
    videoCallingId: appointment.videoCallingId || appointment.id,
    currentUserId,
    currentUserName,
    currentUserRole,
  });

  // 2. Real-Time Telemedicine Messaging Hook
  const {
    messages,
    isPeerOnline,
    isPeerTyping,
    peerTypingUser,
    isUploading,
    sendMessage,
    sendTyping,
    markAsRead,
    editMessage,
    deleteMessage,
    uploadAndSendAttachment,
  } = useRealtimeChat({
    appointmentId: appointment.id,
    currentUserId,
    currentUserName,
    currentUserRole,
  });

  const handleExit = () => {
    if (callState === "CONNECTED" || callState === "CALLING") {
      endCall();
    }
    if (isDoctor) {
      router.push("/doctor/dashboard/appointments");
    } else {
      router.push("/dashboard/my-appointments");
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950">
      {/* 1. Consultation Room Top Bar */}
      <ConsultationTopBar
        partnerName={partnerName}
        partnerRole={partnerRole}
        partnerPhoto={partnerPhoto}
        partnerSpecialty={partnerSpecialty}
        callState={callState}
        formattedDuration={formattedDuration}
        isPeerOnline={isPeerOnline}
        onExit={handleExit}
        onOpenLabReports={() => setIsLabReportsOpen(true)}
      />

      {/* 2. Mobile Responsive Tab Switcher (Visible on < lg screens) */}
      <div className="flex lg:hidden bg-zinc-900 border-b border-zinc-800 p-1 shrink-0">
        <button
          type="button"
          onClick={() => setMobileActiveTab("video")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            mobileActiveTab === "video"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Video Consultation</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileActiveTab("chat")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
            mobileActiveTab === "chat"
              ? "bg-blue-600 text-white shadow-sm"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Live Chat ({messages.length})</span>
        </button>
      </div>

      {/* 3. Main Split Viewport */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Column: WebRTC Video Room */}
        <div
          className={`flex-1 h-full flex flex-col min-w-0 ${
            mobileActiveTab === "video" ? "flex" : "hidden lg:flex"
          }`}
        >
          <ConsultationVideoRoom
            partnerName={partnerName}
            partnerRole={partnerRole}
            partnerPhoto={partnerPhoto}
            callState={callState}
            activeCallType={activeCallType}
            localVideoRef={localVideoRef}
            remoteVideoRef={remoteVideoRef}
            isAudioMuted={isAudioMuted}
            isVideoMuted={isVideoMuted}
            isScreenSharing={isScreenSharing}
            peerAudioMuted={peerAudioMuted}
            peerVideoMuted={peerVideoMuted}
            formattedDuration={formattedDuration}
            onInitiateCall={initiateCall}
            onToggleAudio={toggleAudio}
            onToggleVideo={toggleVideo}
            onToggleScreenShare={toggleScreenShare}
            onEndCall={endCall}
          />
        </div>

        {/* Right Column: WhatsApp / Messenger Chat Panel */}
        <div
          className={`w-full lg:w-[420px] xl:w-[480px] h-full flex flex-col shrink-0 ${
            mobileActiveTab === "chat" ? "flex" : "hidden lg:flex"
          }`}
        >
          <ConsultationChatPanel
            messages={messages}
            currentUserId={currentUserId}
            partnerName={partnerName}
            partnerPhoto={partnerPhoto}
            partnerRole={partnerRole}
            isPeerOnline={isPeerOnline}
            isPeerTyping={isPeerTyping}
            peerTypingUser={peerTypingUser}
            isUploading={isUploading}
            onSendMessage={sendMessage}
            onSendTyping={sendTyping}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
            onUploadAttachment={uploadAndSendAttachment}
            onMarkAsRead={markAsRead}
          />
        </div>
      </div>

      {/* 4. Modals */}
      <IncomingCallModal
        incomingCall={incomingCall}
        onAccept={acceptCall}
        onReject={rejectCall}
      />

      <MediaPermissionModal
        error={permissionError}
        onClose={() => setPermissionError(null)}
        onRetry={() => {
          setPermissionError(null);
          initiateCall(activeCallType);
        }}
      />

      <ConsultationLabReportsDrawer
        appointmentId={appointment.id}
        isOpen={isLabReportsOpen}
        onClose={() => setIsLabReportsOpen(false)}
      />
    </div>
  );
}
