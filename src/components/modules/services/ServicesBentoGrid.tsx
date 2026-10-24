"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Video,
  Mic,
  Calendar,
  CreditCard,
  FileText,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

const SERVICES = [
  {
    id: "ai-triage",
    badge: "Applied AI & RAG",
    title: "AI Clinical Triage & Symptom Checker",
    description:
      "Sub-300ms Server-Sent Events token streaming powered by our fine-tuned Clinical LLM and 768-D PostgreSQL pgvector. Deterministic Rule-0 detects acute emergencies with instant 999 hotline routing.",
    icon: <Sparkles className="h-6 w-6 text-purple-500" />,
    gradient: "from-purple-500/10 to-indigo-500/10",
    border: "hover:border-purple-500/50",
    features: ["Natural language symptom triage in Bengali & English", "Verified specialist recommendations", "Acute emergency beacon & 999 hotline trigger"],
    href: "/ai-assistant",
    cta: "Launch AI Assistant",
  },
  {
    id: "webrtc-telehealth",
    badge: "Encrypted WebRTC",
    title: "HD Video & Voice Teleconsultation",
    description:
      "Peer-to-peer encrypted clinical video consultation room. Race-condition-free ICE candidate queuing, dual-STUN high availability, and native clinical screen-sharing for radiology scans.",
    icon: <Video className="h-6 w-6 text-blue-500" />,
    gradient: "from-blue-500/10 to-cyan-500/10",
    border: "hover:border-blue-500/50",
    features: ["Movable Picture-in-Picture (PiP) self-view", "Instant screen-share for diagnostic reports", "Zero-flicker native track replacement"],
    href: "/doctors",
    cta: "Book Video Consultation",
  },
  {
    id: "realtime-chat",
    badge: "Socket.io Engine",
    title: "Real-Time Chat & Vocal Voice Notes",
    description:
      "WhatsApp/Messenger UX in-consultation messaging. Features live debounced typing indicators, double blue read receipts, and an intelligent 4-bar dynamic audio visualizer with hardware mic detection.",
    icon: <Mic className="h-6 w-6 text-emerald-500" />,
    gradient: "from-emerald-500/10 to-teal-500/10",
    border: "hover:border-emerald-500/50",
    features: ["Real-time 4-bar Web Audio API amplitude visualizer", "Hardware mic detection bypassing virtual drivers", "Universal MP3 Cloudinary transcode playback"],
    href: "/doctors",
    cta: "Explore In-Room Chat",
  },
  {
    id: "schedule-locking",
    badge: "Concurrency Safe",
    title: "Zero-Conflict Specialist Scheduling",
    description:
      "Transactional slot reservation algorithm preventing double-booking and schedule collisions across board-certified doctors in Cardiology, Neurology, Pediatrics, Orthopedics, and more.",
    icon: <Calendar className="h-6 w-6 text-amber-500" />,
    gradient: "from-amber-500/10 to-orange-500/10",
    border: "hover:border-amber-500/50",
    features: ["Timezone & historical date normalization", "Instant calendar sync and booking review", "Multi-role availability filters"],
    href: "/doctors",
    cta: "Browse Specialist Directory",
  },
  {
    id: "dual-payments",
    badge: "FinTech Security",
    title: "Intelligent Dual-Payment Architecture",
    description:
      "Secure Stripe checkout paired with automated 30-minute Pay-Later reservations featuring a live countdown timer, urgent 5-minute alerts, and certified Cloudinary PDF invoices.",
    icon: <CreditCard className="h-6 w-6 text-violet-500" />,
    gradient: "from-violet-500/10 to-pink-500/10",
    border: "hover:border-violet-500/50",
    features: ["Stripe hosted card checkout with webhook sync", "30-minute Pay-Later live countdown", "Official downloadable PDF clinical invoices"],
    href: "/doctors",
    cta: "View Payment Options",
  },
  {
    id: "ehr-prescriptions",
    badge: "Clinical Records",
    title: "EHR Prescriptions & Hybrid Notifications",
    description:
      "End-to-end digital health records management. Instant e-prescription issuance, pharmacy fulfillment, and dual-channel real-time notifications with in-room route suppression.",
    icon: <FileText className="h-6 w-6 text-sky-500" />,
    gradient: "from-sky-500/10 to-blue-500/10",
    border: "hover:border-sky-500/50",
    features: ["Instant digital prescription PDF download", "WebSocket alerts with route suppression", "Multi-tab unread badge synchronization"],
    href: "/dashboard",
    cta: "Access Health Records",
  },
];

export function ServicesBentoGrid() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Enterprise Telehealth Capabilities
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Every feature is engineered to hospital-grade standards for patients, physicians, and clinical staff.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className={`group relative flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${service.border}`}
            >
              <div>
                {/* Header Icon & Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${service.gradient} border border-zinc-200/50 dark:border-zinc-700/50`}>
                    {service.icon}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wider uppercase font-mono px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {service.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Bullet Points */}
                <ul className="mt-4 space-y-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom CTA Link */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <span>{service.cta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
