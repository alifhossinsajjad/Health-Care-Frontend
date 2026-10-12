import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export const metadata = {
  title: "Payment Cancelled | Health Care",
  description: "The payment process was cancelled or not completed.",
};

export default function PaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 min-h-[75vh] max-w-lg mx-auto w-full">
      <div className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
        {/* Warning Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 ring-8 ring-amber-50/50 dark:ring-amber-950/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Payment Cancelled
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
          You cancelled the checkout session before completing the payment. No charges were made to your account.
        </p>

        {/* Helpful Info Box */}
        <div className="w-full mt-6 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-left text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            What happens next?
          </p>
          <p>
            • If your appointment was scheduled with "Pay Later", you can pay the consultation fee at the clinic on your visit.
          </p>
          <p>
            • You can also retry online payment anytime from your dashboard.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/my-appointments" className="flex-1">
            <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 shadow-md shadow-blue-600/20">
              <span>My Appointments</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/doctors" className="flex-1">
            <Button variant="outline" className="w-full rounded-full py-3">
              Browse Doctors
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
