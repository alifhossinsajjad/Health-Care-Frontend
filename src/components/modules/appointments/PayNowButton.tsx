"use client";

import React, { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { initiatePayment } from "@/src/services/appointment.service";
import { Button } from "@/src/components/ui/button";

interface PayNowButtonProps {
  appointmentId: string;
  fee?: number;
}

export function PayNowButton({ appointmentId, fee }: PayNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePay = async () => {
    try {
      setIsLoading(true);
      const res = await initiatePayment(appointmentId);

      if (res.success && res.data?.paymentUrl) {
        toast.success("Redirecting to secure payment gateway...");
        window.location.href = res.data.paymentUrl;
      } else {
        toast.error(res.message || "Failed to initiate payment session.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      onClick={handlePay}
      disabled={isLoading}
      className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-3.5 h-3.5" />
          <span>Pay Online {fee ? `(৳${fee})` : ""}</span>
        </>
      )}
    </Button>
  );
}
