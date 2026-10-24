"use client";

import React, { useState } from "react";
import { CheckSquare, Copy, Check, HelpCircle, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";

interface DoctorQuestionsChecklistProps {
  questions: string[];
}

export function DoctorQuestionsChecklist({ questions = [] }: DoctorQuestionsChecklistProps) {
  const [checkedMap, setCheckedMap] = useState<Record<number, boolean>>({});
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (questions.length === 0) return null;

  const toggleCheck = (idx: number) => {
    setCheckedMap((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const copySingle = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      toast.success("Question copied to clipboard!");
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {
      toast.error("Failed to copy question.");
    }
  };

  const copyAll = async () => {
    try {
      const compiled = questions
        .map((q, i) => `${i + 1}. ${q}`)
        .join("\n");
      await navigator.clipboard.writeText(compiled);
      toast.success("All questions copied to clipboard!");
    } catch {
      toast.error("Failed to copy questions.");
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-bold text-xs uppercase tracking-wide">
          <HelpCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Recommended Questions for Your Doctor ({questions.length})</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={copyAll}
          className="h-8 px-2.5 rounded-lg text-xs gap-1.5 text-zinc-600 hover:text-zinc-900 dark:text-zinc-300"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Copy All</span>
        </Button>
      </div>

      {/* Interactive Checkbox Items */}
      <div className="space-y-2">
        {questions.map((question, idx) => {
          const isChecked = Boolean(checkedMap[idx]);
          const isCopied = copiedIdx === idx;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                isChecked
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 opacity-80"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 shadow-xs"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleCheck(idx)}
                className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                  isChecked
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-zinc-300 dark:border-zinc-600 bg-transparent hover:border-zinc-400"
                }`}
                title={isChecked ? "Mark as unasked" : "Mark as discussed"}
              >
                {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
              </button>

              <p
                onClick={() => toggleCheck(idx)}
                className={`text-xs sm:text-sm leading-snug cursor-pointer flex-1 ${
                  isChecked
                    ? "line-through text-zinc-400 dark:text-zinc-500"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {question}
              </p>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => copySingle(question, idx)}
                className="h-7 w-7 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-100 shrink-0"
                title="Copy question"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
