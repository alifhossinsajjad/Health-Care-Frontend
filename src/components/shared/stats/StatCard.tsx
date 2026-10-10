import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "cn";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-zinc-300 dark:hover:border-zinc-700 min-h-[160px]",
        className,
      )}
    >
      {/* Background Pattern / Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div
        className={cn(
          "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none",
          iconClassName?.split(" ")[0],
        )}
      />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            {title}
          </p>
          <h3 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 mt-1">
            {value}
          </h3>
        </div>

        <div
          className={cn(
            "p-3 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-[10deg] shadow-sm",
            iconClassName,
          )}
        >
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center">
        {description ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {description}
          </span>
        ) : (
          <div className="h-6" /> // Placeholder to keep height consistent
        )}
      </div>
    </div>
  );
}
