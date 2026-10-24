"use client";

import React from "react";
import { Sparkles, HeartPulse, Bone, CreditCard, ShieldCheck, Zap, Lock } from "lucide-react";

interface AIChatWelcomeHeroProps {
  onSelectPrompt: (prompt: string) => void;
}

const STARTER_PROMPTS = [
  {
    icon: <HeartPulse className="h-5 w-5 text-rose-500" />,
    tag: "Cardiology & Emergency",
    title: "হঠাৎ বুকে তীব্র ব্যথা ও শ্বাসকষ্ট",
    description: "তীব্র কার্ডিয়াক লক্ষণ ট্রায়াজ ও নিকটস্থ জরুরি ব্যবস্থা",
    prompt: "হঠাৎ বুকে তীব্র ব্যথা ও শ্বাসকষ্ট হচ্ছে, কী করব?",
  },
  {
    icon: <Bone className="h-5 w-5 text-amber-500" />,
    tag: "Orthopedics & Joint",
    title: "হাঁটু ও জয়েন্টে ব্যথা ও জড়তা",
    description: "অভিজ্ঞ অর্থোপেডিক বিশেষজ্ঞ অনুসন্ধান ও পরামর্শ ফি",
    prompt: "আমার হাঁটুতে অনেক ব্যথা এবং হাঁটতে পারছি না, কোন ডাক্তার দেখাব?",
  },
  {
    icon: <CreditCard className="h-5 w-5 text-blue-500" />,
    tag: "Payments & Policy",
    title: "অনলাইন পে-লেটার পলিসি",
    description: "বিনা অগ্রিম পেমেন্টে ৩০ মিনিটের মধ্যে স্লট বুকিং নিয়ম",
    prompt: "হাসপাতালের অনলাইন পে-লেটার (Pay Later) পলিসি কী?",
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-500" />,
    tag: "Hospital Services",
    title: "২৪/৭ জরুরি ক্লিনিক্যাল কেয়ার",
    description: "লাইভ আইসিইউ, অ্যাম্বুলেন্স সাপোর্ট ও সার্বক্ষণিক তথ্য",
    prompt: "হাসপাতালের ইমার্জেন্সি সার্ভিস কি ২৪ ঘণ্টা খোলা থাকে?",
  },
];

export function AIChatWelcomeHero({ onSelectPrompt }: AIChatWelcomeHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center my-auto py-2 sm:py-4 px-4 max-w-3xl mx-auto text-center select-none animate-in fade-in zoom-in-95 duration-300">
      {/* 1. Radiant Glowing Medical AI Badge */}
      <div className="relative mb-3">
        <span className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-40 blur-lg animate-pulse" />
        <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/25">
          <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 animate-bounce" />
        </div>
      </div>

      {/* 2. Hero Headline & Subtitle */}
      <h2 className="text-lg sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
        How can I assist your health today?
      </h2>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-xl leading-relaxed">
        Describe your clinical symptoms in natural Bengali or English for instant medical triage, verified specialist recommendations, and hospital guidelines.
      </p>

      {/* 3. Bento Starter Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 sm:mt-5 w-full text-left">
        {STARTER_PROMPTS.map((item, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className="group relative flex flex-col justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-blue-500/60 dark:hover:border-blue-500/60 shadow-2xs hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 text-left cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-[9px] font-semibold text-zinc-400 font-mono tracking-wider uppercase">
                  {item.tag}
                </span>
              </div>
              <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1 leading-normal">
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Assurance Badges */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-[10px] sm:text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-amber-500" /> Sub-300ms Live Streaming
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3 w-3 text-emerald-500" /> RAG-Verified Specialists
        </span>
        <span className="flex items-center gap-1">
          <Lock className="h-3 w-3 text-blue-500" /> Encrypted Health Session
        </span>
      </div>
    </div>
  );
}
