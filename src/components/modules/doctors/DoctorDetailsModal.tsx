"use client";

import React from "react";
import { IDoctor } from "@/src/types/doctor.type";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import {
  Star,
  Check,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Building2,
  Award,
  Clock,
  CreditCard,
  FileBadge,
} from "lucide-react";

interface DoctorDetailsModalProps {
  doctor: IDoctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DoctorDetailsModal({
  doctor,
  open,
  onOpenChange,
}: DoctorDetailsModalProps) {
  const assignedSpecialties =
    doctor.specialties || (doctor as any).doctorSpecialties || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-xl bg-white dark:bg-zinc-950 max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Doctor Profile & Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 pt-2">
          <DoctorAvatar
            src={doctor.profilePhoto}
            alt={doctor.name}
            className="w-24 h-24 shadow-md ring-4 ring-blue-50 dark:ring-blue-950"
          />

          <div className="text-center">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {doctor.name}
            </h3>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center justify-center gap-1.5 mt-0.5">
              <Stethoscope className="w-4 h-4" />
              {doctor.designation}
            </p>
          </div>

          {/* Rating & Reviews Card */}
          <div className="w-full flex items-center justify-between p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <div className="text-xs font-semibold text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                  Rating & Reviews
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  {doctor.avarageRating > 0 ? (
                    <>
                      <span>{doctor.avarageRating.toFixed(1)} / 5.0</span>
                      <span className="text-xs text-zinc-500 font-normal">
                        Average rating
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-zinc-500 font-normal">
                      No reviews yet
                    </span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-2xs">
              ⭐{" "}
              {doctor.avarageRating > 0
                ? `${doctor.avarageRating.toFixed(1)}`
                : "New"}
            </span>
          </div>

          {/* Assigned Specialties Badges */}
          <div className="w-full space-y-2 p-3.5 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Assigned Specialties
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {assignedSpecialties.length > 0 ? (
                assignedSpecialties.map((item: any) => (
                  <span
                    key={item.id || item.specialtyId || item.specialty?.id}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                    {item.specialty?.title || item.title || "Specialty"}
                  </span>
                ))
              ) : (
                <span className="text-xs text-zinc-400 italic">
                  No specialties assigned yet
                </span>
              )}
            </div>
          </div>

          {/* Detailed Info List */}
          <div className="w-full space-y-3 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {doctor.email}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Contact
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {doctor.contactNumber}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500">Gender</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">
                {doctor.gender.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between items-start py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Address
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right max-w-[220px] break-words">
                {doctor.address}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <FileBadge className="w-3.5 h-3.5" /> BMDC Reg. No
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {doctor.registrationNumber}
              </span>
            </div>
            <div className="flex justify-between items-start py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Working Place
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right max-w-[220px] break-words">
                {doctor.currentWorkingPlace}
              </span>
            </div>
            <div className="flex justify-between items-start py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500">Qualification</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100 text-right max-w-[220px] break-words">
                {doctor.qualification}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Experience
              </span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {doctor.experience} Years
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-zinc-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Consultation Fee
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                ৳{doctor.appointmentFee}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-zinc-500">Account Status</span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  doctor.user?.status === "ACTIVE"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {doctor.user?.status || "ACTIVE"}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
