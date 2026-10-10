"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/src/components/ui/input";

interface DebouncedSearchProps {
  placeholder?: string;
  delay?: number;
  className?: string;
}

export function DebouncedSearch({ placeholder = "Search...", delay = 500, className }: DebouncedSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state with current URL search param to stay in sync
  const initialSearchTerm = searchParams.get("searchTerm") || "";
  const [inputValue, setInputValue] = useState(initialSearchTerm);

  useEffect(() => {
    // If the input value matches the URL, do nothing
    if (inputValue === (searchParams.get("searchTerm") || "")) {
      return;
    }

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      
      if (inputValue) {
        params.set("searchTerm", inputValue);
        // Reset to page 1 whenever a new search is made
        params.set("page", "1");
      } else {
        params.delete("searchTerm");
      }

      router.push(`${pathname}?${params.toString()}`);
    }, delay);

    // Cleanup timeout if user types again before delay finishes
    return () => clearTimeout(handler);
  }, [inputValue, delay, router, pathname, searchParams]);

  const handleClear = () => {
    setInputValue("");
  };

  return (
    <div className={`relative flex items-center w-full max-w-sm ${className || ""}`}>
      <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
      <Input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="pl-9 pr-9 h-10 w-full rounded-full bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-blue-500 transition-all shadow-sm"
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
