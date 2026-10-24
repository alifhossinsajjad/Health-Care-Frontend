import React from "react";
import { Metadata } from "next";
import { PatientLabReportsView } from "@/src/components/modules/labReport/PatientLabReportsView";

export const metadata: Metadata = {
  title: "AI Lab Report Vision Analyzer | HealthCare",
  description:
    "Multimodal AI Vision analyzer for blood tests, clinical biomarkers, reference range evaluations, and bilingual medical insights.",
};

export default function MyLabReportsPage() {
  return <PatientLabReportsView />;
}
