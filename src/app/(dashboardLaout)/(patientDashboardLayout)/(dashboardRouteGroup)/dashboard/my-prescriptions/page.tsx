"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FileText, Search, Loader2, Sparkles, Filter } from "lucide-react";
import { prescriptionService } from "@/src/services/prescription.service";
import { IPrescription } from "@/src/types/prescription.type";
import { PrescriptionCard } from "@/src/components/modules/prescriptions/PrescriptionCard";
import { PrescriptionDetailsModal } from "@/src/components/modules/prescriptions/PrescriptionDetailsModal";

export default function MyPrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<IPrescription | null>(null);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const res = await prescriptionService.getMyPrescriptions({ limit: 50 });
      if (res.success && res.data) {
        setPrescriptions(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = useMemo(() => {
    if (!searchQuery.trim()) return prescriptions;
    const query = searchQuery.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.doctor?.name?.toLowerCase().includes(query) ||
        p.instructions?.toLowerCase().includes(query)
    );
  }, [prescriptions, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                My Prescriptions
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
                {prescriptions.length} Records
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              Access digital medical prescriptions, doctor advice, and downloadable official PDFs.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by doctor or medicine..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* 2. Prescription Grid or States */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Loading your prescriptions...</p>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            {searchQuery ? "No matching prescriptions found" : "No prescriptions yet"}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm mb-4">
            {searchQuery
              ? "Try searching with a different term or keyword."
              : "When your attending doctor completes a video consultation and issues a prescription, it will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrescriptions.map((prescription) => (
            <PrescriptionCard
              key={prescription.id}
              prescription={prescription}
              viewMode="PATIENT"
              onView={(p) => setSelectedPrescription(p)}
            />
          ))}
        </div>
      )}

      {/* 3. Details Modal */}
      <PrescriptionDetailsModal
        isOpen={Boolean(selectedPrescription)}
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}
