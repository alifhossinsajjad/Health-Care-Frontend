import React from "react";
import { Video, CreditCard, FileText, CalendarCheck, ShieldCheck, Zap, Lock, Download } from "lucide-react";

export function EcosystemBentoGrid() {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 border border-blue-200/50 dark:border-blue-800/50">
            <Zap className="w-3.5 h-3.5" />
            <span>Built For Modern Healthcare</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            An Intelligent Health Ecosystem
          </h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">
            Engineered with modern cloud architecture, robust privacy protocols, and automated booking intelligence to give you a frictionless experience.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Card 1: Video Consultations (Spans 2 columns) */}
          <div className="md:col-span-2 relative p-8 rounded-3xl bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-transparent dark:from-blue-950/30 dark:via-zinc-900/40 dark:to-zinc-900/20 border border-blue-200/60 dark:border-blue-900/40 shadow-xs flex flex-col justify-between overflow-hidden group">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-md shadow-blue-600/30">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                High-Definition Encrypted Video Consultations
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                Connect directly with specialists through our peer-to-peer WebRTC encrypted video rooms. No third-party downloads needed—seamless browser-based consultations with screen sharing and instant chat.
              </p>
            </div>

            {/* Visual Micro UI Mock */}
            <div className="relative z-10 mt-8 p-4 rounded-2xl bg-white/90 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200/80 dark:border-zinc-800 shadow-lg flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  Live Video Room #HC-9821
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-bold">
                  1080p HD • E2E Encrypted
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 2: Digital Prescriptions */}
          <div className="relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-6 shadow-md shadow-emerald-600/30">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Cloud Prescriptions & EMR
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Receive certified digital prescriptions right after your appointment. Access diagnostic instructions, dosages, and doctor notes anytime in your personal patient vault.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Download className="w-4 h-4" />
              <span>One-Click PDF Export</span>
            </div>
          </div>

          {/* Bento Card 3: Flexible Payment & Stripe */}
          <div className="relative p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mb-6 shadow-md shadow-indigo-600/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Stripe & Smart Pay Later
              </h3>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Pay online securely with international cards or choose Pay Later with our automated 30-minute reservation countdown. Official GST/VAT receipts generated instantly.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <Lock className="w-4 h-4" />
              <span>256-Bit SSL Protected</span>
            </div>
          </div>

          {/* Bento Card 4: Real-time Schedule Engine (Spans 2 columns) */}
          <div className="md:col-span-2 relative p-8 rounded-3xl bg-gradient-to-tr from-cyan-500/5 via-cyan-500/10 to-transparent dark:from-cyan-950/20 dark:via-zinc-900/40 dark:to-zinc-900/20 border border-cyan-200/60 dark:border-cyan-900/40 shadow-xs flex flex-col justify-between overflow-hidden group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center mb-6 shadow-md shadow-cyan-600/30">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Zero-Conflict Smart Schedule Engine
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl leading-relaxed">
                Our booking algorithm locks doctor slots in real time to completely eliminate double bookings and schedule overlapping. Automatic time-zone normalization ensures you never miss a visit.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4 flex-wrap text-xs font-medium text-zinc-700 dark:text-zinc-300">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
                ACID Transaction Safe
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <Zap className="w-3.5 h-3.5 text-cyan-600" />
                Sub-Second Confirmation
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
