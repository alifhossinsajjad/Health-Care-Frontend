import { Activity } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
      {/* Container for the animation */}
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Outer rotating gradient ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-blue-500 border-r-purple-500 animate-[spin_1.5s_linear_infinite]" />
        
        {/* Inner rotating gradient ring (reverse) */}
        <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-emerald-500 border-l-cyan-500 animate-[spin_2s_linear_infinite_reverse]" />
        
        {/* Pulsing glow effect */}
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />

        {/* Center Icon */}
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-zinc-900 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Activity className="w-6 h-6 text-blue-600 dark:text-blue-500 animate-pulse" strokeWidth={2.5} />
        </div>
      </div>

      {/* Loading Text */}
      <div className="mt-8 flex flex-col items-center gap-2">
        <h3 className="text-lg font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-[pulse_2s_ease-in-out_infinite] bg-[length:200%_auto]">
          Please wait...
        </h3>
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Preparing your dashboard
        </p>
      </div>
    </div>
  );
}