"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQS = [
  {
    q: "How do I enter my video consultation room when appointment starts?",
    a: "Navigate to 'My Appointments' on your dashboard or click the green 'Join Room' alert on your top notification bell. You can access the encrypted WebRTC room directly from Chrome, Safari, or Edge without downloading any third-party software.",
  },
  {
    q: "How does the 30-minute Pay Later reservation feature work?",
    a: "When booking an appointment, choose 'Pay Later'. Your doctor's slot will be locked immediately for 30 minutes. You can pay online via Stripe card checkout anytime before the live timer expires. If unpaid after 30 minutes, the slot is automatically released.",
  },
  {
    q: "Where can I view and download my digital e-prescriptions?",
    a: "Immediately after your consultation, your doctor submits the signed electronic prescription. It is automatically available under Dashboard > My Prescriptions with certified Cloudinary PDF download and official verification QR code.",
  },
  {
    q: "How does the Clinical AI Triage protect medical safety?",
    a: "Our AI assistant uses Retrieval-Augmented Generation (RAG) referencing verified clinical documents and hospital doctors. It enforces deterministic Rule-0 emergency checks: if life-threatening symptoms (stroke, heart attack, severe dyspnea) are flagged, it overrides text with a direct 999 hotline action.",
  },
  {
    q: "Can I communicate with my doctor after the video call ends?",
    a: "Yes! Every consultation has an integrated real-time chat with vocal voice notes and document sharing. You can send follow-up questions, upload lab test reports (PDF/JPG up to 10MB), and receive updates directly.",
  },
];

export function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Quick answers to common patient & booking inquiries
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(index)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left bg-zinc-50/50 dark:bg-zinc-800/40 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {faq.q}
                </span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="p-4 bg-white dark:bg-zinc-900 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800 animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
