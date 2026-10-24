"use client";

import React, { useState, useEffect } from "react";
import { Calendar, User, Check, X, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { getMyAppointments } from "@/src/services/appointment.service";
import { IAppointment } from "@/src/types/appointment.type";
import { ILabReport } from "@/src/types/labReport.type";
import { labReportService } from "@/src/services/labReport.service";

interface LinkReportToAppointmentModalProps {
  report: ILabReport | null;
  isOpen: boolean;
  onClose: () => void;
  onLinked?: (reportId: string, appointmentId: string) => void;
}

export function LinkReportToAppointmentModal({
  report,
  isOpen,
  onClose,
  onLinked,
}: LinkReportToAppointmentModalProps) {
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linkingId, setLinkingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setIsLoading(true);
    getMyAppointments({ limit: 15 })
      .then((res) => {
        if (res.success && res.data) {
          // Filter to show active/booked/pending appointments first
          setAppointments(res.data);
        }
      })
      .catch(() => toast.error("Could not fetch appointments"))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  if (!isOpen || !report) return null;

  const handleLink = async (appointmentId: string) => {
    setLinkingId(appointmentId);
    try {
      const res = await labReportService.linkReportToAppointment(report.id, appointmentId);
      if (res.success) {
        toast.success("Lab report attached to consultation room!");
        onLinked?.(report.id, appointmentId);
        onClose();
      } else {
        toast.error(res.message || "Failed to attach report.");
      }
    } catch {
      toast.error("Network error while attaching report.");
    } finally {
      setLinkingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div>
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              Attach Report to Consultation
            </h3>
            <p className="text-xs text-zinc-500 truncate max-w-xs">
              {report.reportName || "Selected Lab Report"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-zinc-400">
              <Clock className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-500" />
              <span>Loading your appointments...</span>
            </div>
          ) : appointments.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 space-y-2">
              <AlertCircle className="h-6 w-6 mx-auto text-amber-500" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                No active appointments found
              </p>
              <p className="text-xs text-zinc-500">
                Book a doctor consultation first to attach your medical report.
              </p>
            </div>
          ) : (
            appointments.map((apt) => {
              const isAlreadyLinked = report.appointmentId === apt.id;
              const isLinkingThis = linkingId === apt.id;

              return (
                <div
                  key={apt.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isAlreadyLinked
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                      : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-blue-300"
                  }`}
                >
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {apt.doctor?.name || "Doctor Consultation"}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {apt.doctor?.designation || "Specialist Physician"}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span>
                        {apt.schedule?.startDateTime
                          ? new Date(apt.schedule.startDateTime).toLocaleDateString()
                          : "Scheduled"}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    disabled={isAlreadyLinked || Boolean(linkingId)}
                    onClick={() => handleLink(apt.id)}
                    className={`h-8 px-3 rounded-xl text-xs font-bold shrink-0 ${
                      isAlreadyLinked
                        ? "bg-emerald-600 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isAlreadyLinked ? (
                      <span className="flex items-center gap-1">
                        <Check className="h-3 w-3" /> Attached
                      </span>
                    ) : isLinkingThis ? (
                      "Attaching..."
                    ) : (
                      "Attach"
                    )}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
