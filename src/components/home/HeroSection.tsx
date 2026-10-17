"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  Video, 
  Star, 
  ArrowRight, 
  Clock, 
  Activity,
  CheckCircle2,
  Users
} from "lucide-react";
import { Button } from "@/src/components/ui/button";

export function HeroSection() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/doctors?searchTerm=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/doctors");
    }
  };

  const popularSpecialties = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Dermatology",
    "Orthopedics",
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-blue-50/70 via-background to-background dark:from-blue-950/20 dark:via-background dark:to-background">
      {/* Background Glows & Architectural Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/15 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-[350px] h-[350px] bg-cyan-400/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Trust Signals & Search */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 shadow-xs backdrop-blur-xs">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next-Gen Telehealth & Hospital Booking Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-[1.15] mb-6">
              World-Class Healthcare,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
                Reimagined for You.
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed mb-8">
              Connect with accredited medical specialists, book in-person or high-definition video consultations in seconds, and manage encrypted digital prescriptions with confidence.
            </p>

            {/* Interactive Search Box */}
            <div className="w-full max-w-xl bg-white dark:bg-zinc-900 p-2 sm:p-2.5 rounded-2xl sm:rounded-full border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-blue-500/5 mb-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 px-3.5 w-full flex-1">
                  <Search className="w-5 h-5 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search doctor, medical specialty, or clinic..."
                    className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-7 py-3 shadow-md shadow-blue-600/20 shrink-0"
                >
                  <span>Search Doctors</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </form>
            </div>

            {/* Popular Specialty Pills */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-zinc-500 dark:text-zinc-400">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Popular:</span>
              {popularSpecialties.map((spec) => (
                <Link
                  key={spec}
                  href={`/doctors?searchTerm=${encodeURIComponent(spec)}`}
                  className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-950 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border border-zinc-200/60 dark:border-zinc-700/60"
                >
                  {spec}
                </Link>
              ))}
            </div>

            {/* Trust Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 mt-4 border-t border-zinc-200/70 dark:border-zinc-800/80 w-full text-xs font-medium text-zinc-600 dark:text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Specialists</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>Instant 30m Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>Stripe & Pay Later</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-End Visual Composite Card */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              
              {/* Main Card: Doctor Feature Preview */}
              <div className="relative z-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-blue-600/10">
                {/* Doctor Header */}
                <div className="flex items-start justify-between gap-4 mb-5 pb-5 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-md">
                        DR
                      </div>
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                          Dr. Anika Rahman
                        </h3>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        Senior Cardiologist • MBBS, FCPS
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-zinc-800 dark:text-zinc-200">4.9</span>
                        <span className="text-zinc-400 text-[11px]">(320+ reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Details */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>Today, Available in 15 mins</span>
                    </div>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Open Slot</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 text-xs">
                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                      <Video className="w-4 h-4 text-indigo-500" />
                      <span>Encrypted HD Video Call</span>
                    </div>
                    <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">৳ 1,000</span>
                  </div>
                </div>

                {/* Card Action */}
                <Link href="/doctors" className="block">
                  <Button className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 shadow-md shadow-blue-600/20">
                    Book Instant Consultation
                  </Button>
                </Link>
              </div>

              {/* Floating Badge 1: 24/7 Support (Top Left) */}
              <div className="absolute -top-5 -left-6 z-20 hidden sm:flex items-center gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-900/5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100">24/7 Live Care</div>
                  <div className="text-[10px] text-zinc-500">Doctors Online Now</div>
                </div>
              </div>

              {/* Floating Badge 2: Patient Rating (Bottom Right) */}
              <div className="absolute -bottom-6 -right-6 z-20 hidden sm:flex items-center gap-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md px-4 py-3 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-zinc-900/5">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-900">
                    AR
                  </div>
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-900">
                    SK
                  </div>
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-zinc-900">
                    MH
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    <span>15,000+</span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-[10px] text-zinc-500">5-Star Recoveries</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
