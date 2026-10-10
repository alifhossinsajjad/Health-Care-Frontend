"use client";

import Link from "next/link";
import { SearchX, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-zinc-950 relative overflow-hidden selection:bg-blue-500/30">
      {/* Ambient glowing background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-500/20 via-purple-500/10 to-emerald-500/20 blur-3xl rounded-full opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-2xl mx-auto">
        {/* Floating Icon */}
        <div className="relative group mb-8">
          <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:bg-blue-500/30 transition-colors duration-500" />
          <div className="relative flex items-center justify-center w-24 h-24 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl transform transition-transform duration-500 hover:-translate-y-2 hover:rotate-3">
            <SearchX className="w-10 h-10 text-blue-600 dark:text-blue-500" strokeWidth={2} />
          </div>
        </div>

        {/* 404 Text Background (Absolute) vs Standard Heading */}
        <h1 className="text-[150px] md:text-[200px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-zinc-200 to-white dark:from-zinc-800 dark:to-zinc-950 select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10">
          404
        </h1>

        {/* Main Content */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800/50">
          <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          Page Not Found
        </div>

        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Lost in the hospital?
        </h2>
        
        <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 max-w-lg leading-relaxed">
          The page you are looking for might have been moved, deleted, or possibly never existed. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            href="/"
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-full overflow-hidden transition-transform active:scale-95 hover:shadow-xl hover:shadow-zinc-900/20 dark:hover:shadow-white/20"
          >
            <Home className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:scale-110" />
            <span>Return to Home</span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-white/20 dark:bg-zinc-900/20" />
            </div>
          </Link>

          <button 
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-300 dark:hover:border-zinc-700 active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}