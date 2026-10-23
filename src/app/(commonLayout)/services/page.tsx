import React from "react";
import { Metadata } from "next";
import { ServicesHero } from "@/src/components/modules/services/ServicesHero";
import { ServicesBentoGrid } from "@/src/components/modules/services/ServicesBentoGrid";
import { ServicesWorkflow } from "@/src/components/modules/services/ServicesWorkflow";
import { ServicesComparison } from "@/src/components/modules/services/ServicesComparison";
import { ServicesCTA } from "@/src/components/modules/services/ServicesCTA";

export const metadata: Metadata = {
  title: "Clinical Services & Telehealth Infrastructure | HealthCare",
  description:
    "Explore our complete healthcare ecosystem: AI medical triage, encrypted WebRTC HD video consultations, WhatsApp-style real-time messaging, zero-conflict scheduling, and Stripe payments.",
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <ServicesHero />
      <ServicesBentoGrid />
      <ServicesWorkflow />
      <ServicesComparison />
      <ServicesCTA />
    </div>
  );
}
