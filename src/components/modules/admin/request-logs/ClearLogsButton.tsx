"use client";

import React, { useState } from "react";
import { Trash2, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { clearAllRequestLogs } from "@/src/services/request-log.service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { Button } from "@/src/components/ui/button";

interface ClearLogsButtonProps {
  totalLogs: number;
}

export function ClearLogsButton({ totalLogs }: ClearLogsButtonProps) {
  const [isClearing, setIsClearing] = useState(false);
  const router = useRouter();

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const res = await clearAllRequestLogs();
      if (res.success) {
        toast.success(res.message || "All request logs have been flushed");
        router.refresh();
      } else {
        toast.error(res.message || "Failed to flush logs");
      }
    } catch {
      toast.error("An error occurred while clearing logs");
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          disabled={totalLogs === 0 || isClearing}
          className="gap-2 bg-red-600/90 hover:bg-red-600 text-white shadow-sm"
        >
          {isClearing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Clear All Logs
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <RotateCcw className="w-5 h-5" /> Flush All Audit Logs?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action will completely wipe all currently buffered HTTP request
            and performance logs from memory and storage. This action is irreversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Yes, Flush All
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
