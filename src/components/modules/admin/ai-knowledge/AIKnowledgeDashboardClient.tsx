"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sparkles,
  RefreshCw,
  Database,
  Stethoscope,
  Hospital,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Layers,
  Cpu,
  Search,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { StatCard } from "@/src/components/shared/stats/StatCard";
import { aiService } from "@/src/services/ai.service";
import { IAIKnowledgeStats, IAINonStreamingResponseData } from "@/src/types/ai.type";

interface AIKnowledgeDashboardClientProps {
  initialStats?: IAIKnowledgeStats | null;
}

export function AIKnowledgeDashboardClient({
  initialStats,
}: AIKnowledgeDashboardClientProps) {
  const [stats, setStats] = useState<IAIKnowledgeStats | null>(initialStats || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  // Interactive Live Triage Sandbox State
  const [testQuery, setTestQuery] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [testResponse, setTestResponse] = useState<IAINonStreamingResponseData | null>(null);

  // Fetch / Refresh Stats
  const fetchStats = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const res = await aiService.getAIKnowledgeStats();
      if (res.success && res.data) {
        setStats(res.data);
        setLastRefreshed(new Date());
        if (!silent) toast.success("AI Knowledge statistics updated successfully.");
      } else {
        if (!silent) toast.error(res.message || "Failed to load vector store statistics.");
      }
    } catch {
      if (!silent) toast.error("Network error while contacting AI service.");
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  // Trigger Full Vector Sync
  const handleSyncKnowledge = async () => {
    setIsSyncing(true);
    const toastId = toast.loading("Synchronizing vector knowledge base with Doctor and Specialty databases...");

    try {
      const res = await aiService.syncAIKnowledgeBase();
      if (res.success) {
        toast.success(res.message || "Vector knowledge base synchronized successfully!", {
          id: toastId,
        });
        // Refresh stats immediately after sync
        await fetchStats(true);
      } else {
        toast.error(res.message || "Vector synchronization encountered an issue.", {
          id: toastId,
        });
      }
    } catch {
      toast.error("Failed to trigger knowledge base synchronization.", {
        id: toastId,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Test Triage Simulation
  const handleTestTriage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testQuery.trim() || isTesting) return;

    setIsTesting(true);
    setTestResponse(null);

    try {
      const res = await aiService.sendNonStreamingAIChat({
        query: testQuery.trim(),
      });

      if (res.success && res.data) {
        setTestResponse(res.data);
      } else {
        toast.error(res.message || "Triage test failed.");
      }
    } catch {
      toast.error("Failed to execute triage test query.");
    } finally {
      setIsTesting(false);
    }
  };

  useEffect(() => {
    if (!initialStats) {
      fetchStats(true);
    }
  }, [initialStats, fetchStats]);

  // Derived metrics
  const totalVectors =
    stats?.totalVectors ??
    (stats?.categories
      ? Object.values(stats.categories).reduce((a, b) => a + b, 0)
      : 0);

  const doctorVectors =
    stats?.categories?.["DOCTOR"] ??
    stats?.categories?.["doctor"] ??
    stats?.totalDocuments ??
    0;

  const specialtyVectors =
    stats?.categories?.["SPECIALTY"] ??
    stats?.categories?.["specialty"] ??
    0;

  const policyVectors =
    stats?.categories?.["POLICY"] ??
    stats?.categories?.["policy"] ??
    1;

  const lastSyncDate = stats?.lastSyncedAt
    ? new Date(stats.lastSyncedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Recently Synchronized";

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
      {/* 1. Page Header with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-spin-slow" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                AI Vector Knowledge Base
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                RAG Vector Embeddings, semantic clinical triage indexing, and doctor catalog synchronization.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchStats(false)}
            disabled={isLoading || isSyncing}
            className="h-10 px-3.5 rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 gap-1.5"
            title="Refresh vector statistics"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            size="sm"
            onClick={handleSyncKnowledge}
            disabled={isSyncing || isLoading}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-md shadow-indigo-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            <span>{isSyncing ? "Syncing Vectors..." : "Sync Knowledge Base"}</span>
          </Button>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Embeddings"
          value={totalVectors.toLocaleString()}
          icon={Database}
          description="Vector chunks in store"
          iconClassName="bg-blue-500/10 text-blue-600 dark:text-blue-400"
        />

        <StatCard
          title="Doctor Profiles"
          value={doctorVectors.toLocaleString()}
          icon={Stethoscope}
          description="Clinically indexed doctors"
          iconClassName="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        />

        <StatCard
          title="Specialties"
          value={specialtyVectors.toLocaleString()}
          icon={Hospital}
          description="Medical specialties & tags"
          iconClassName="bg-purple-500/10 text-purple-600 dark:text-purple-400"
        />

        <StatCard
          title="Vector Engine"
          value="Healthy"
          icon={ShieldCheck}
          description={`Last synced: ${lastSyncDate}`}
          iconClassName="bg-amber-500/10 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* 3. Detailed Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vector Categories Breakdown */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                    Vector Breakdown
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold">
                  pgvector
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {/* Doctors Category */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <Stethoscope className="h-3.5 w-3.5 text-blue-500" /> Doctor Profiles
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                      {doctorVectors} docs
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${totalVectors > 0 ? (doctorVectors / totalVectors) * 100 : 50}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Specialties Category */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <Hospital className="h-3.5 w-3.5 text-purple-500" /> Specialties & Tags
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                      {specialtyVectors} items
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${totalVectors > 0 ? (specialtyVectors / totalVectors) * 100 : 30}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Hospital Policies */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-500" /> Hospital Policies
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                      {policyVectors} docs
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${totalVectors > 0 ? (policyVectors / totalVectors) * 100 : 20}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sync Meta Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 text-xs text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> Refreshed:
              </span>
              <span className="font-medium text-zinc-600 dark:text-zinc-300">
                {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Engine Specs Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white shadow-sm border border-zinc-800">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-4 w-4 text-purple-400" />
              <h4 className="text-sm font-bold tracking-tight">Embedding Architecture</h4>
            </div>
            <ul className="text-xs space-y-2 text-zinc-400">
              <li className="flex items-center justify-between">
                <span>Model:</span>
                <span className="font-mono text-zinc-200">Google Gemini / text-embedding-004</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Vector Dimension:</span>
                <span className="font-mono text-zinc-200">768-D Float Vectors</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Similarity Metric:</span>
                <span className="font-mono text-zinc-200">Cosine Distance (&lt;=&gt;)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Vector DB:</span>
                <span className="font-mono text-emerald-400">PostgreSQL + pgvector</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Semantic Search & Triage Simulation Sandbox */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-purple-600" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Live Semantic Search & Triage Sandbox
                </h3>
              </div>
              <span className="text-xs text-zinc-400">Simulate Patient Query</span>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 mb-4">
              Enter any Bengali or English patient symptom query to verify how the RAG embeddings and triage LLM classify emergency status and retrieve matching doctors.
            </p>

            {/* Test Form */}
            <form onSubmit={handleTestTriage} className="flex gap-2">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="e.g. আমার হাঁটুতে অনেক ব্যথা এবং হাঁটতে পারছি না, কোন ডাক্তার দেখাব?"
                className="flex-1 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2.5 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <Button
                type="submit"
                disabled={!testQuery.trim() || isTesting}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs gap-1.5 shrink-0"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Run Test</span>
                  </>
                )}
              </Button>
            </form>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              <span className="text-[11px] text-zinc-400 self-center">Try:</span>
              {[
                "হঠাৎ বুকে তীব্র ব্যথা ও শ্বাসকষ্ট",
                "অস্থি বিশেষজ্ঞ বা অর্থোপেডিক ডাক্তার",
                "অনলাইন পেমেন্ট এবং পে লেটার পলিসি কী?",
              ].map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTestQuery(q);
                  }}
                  className="px-2 py-0.5 rounded-lg text-[11px] bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Test Output Box */}
            <div className="mt-4 flex-1 min-h-[220px] rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40 p-4 overflow-y-auto">
              {isTesting && (
                <div className="flex flex-col items-center justify-center h-44 gap-2 text-zinc-400">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                  <p className="text-xs">Computing embeddings and querying vector store...</p>
                </div>
              )}

              {!isTesting && !testResponse && (
                <div className="flex flex-col items-center justify-center h-44 gap-1.5 text-zinc-400 text-center">
                  <Database className="h-7 w-7 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-xs font-medium">No test query run yet.</p>
                  <p className="text-[11px] text-zinc-400">
                    Type a query above or click a preset to inspect live vector retrieval results.
                  </p>
                </div>
              )}

              {!isTesting && testResponse && (
                <div className="space-y-3.5">
                  {/* Status & Emergency Banner */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Triage Response:
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        testResponse.isEmergency
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      }`}
                    >
                      {testResponse.isEmergency ? (
                        <>
                          <AlertTriangle className="h-3 w-3" /> Emergency Triage
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" /> Standard Recommendation
                        </>
                      )}
                    </span>
                  </div>

                  {/* Clinical Answer */}
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                    {testResponse.answer}
                  </div>

                  {/* Extracted Specialties */}
                  {testResponse.suggestedSpecialties &&
                    testResponse.suggestedSpecialties.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-semibold text-zinc-400">
                          Matched Specialties:
                        </span>
                        {testResponse.suggestedSpecialties.map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                  {/* Retrieved Doctors Count */}
                  {testResponse.recommendedDoctors &&
                    testResponse.recommendedDoctors.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800">
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          Recommended Doctors Retrieved ({testResponse.recommendedDoctors.length}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {testResponse.recommendedDoctors.map((doc) => (
                            <div
                              key={doc.doctorId}
                              className="p-2.5 rounded-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs flex justify-between items-center"
                            >
                              <div>
                                <p className="font-bold text-zinc-900 dark:text-zinc-100">
                                  {doc.name.replace(/^(Dr\.\s*)+/i, "Dr. ")}
                                </p>
                                <p className="text-[11px] text-zinc-500">{doc.specialties}</p>
                              </div>
                              <span className="font-mono text-emerald-600 font-bold">
                                ৳{doc.appointmentFee}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
