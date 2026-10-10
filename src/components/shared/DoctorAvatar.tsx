import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "cn";

interface DoctorAvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
}

export function DoctorAvatar({ src, alt, className, fallbackClassName }: DoctorAvatarProps) {
  // Extract initials for fallback if name is provided
  const initials = alt
    ? alt
        .replace("Dr. ", "")
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "DR";

  return (
    <Avatar className={cn("h-12 w-12 border-2 border-white dark:border-zinc-900 shadow-sm", className)}>
      <AvatarImage src={src || undefined} alt={alt} className="object-cover" />
      <AvatarFallback className={cn("bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-semibold", fallbackClassName)}>
        {initials ? initials : <User className="w-1/2 h-1/2" />}
      </AvatarFallback>
    </Avatar>
  );
}
