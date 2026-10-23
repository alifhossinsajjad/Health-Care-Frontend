"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide footer on full-screen AI Assistant workspace
  if (pathname === "/ai-assistant") {
    return null;
  }

  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
      <div className="container mx-auto px-4 md:px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Activity className="size-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                HealthCare
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Leading digital healthcare infrastructure connecting patients with board-certified doctors, encrypted video telehealth, and seamless prescription management.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">+880 1800-HEALTH (24/7 Helpline)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>support@healthcare-platform.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>Dhaka, Bangladesh • Global Telehealth Available</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Patients */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              For Patients
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/doctors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Find Accredited Doctors
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-appointments" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  My Appointments
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-prescriptions" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Digital Prescriptions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/health-records" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Health Records Vault
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Patient Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Specialties */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/doctors?searchTerm=Cardiology" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Cardiology & Heart Care
                </Link>
              </li>
              <li>
                <Link href="/doctors?searchTerm=Neurology" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Neurology & Brain
                </Link>
              </li>
              <li>
                <Link href="/doctors?searchTerm=Pediatrics" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pediatrics & Child Care
                </Link>
              </li>
              <li>
                <Link href="/doctors?searchTerm=Orthopedics" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Orthopedics & Spine
                </Link>
              </li>
              <li>
                <Link href="/doctors?searchTerm=Dermatology" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Dermatology & Skin
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>HIPAA Compliant</span>
              </li>
              <li className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Stripe Verified Partner</span>
              </li>
              <li>
                <span className="text-zinc-400 text-xs">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-400 text-xs">Terms of Service</span>
              </li>
              <li>
                <span className="text-zinc-400 text-xs">Doctor Verification Code</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <p>© {new Date().getFullYear()} HealthCare Services Ltd. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for healthier communities worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
