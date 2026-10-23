"use client";

import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    title: "24/7 Clinical Emergency",
    details: "+880 1800-HEALTH",
    subtext: "Free nationwide clinical helpline & ambulance",
    action: "tel:+8801800432584",
    actionLabel: "Call Hotline",
  },
  {
    icon: <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />,
    title: "Email Support",
    details: "support@healthcare-platform.com",
    subtext: "Inquiries, prescription assistance & billing",
    action: "mailto:support@healthcare-platform.com",
    actionLabel: "Send Email",
  },
  {
    icon: <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />,
    title: "Headquarters & Clinics",
    details: "HealthCare Tower, Level 4-8",
    subtext: "Dhanmondi, Dhaka 1205, Bangladesh",
    action: "https://maps.google.com",
    actionLabel: "View on Map",
  },
  {
    icon: <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    title: "Operating Hours",
    details: "Hospital ER: 24/7/365",
    subtext: "Telehealth Doctors: 8:00 AM - 11:00 PM Daily",
    action: "/doctors",
    actionLabel: "Book Online",
  },
];

export function ContactInfoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {CONTACT_INFO.map((item, index) => (
        <div
          key={index}
          className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all hover:-translate-y-0.5"
        >
          <div>
            <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-3.5">
              {item.icon}
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              {item.title}
            </h3>
            <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 mt-1">
              {item.details}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
              {item.subtext}
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800">
            <a
              href={item.action}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              {item.actionLabel} &rarr;
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
