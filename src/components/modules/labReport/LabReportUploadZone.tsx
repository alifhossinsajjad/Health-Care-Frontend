"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Camera, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { AIAnalyzingLoader } from "./AIAnalyzingLoader";
import { useLabReportUpload } from "@/src/hooks/labReport/useLabReportUpload";
import { ILabReport } from "@/src/types/labReport.type";

interface LabReportUploadZoneProps {
  appointmentId?: string;
  onAnalysisComplete?: (report: ILabReport) => void;
}

export function LabReportUploadZone({
  appointmentId,
  onAnalysisComplete,
}: LabReportUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [reportCustomName, setReportCustomName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { uploadAndAnalyze, isAnalyzing, progressStage, activeFileName } =
    useLabReportUpload({
      onSuccess: (report) => {
        setReportCustomName("");
        onAnalysisComplete?.(report);
      },
    });

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    uploadAndAnalyze(file, appointmentId, reportCustomName.trim() || undefined);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  if (isAnalyzing) {
    return <AIAnalyzingLoader stage={progressStage} fileName={activeFileName} />;
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-xs">
      {/* Optional Custom Label */}
      <div className="mb-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1">
          <Input
            placeholder="Report Name (e.g. 'CBC Blood Test - Feb 2026', optional)"
            value={reportCustomName}
            onChange={(e) => setReportCustomName(e.target.value)}
            className="h-10 text-xs sm:text-sm rounded-xl"
            disabled={isAnalyzing}
          />
        </div>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
          isDragOver
            ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[0.99]"
            : "border-zinc-200 dark:border-zinc-800 hover:border-blue-400 bg-zinc-50/50 dark:bg-zinc-950/50"
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4 shadow-xs">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h4 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 mb-1">
          Drop your lab report here, or{" "}
          <span className="text-blue-600 dark:text-blue-400 hover:underline">
            browse files
          </span>
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4 max-w-sm mx-auto">
          Supports clear scans or photos of PDF, PNG, JPG, or WebP (max 20MB). Works with Popular, Ibn Sina, Square, Evercare & all standard lab formats.
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="rounded-xl text-xs font-semibold gap-1.5"
          >
            <FileText className="h-3.5 w-3.5" /> Select File
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              cameraInputRef.current?.click();
            }}
            className="rounded-xl text-xs font-semibold gap-1.5"
          >
            <Camera className="h-3.5 w-3.5" /> Snap Photo
          </Button>
        </div>
      </div>
    </div>
  );
}
