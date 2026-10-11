"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { changeUserStatus } from "@/src/services/admin.service";
import { IDoctor } from "@/src/types/doctor.type";
import { Loader2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used for toasts, or I'll just use console if it's missing, but it's a good practice.

export function DoctorStatusToggle({ doctor }: { doctor: IDoctor }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If user object is missing, default to ACTIVE for safety
  const currentStatus = doctor.user?.status || "ACTIVE";
  const isActive = currentStatus === "ACTIVE";

  const handleToggle = async (checked: boolean) => {
    setIsLoading(true);
    const newStatus = checked ? "ACTIVE" : "BLOCKED";
    
    try {
      const res = await changeUserStatus(doctor.userId, newStatus);
      if (res.success) {
        // Optional: toast.success(res.message);
        router.refresh();
      } else {
        // Optional: toast.error(res.message);
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleToggle(!isActive)}
        disabled={isLoading}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive ? "bg-blue-600" : "bg-zinc-200 dark:bg-zinc-700"
        }`}
      >
        <span
          className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
            isActive ? "translate-x-2" : "-translate-x-2"
          }`}
        />
      </button>
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
      ) : (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' : 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'}`}>
          {currentStatus}
        </span>
      )}
    </div>
  );
}
