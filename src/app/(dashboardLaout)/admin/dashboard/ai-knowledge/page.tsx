import React from "react";
import { aiService } from "@/src/services/ai.service";
import { AIKnowledgeDashboardClient } from "@/src/components/modules/admin/ai-knowledge/AIKnowledgeDashboardClient";

export const metadata = {
  title: "AI Vector Knowledge Base & RAG Indexing | Admin Dashboard",
  description:
    "Monitor vector embeddings, synchronize doctor catalogs, and inspect clinical triage telemetry in real-time.",
};

export default async function AIKnowledgePage() {
  let initialStats = null;

  try {
    const res = await aiService.getAIKnowledgeStats();
    if (res?.success && res?.data) {
      initialStats = res.data;
    }
  } catch (error) {
    console.error("Failed to prefetch AI Knowledge Stats on server:", error);
  }

  return <AIKnowledgeDashboardClient initialStats={initialStats} />;
}
