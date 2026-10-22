"use client";

import React from "react";
import { Button } from "@/src/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface AppPaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export function AppPagination({ meta }: AppPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(meta.total / meta.limit);
  const currentPage = meta.page || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-3 py-4 pb-20 sm:pb-6 sm:pr-28 w-full">
      <div className="text-sm text-zinc-500 dark:text-zinc-400 font-medium text-center sm:text-left">
        Showing{" "}
        <span className="text-zinc-900 dark:text-zinc-100">
          {(currentPage - 1) * meta.limit + 1}
        </span>{" "}
        to{" "}
        <span className="text-zinc-900 dark:text-zinc-100">
          {Math.min(currentPage * meta.limit, meta.total)}
        </span>{" "}
        of{" "}
        <span className="text-zinc-900 dark:text-zinc-100">
          {meta.total}
        </span>{" "}
        entries
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-full shadow-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-full shadow-sm"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
