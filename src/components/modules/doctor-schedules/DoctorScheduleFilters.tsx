"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Filter,
  X,
  RotateCcw,
  Search,
  Calendar,
  ArrowUpDown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { FilterSelect } from "@/src/components/shared/FilterSelect";
import { DebouncedSearch } from "@/src/components/shared/DebouncedSearch";

interface DoctorScheduleFiltersProps {
  totalResults?: number;
}

export function DoctorScheduleFilters({
  totalResults,
}: DoctorScheduleFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Read current active filters from URL query parameters
  const searchTerm = searchParams.get("searchTerm") || "";
  const isBooked = searchParams.get("isBooked");
  const startDate = searchParams.get("startDate") || "";
  const sortOrder = searchParams.get("sortOrder");

  // Helper for date filter or clearing individual params
  const handleDateChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!val) {
      params.delete("startDate");
    } else {
      params.set("startDate", val);
    }
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);
    params.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Clear all filters at once
  const resetAllFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  // Count active non-default filters
  const activeFiltersCount = [
    searchTerm,
    isBooked && isBooked !== "all",
    startDate,
    sortOrder && sortOrder !== "asc",
  ].filter(Boolean).length;

  const bookingStatusOptions = [
    { label: "Available Only", value: "false" },
    { label: "Booked Only", value: "true" },
  ];

  const sortOrderOptions = [
    { label: "Earliest First (Asc)", value: "asc" },
    { label: "Latest First (Desc)", value: "desc" },
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Filter Bar Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Filter className="w-4 h-4" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              Filter Doctor Schedules
              {activeFiltersCount > 0 && (
                <Badge className="bg-blue-600 text-white text-[11px] px-2 py-0.2">
                  {activeFiltersCount} Active
                </Badge>
              )}
            </h4>
            <p className="text-xs text-zinc-500">
              Search by doctor name or qualification, availability status, date, and order.
            </p>
          </div>
        </div>

        {/* Results summary and Reset All button */}
        <div className="flex items-center gap-2">
          {totalResults !== undefined && (
            <span className="text-xs text-zinc-500 font-medium">
              Showing <strong className="text-zinc-900 dark:text-zinc-100">{totalResults}</strong> schedule slots
            </span>
          )}

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllFilters}
              disabled={isPending}
              className="h-8 px-3 text-xs text-zinc-600 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 rounded-full transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3 mr-1.5" />
              Reset All
            </Button>
          )}
        </div>
      </div>

      {/* Filter Inputs Grid using Reusable DebouncedSearch and FilterSelect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
        {/* 1. Doctor Search via Reusable DebouncedSearch */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-500" /> Search Doctor
          </label>
          <DebouncedSearch
            placeholder="Search doctor by name, email..."
            className="w-full max-w-none"
          />
        </div>

        {/* 2. Booking Status Filter via Reusable FilterSelect */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Booking Status
          </label>
          <FilterSelect
            paramName="isBooked"
            placeholder="Status"
            defaultLabel="All Status"
            options={bookingStatusOptions}
          />
        </div>

        {/* 3. Start Date Filter */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-500" /> Schedule Date
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-xs h-9 rounded-lg"
          />
        </div>

        {/* 4. Sort Order Filter via Reusable FilterSelect */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" /> Sort Order
          </label>
          <FilterSelect
            paramName="sortOrder"
            placeholder="Sort Order"
            defaultLabel="Earliest First (Asc)"
            options={sortOrderOptions}
          />
        </div>
      </div>

      {/* Active Filter Chips Bar */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <span className="text-zinc-500 font-medium">Active Filters:</span>

          {searchTerm && (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-2.5 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full font-medium"
            >
              <span>Search: "{searchTerm}"</span>
              <button
                type="button"
                onClick={() => removeParam("searchTerm")}
                className="hover:text-blue-900 rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {isBooked && isBooked !== "all" && (
            <Badge
              variant="secondary"
              className={`gap-1.5 py-1 px-2.5 rounded-full font-medium border ${
                isBooked === "true"
                  ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300"
              }`}
            >
              <span>Status: {isBooked === "true" ? "Booked" : "Available"}</span>
              <button
                type="button"
                onClick={() => removeParam("isBooked")}
                className="hover:opacity-75 rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {startDate && (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full font-medium"
            >
              <span>Date: {startDate}</span>
              <button
                type="button"
                onClick={() => removeParam("startDate")}
                className="hover:opacity-75 rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}

          {sortOrder && sortOrder !== "asc" && (
            <Badge
              variant="secondary"
              className="gap-1.5 py-1 px-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-full font-medium"
            >
              <span>Sort: Latest First</span>
              <button
                type="button"
                onClick={() => removeParam("sortOrder")}
                className="hover:opacity-75 rounded-full cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
