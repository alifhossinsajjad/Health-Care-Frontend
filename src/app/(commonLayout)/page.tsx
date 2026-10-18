import React from "react";
import { getAllDoctors } from "@/src/services/doctor.service";
import { getAllSpecialties } from "@/src/services/specialty.service";
import { HeroSection } from "@/src/components/home/HeroSection";
import { StatsBar } from "@/src/components/home/StatsBar";
import { SpecialtiesSection } from "@/src/components/home/SpecialtiesSection";
import { FeaturedDoctorsSection } from "@/src/components/home/FeaturedDoctorsSection";
import { EcosystemBentoGrid } from "@/src/components/home/EcosystemBentoGrid";
import { HowItWorksSection } from "@/src/components/home/HowItWorksSection";
import { TestimonialsSection } from "@/src/components/home/TestimonialsSection";
import { CtaBanner } from "@/src/components/home/CtaBanner";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "HealthCare | World-Class Telehealth & Hospital Appointments",
  description:
    "Connect with 150+ accredited medical specialists, book instant video consultations, and manage digital health records with bank-grade encryption.",
};

export default async function Home() {
  // Fetch live doctors & specialties from backend
  const [doctorsRes, specialtiesRes] = await Promise.all([
    getAllDoctors({ limit: 6 }).catch(() => ({ success: false, data: [] })),
    getAllSpecialties({ limit: 8 }).catch(() => ({ success: false, data: [] })),
  ]);

  const doctors = doctorsRes?.data || [];
  const specialties = specialtiesRes?.data || [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. Hero Section with Interactive Doctor Search */}
      <HeroSection />

      {/* 2. Scale & Social Proof Stats Bar */}
      <StatsBar />

      {/* 3. Clinical Specialties & Departments */}
      <SpecialtiesSection specialties={specialties} />

      {/* 4. Featured Board-Certified Specialists */}
      <FeaturedDoctorsSection doctors={doctors} />

      {/* 5. Modern Healthcare Ecosystem Bento Grid */}
      <EcosystemBentoGrid />

      {/* 6. 3-Step Frictionless Patient Journey */}
      <HowItWorksSection />

      {/* 7. Patient Testimonials & Recovery Stories */}
      <TestimonialsSection />

      {/* 8. Conversion-Driven Call to Action Banner */}
      <CtaBanner />
    </div>
  );
}
