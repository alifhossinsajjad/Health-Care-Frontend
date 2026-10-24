"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { labReportService } from "@/src/services/labReport.service";
import { ILabReport, ILabReportFilters } from "@/src/types/labReport.type";

export const useLabReports = (initialFilters: ILabReportFilters = {}) => {
  const [reports, setReports] = useState<ILabReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ILabReportFilters>({
    page: 1,
    limit: 12,
    reportType: "ALL",
    urgency: "ALL",
    searchTerm: "",
    ...initialFilters,
  });
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0 });

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await labReportService.getMyReports(filters);
      if (res.success) {
        setReports(res.data);
        if (res.meta) setMeta(res.meta);
      } else {
        setError(res.message || "Failed to load lab reports");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const updateFilters = (newFilters: Partial<ILabReportFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  };

  const deleteReport = async (id: string): Promise<boolean> => {
    // Optimistic removal from UI
    const previous = [...reports];
    setReports((prev) => prev.filter((r) => r.id !== id));
    setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));

    try {
      const res = await labReportService.deleteReport(id);
      if (res.success) {
        toast.success("Lab report deleted successfully.");
        return true;
      } else {
        // Rollback
        setReports(previous);
        toast.error(res.message || "Could not delete report");
        return false;
      }
    } catch {
      setReports(previous);
      toast.error("Network error while deleting report");
      return false;
    }
  };

  const linkToAppointment = async (
    reportId: string,
    appointmentId: string
  ): Promise<boolean> => {
    try {
      const res = await labReportService.linkReportToAppointment(reportId, appointmentId);
      if (res.success) {
        toast.success("Report attached to consultation successfully!");
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, appointmentId } : r))
        );
        return true;
      } else {
        toast.error(res.message || "Failed to link appointment");
        return false;
      }
    } catch {
      toast.error("Network error while linking appointment");
      return false;
    }
  };

  const addNewReport = (report: ILabReport) => {
    setReports((prev) => [report, ...prev]);
    setMeta((prev) => ({ ...prev, total: prev.total + 1 }));
  };

  return {
    reports,
    isLoading,
    error,
    filters,
    meta,
    updateFilters,
    refetch: fetchReports,
    deleteReport,
    linkToAppointment,
    addNewReport,
  };
};
