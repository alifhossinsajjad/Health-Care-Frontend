"use client";

import { useState, useEffect, useCallback } from "react";
import { labReportService } from "@/src/services/labReport.service";
import { ILabReport } from "@/src/types/labReport.type";

export const useAppointmentReports = (appointmentId: string | undefined) => {
  const [reports, setReports] = useState<ILabReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    if (!appointmentId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await labReportService.getAppointmentReports(appointmentId);
      if (res.success) {
        setReports(res.data);
      } else {
        setError(res.message || "Could not retrieve attached lab reports");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load consultation lab reports");
    } finally {
      setIsLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const addReport = (newReport: ILabReport) => {
    setReports((prev) => [newReport, ...prev.filter((r) => r.id !== newReport.id)]);
  };

  return {
    reports,
    isLoading,
    error,
    refetch: fetchReports,
    addReport,
  };
};
