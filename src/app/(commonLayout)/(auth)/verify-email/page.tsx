import VerifyEmailForm from "@/src/components/modules/auth/verifyEmailForm";
import React, { Suspense } from "react";

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailForm />
      </Suspense>
    </div>
  );
}
