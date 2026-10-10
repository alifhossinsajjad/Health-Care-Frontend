import React from "react";
import { getDoctorById } from "@/src/services/doctor.service";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  GraduationCap, 
  Building2, 
  Stethoscope, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  CreditCard 
} from "lucide-react";
import Image from "next/image";

interface DoctorDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DoctorDetailsProps) {
  const { id } = await params;
  const { data: doctor } = await getDoctorById(id);
  
  if (!doctor) return { title: "Doctor Not Found" };
  
  return {
    title: `${doctor.name} | Health Care`,
    description: `${doctor.designation} at ${doctor.currentWorkingPlace}`,
  };
}

export default async function DoctorDetailsPage({ params }: DoctorDetailsProps) {
  const { id } = await params;
  const { success, data: doctor } = await getDoctorById(id);

  if (!success || !doctor) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      {/* Back Button */}
      <Link 
        href="/doctors" 
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
            <DoctorAvatar 
              src={doctor.profilePhoto} 
              alt={doctor.name} 
              className="w-32 h-32 mb-4 ring-4 ring-zinc-50 dark:ring-zinc-900 shadow-xl"
              fallbackClassName="text-3xl"
            />
            
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
              {doctor.name}
            </h1>
            <p className="text-blue-600 dark:text-blue-500 font-medium mb-4 flex items-center gap-1.5 justify-center">
              <Stethoscope className="w-4 h-4" />
              {doctor.designation}
            </p>

            {/* Specialties Badges */}
            {doctor.specialties && doctor.specialties.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {doctor.specialties.map((spec) => (
                  <span 
                    key={spec.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold"
                  >
                    {spec.specialty.title}
                  </span>
                ))}
              </div>
            )}

            <div className="w-full h-px bg-zinc-100 dark:bg-zinc-800 mb-6" />

            {/* Quick Stats */}
            <div className="w-full grid grid-cols-2 gap-4 mb-6 text-left">
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Experience</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{doctor.experience} Years+</span>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Rating</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  ⭐ {doctor.avarageRating > 0 ? doctor.avarageRating : "New"}
                </span>
              </div>
            </div>

            {/* Book Button */}
            <button className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* About & Qualification */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-blue-500" />
              Professional Background
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Qualifications</h3>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{doctor.qualification}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Current Workplace</h3>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{doctor.currentWorkingPlace}</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-1">Appointment Fee</h3>
                  <p className="font-black text-xl text-zinc-900 dark:text-zinc-100">৳{doctor.appointmentFee}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-red-500" />
              Contact & Location
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                <MapPin className="w-5 h-5 text-zinc-400" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{doctor.address}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <Phone className="w-5 h-5 text-zinc-400" />
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{doctor.contactNumber}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                  <Mail className="w-5 h-5 text-zinc-400" />
                  <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{doctor.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
