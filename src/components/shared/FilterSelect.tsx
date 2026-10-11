"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  paramName: string;
  placeholder: string;
  options: FilterOption[];
  className?: string;
  defaultLabel?: string;
}

export function FilterSelect({
  paramName,
  placeholder,
  options,
  className,
  defaultLabel,
}: FilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Keep local state in sync with URL
  const [value, setValue] = useState<string>(
    searchParams.get(paramName) || "all",
  );

  useEffect(() => {
    setValue(searchParams.get(paramName) || "all");
  }, [searchParams, paramName]);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);

    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (newValue === "all") {
      current.delete(paramName);
    } else {
      current.set(paramName, newValue);
    }

    // Reset to page 1 when filter changes
    current.set("page", "1");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`${pathname}${query}`);
  };

  return (
    <div className={className}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {defaultLabel || `All ${placeholder.split(" ")[0]}`}
          </SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
