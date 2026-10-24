import React from "react";
import { Metadata } from "next";
import { AIChatContainer } from "@/src/components/modules/ai-assistant/AIChatContainer";

export const metadata: Metadata = {
  title: "AI Clinical Health Assistant & Medical Triage | HealthCare",
  description:
    "Real-time AI-powered symptom checker, specialist recommendation engine, and clinical doctor booking triage powered by intelligent clinical RAG.",
};

export default function AIAssistantPage() {
  return (
    <div className="h-[calc(100dvh-4rem)] w-full overflow-hidden bg-white dark:bg-zinc-950 flex flex-col">
      <AIChatContainer isFullPage={true} />
    </div>
  );
}
