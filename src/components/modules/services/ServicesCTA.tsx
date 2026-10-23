"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function ServicesCTA() {
  return (
    <section className="py-14 sm:py-20 select-none">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-8 sm:p-14 text-white shadow-2xl text-center">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" /> High-Availability Digital Care
          </span>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to Experience Modern Healthcare?
          </h2>

          <p className="mt-4 text-xs sm:text-base text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Connect with board-certified physicians, share diagnostics in real time, and manage prescriptions—all from any browser or smartphone.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/doctors">
              <Button className="h-11 px-7 rounded-xl bg-white text-blue-600 hover:bg-blue-50 font-bold text-sm shadow-lg transition-transform hover:scale-105">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Book Doctor Appointment</span>
              </Button>
            </Link>
            <Link href="/ai-assistant">
              <Button variant="outline" className="h-11 px-7 rounded-xl bg-white/10 hover:bg-white/20 border-white/30 text-white font-bold text-sm backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Try AI Symptom Triage</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
