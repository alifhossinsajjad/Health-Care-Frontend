"use client";

import React, { useState, useEffect, useMemo } from "react";
import { FileText, Search, Loader2, Download, Eye, Stethoscope, User, Calendar } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { prescriptionService } from "@/src/services/prescription.service";
import { IPrescription } from "@/src/types/prescription.type";
import { PrescriptionDetailsModal } from "@/src/components/modules/prescriptions/PrescriptionDetailsModal";

export default function PrescriptionsManagementPage() {
  const [prescriptions, setPrescriptions] = useState<IPrescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<IPrescription | null>(null);

  const fetchPrescriptions = async () => {
    setIsLoading(true);
    try {
      const res = await prescriptionService.getAllPrescriptions({ limit: 100 });
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
        p.doctor?.email?.toLowerCase().includes(query) ||
        p.patient?.name?.toLowerCase().includes(query) ||
        p.patient?.email?.toLowerCase().includes(query) ||
        p.instructions?.toLowerCase().includes(query)
    );
  }, [prescriptions, searchQuery]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 p-6 rounded-3xl shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50">
                Prescriptions Management
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900">
                {prescriptions.length} System Records
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              System-wide audit of all digital prescriptions issued across consultations and physicians.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor, patient, or email..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-3" />
          <p className="text-sm font-medium">Loading platform prescriptions...</p>
        </div>
      ) : filteredPrescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl text-center">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            No prescriptions found
          </h3>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-sm">
            {searchQuery
              ? "No prescriptions match your search criteria."
              : "Prescriptions created by doctors across the system will appear here."}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200/80 dark:border-zinc-800 text-zinc-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Doctor</th>
                  <th className="py-3.5 px-4">Patient</th>
                  <th className="py-3.5 px-4">Instructions</th>
                  <th className="py-3.5 px-4">Issued Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                {filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-950/50 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-blue-500 shrink-0" />
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">
                            {prescription.doctor?.name || "Doctor"}
                          </p>
                          <p className="text-[11px] text-zinc-400">{prescription.doctor?.email || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {prescription.patient?.name || "Patient"}
                          </p>
                          <p className="text-[11px] text-zinc-400">{prescription.patient?.email || ""}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-zinc-600 dark:text-zinc-300 line-clamp-2">
                        {prescription.instructions}
                      </p>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-zinc-500">
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPrescription(prescription)}
                          className="h-8 px-2.5 rounded-xl text-xs gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Button>
                        {prescription.pdfUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(prescription.pdfUrl!, "_blank")}
                            className="h-8 px-2.5 rounded-xl text-xs gap-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span>PDF</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <PrescriptionDetailsModal
        isOpen={Boolean(selectedPrescription)}
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </div>
  );
}
