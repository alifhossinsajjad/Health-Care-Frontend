"use client";

import React, { useState } from "react";
import { FileText, Calendar, X, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { prescriptionService } from "@/src/services/prescription.service";

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  appointmentId: string;
  patientName: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function CreatePrescriptionModal({
  isOpen,
  appointmentId,
  patientName,
  onSuccess,
  onClose,
}: CreatePrescriptionModalProps) {
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) {
      toast.error("Please enter prescription instructions or medications.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: { appointmentId: string; instructions: string; followUpDate?: string } = {
        appointmentId,
        instructions: instructions.trim(),
      };
      if (followUpDate) {
        payload.followUpDate = new Date(followUpDate).toISOString();
      }

      const res = await prescriptionService.createPrescription(payload);
      if (res.success) {
        toast.success("Prescription issued successfully! You can now discuss it with the patient.");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to create prescription.");
      }
    } catch {
      toast.error("Network error creating prescription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Write Digital Prescription
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Prescribing for <span className="font-semibold text-zinc-800 dark:text-zinc-200">{patientName}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Medications & Clinical Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Tab. Paracetamol 500mg - 1+0+1 after meals for 5 days. Drink warm water..."
              disabled={isSubmitting}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Next Follow-Up Date (Optional)
            </label>
            <div className="relative">
              <input
                type="date"
                value={followUpDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={isSubmitting}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              <Calendar className="absolute right-3.5 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
              Issuing this prescription generates an official PDF and emails it to the patient. The video call will remain open so you can discuss the instructions together.
            </p>
          </div>

          <div className="flex items-center gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={onClose}
              className="rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !instructions.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <FileText className="h-4 w-4" />
              <span>{isSubmitting ? "Generating PDF..." : "Issue Prescription"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
