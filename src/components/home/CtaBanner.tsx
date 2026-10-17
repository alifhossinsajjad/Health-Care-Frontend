import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PhoneCall, Sparkles } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function CtaBanner() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="relative rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-2xl overflow-hidden">
          {/* Background Decorative Patterns */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Prioritize Your Health Today</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4">
              Quality Medical Care Is Just One Click Away.
            </h2>

            <p className="text-sm sm:text-base text-blue-100 max-w-xl mb-8 leading-relaxed">
              Don&apos;t put your well-being on hold. Consult with top-tier accredited specialists right from home or book an in-person consultation in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/doctors" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-white hover:bg-zinc-100 text-blue-700 font-extrabold text-sm px-8 py-3.5 shadow-xl transition-transform hover:scale-105"
                >
                  <span>Book Appointment Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>

              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-full border-white/30 hover:bg-white/15 text-white font-bold text-sm px-7 py-3.5"
                >
                  <span>Register Free Account</span>
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/20 text-xs text-blue-100 flex-wrap">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>100% Confidential & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-cyan-300" />
                <span>24/7 Patient Emergency Hotline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
