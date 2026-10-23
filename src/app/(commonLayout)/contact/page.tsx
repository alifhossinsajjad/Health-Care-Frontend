import React from "react";
import { Metadata } from "next";
import { ContactHero } from "@/src/components/modules/contact/ContactHero";
import { ContactInfoCards } from "@/src/components/modules/contact/ContactInfoCards";
import { ContactForm } from "@/src/components/modules/contact/ContactForm";
import { ContactFAQ } from "@/src/components/modules/contact/ContactFAQ";

export const metadata: Metadata = {
  title: "Contact Us & Patient Support Concierge | HealthCare",
  description:
    "Contact HealthCare support for clinical inquiries, doctor appointments, 24/7 hospital emergency dispatch, and billing support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16">
      <ContactHero />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl space-y-12">
        {/* 1. Four Quick Contact Channels */}
        <ContactInfoCards />

        {/* 2. Form & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactFAQ />
          </div>
        </div>
      </div>
    </div>
  );
}
