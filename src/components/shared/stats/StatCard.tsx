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
        "group relative overflow-hidden flex flex-col gap-4 p-6 rounded-3xl bg-gradient-to-br from-white to-zinc-50/80 dark:from-zinc-950 dark:to-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-transparent to-zinc-100 dark:to-zinc-800 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <p className="text-sm font-semibold tracking-wide text-zinc-500 dark:text-zinc-400 uppercase">
          {title}
        </p>
        <div
          className={cn(
            "p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
            iconClassName
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex flex-col gap-1.5 relative z-10 mt-2">
        <h3 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 to-zinc-600 dark:from-zinc-100 dark:to-zinc-400">
          {value}
        </h3>
        {description && (
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
