"use client";

import { useState } from "react";
import { toast } from "sonner";
import { labReportService } from "@/src/services/labReport.service";
import { ILabReport } from "@/src/types/labReport.type";
import { sanitizeAiErrorMessage } from "@/src/utils/aiErrorSanitizer";

const VALID_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

interface UseLabReportUploadProps {
  onSuccess?: (report: ILabReport) => void;
  onError?: (errorMsg: string) => void;
}

export const useLabReportUpload = ({
  onSuccess,
  onError,
}: UseLabReportUploadProps = {}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressStage, setProgressStage] = useState<string>("");
  const [activeFileName, setActiveFileName] = useState<string>("");

  const uploadAndAnalyze = async (
    file: File,
    appointmentId?: string,
    reportName?: string
  ): Promise<ILabReport | null> => {
    // 1. Validation: File Format
    if (!VALID_MIME_TYPES.includes(file.type.toLowerCase())) {
      const msg = "Invalid file type. Please upload a PDF, PNG, JPEG, or WebP lab report.";
      toast.error(msg);
      onError?.(msg);
      return null;
    }

    // 2. Validation: File Size Limit (20MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const msg = "File exceeds the 20MB limit. Please compress or crop your document.";
      toast.error(msg);
      onError?.(msg);
      return null;
    }

    setIsAnalyzing(true);
    setActiveFileName(file.name);
    setProgressStage("Uploading document to secure HIPAA-compliant cloud storage...");

    // Staged feedback simulation to give user dynamic visibility during AI multimodal inference
    const t1 = setTimeout(() => {
      setProgressStage("Advanced AI Vision scanning biomarkers and clinical text...");
    }, 1600);

    const t2 = setTimeout(() => {
      setProgressStage("Cross-referencing reference ranges & compiling bilingual clinical insights...");
    }, 3800);

    const t3 = setTimeout(() => {
      setProgressStage("Synthesizing actionable doctor consultation checklist...");
    }, 6000);

    try {
      const res = await labReportService.analyzeReport(
        file,
        appointmentId,
        reportName || file.name.replace(/\.[^/.]+$/, "")
      );

      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);

      if (res.success && res.data) {
        toast.success("Lab report successfully scanned and analyzed!");
        onSuccess?.(res.data);
        return res.data;
      } else {
        throw new Error(res.message || "Failed to analyze document.");
      }
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      const msg = sanitizeAiErrorMessage(err);
      toast.error(msg);
      onError?.(msg);
      return null;
    } finally {
      setIsAnalyzing(false);
      setProgressStage("");
      setActiveFileName("");
    }
  };

  return {
    uploadAndAnalyze,
    isAnalyzing,
    progressStage,
    activeFileName,
  };
};
