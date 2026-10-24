"use client";

import React, { useState, useEffect } from "react";
import { X, Edit3, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { prescriptionService } from "@/src/services/prescription.service";
import { IPrescription } from "@/src/types/prescription.type";

interface EditPrescriptionModalProps {
  isOpen: boolean;
  prescription: IPrescription | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function EditPrescriptionModal({
  isOpen,
  prescription,
  onSuccess,
  onClose,
}: EditPrescriptionModalProps) {
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (prescription) {
      setInstructions(prescription.instructions || "");
      if (prescription.followUpDate) {
        setFollowUpDate(new Date(prescription.followUpDate).toISOString().split("T")[0]);
      } else {
        setFollowUpDate("");
      }
    }
  }, [prescription]);

  if (!isOpen || !prescription) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructions.trim()) {
      toast.error("Please enter prescription instructions.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: { instructions: string; followUpDate?: string } = {
        instructions: instructions.trim(),
      };
      if (followUpDate) {
        payload.followUpDate = new Date(followUpDate).toISOString();
      }

      const res = await prescriptionService.updatePrescription(prescription.id, payload);
      if (res.success) {
        toast.success("Prescription updated successfully!");
        onSuccess();
      } else {
        toast.error(res.message || "Failed to update prescription.");
      }
    } catch {
      toast.error("Network error updating prescription.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Edit3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Edit Prescription
            </h3>
            <p className="text-xs text-zinc-500">
              Updating advice for {prescription.patient?.name || "Patient"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Clinical Advice & Instructions <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isSaving}
              className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
              Next Follow-Up Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={followUpDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setFollowUpDate(e.target.value)}
                disabled={isSaving}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              <Calendar className="absolute right-3.5 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={onClose}
              className="rounded-xl text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSaving || !instructions.trim()}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5 shadow-sm"
            >
              <Edit3 className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
