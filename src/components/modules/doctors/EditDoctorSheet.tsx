"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IDoctor } from "@/src/types/doctor.type";
import { ISpecialty } from "@/src/types/specialty.type";
import { updateDoctor } from "@/src/services/doctor.service";
import { getAllSpecialties } from "@/src/services/specialty.service";
import {
  updateDoctorValidationSchema,
  type UpdateDoctorFormValues,
} from "@/src/zod/doctor.validation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Loader2, Check } from "lucide-react";

interface EditDoctorSheetProps {
  doctor: IDoctor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDoctorSheet({
  doctor,
  open,
  onOpenChange,
}: EditDoctorSheetProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [specialtiesList, setSpecialtiesList] = useState<ISpecialty[]>([]);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateDoctorFormValues>({
    resolver: zodResolver(updateDoctorValidationSchema),
    defaultValues: {
      name: doctor.name,
      contactNumber: doctor.contactNumber || "",
      address: doctor.address || "",
      registrationNumber: doctor.registrationNumber,
      gender: doctor.gender,
      appointmentFee: doctor.appointmentFee,
      experience: doctor.experience,
      qualification: doctor.qualification,
      currentWorkingPlace: doctor.currentWorkingPlace,
      designation: doctor.designation,
    },
  });

  const getInitialSpecialtyIds = () => {
    const list =
      doctor.specialties || (doctor as any).doctorSpecialties || [];
    if (!list || list.length === 0) return [];
    return list
      .map((s: any) => s.specialtyId || s.specialty?.id || s.id)
      .filter(Boolean) as string[];
  };

  useEffect(() => {
    if (open) {
      setSelectedSpecialties(getInitialSpecialtyIds());
      reset({
        name: doctor.name,
        contactNumber: doctor.contactNumber || "",
        address: doctor.address || "",
        registrationNumber: doctor.registrationNumber,
        gender: doctor.gender,
        appointmentFee: doctor.appointmentFee,
        experience: doctor.experience,
        qualification: doctor.qualification,
        currentWorkingPlace: doctor.currentWorkingPlace,
        designation: doctor.designation,
      });

      if (specialtiesList.length === 0) {
        const fetchSpecialties = async () => {
          const res = await getAllSpecialties({ limit: 100 });
          if (res.success && res.data) {
            setSpecialtiesList(res.data);
          }
        };
        fetchSpecialties();
      }
    }
  }, [open, doctor]);

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEditSubmit = async (data: UpdateDoctorFormValues) => {
    setIsUpdating(true);
    try {
      const payload = {
        ...data,
        appointmentFee: Number(data.appointmentFee),
        experience: Number(data.experience),
        specialties: selectedSpecialties,
      };

      const res = await updateDoctor(doctor.id, payload);
      if (res.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl md:max-w-2xl bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 p-0 flex flex-col h-full">
        <div className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Edit Doctor Profile
            </SheetTitle>
            <SheetDescription>
              Update doctor details and assigned specialties.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form
          onSubmit={handleSubmit(handleEditSubmit)}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Section 1: Personal & Contact Information */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Basic Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Full Name
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Contact Number
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  {...register("contactNumber")}
                />
                {errors.contactNumber && (
                  <p className="text-xs text-red-500">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Address
              </label>
              <Input
                className="bg-zinc-50 dark:bg-zinc-950"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-xs text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  BMDC Reg. Number
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  {...register("registrationNumber")}
                />
                {errors.registrationNumber && (
                  <p className="text-xs text-red-500">
                    {errors.registrationNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.gender && (
                  <p className="text-xs text-red-500">{errors.gender.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Professional Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Designation
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  {...register("designation")}
                />
                {errors.designation && (
                  <p className="text-xs text-red-500">
                    {errors.designation.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Experience (Years)
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  type="number"
                  {...register("experience")}
                />
                {errors.experience && (
                  <p className="text-xs text-red-500">
                    {errors.experience.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                Current Working Place
              </label>
              <Input
                className="bg-zinc-50 dark:bg-zinc-950"
                {...register("currentWorkingPlace")}
              />
              {errors.currentWorkingPlace && (
                <p className="text-xs text-red-500">
                  {errors.currentWorkingPlace.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Qualification
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  {...register("qualification")}
                />
                {errors.qualification && (
                  <p className="text-xs text-red-500">
                    {errors.qualification.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Appointment Fee (৳)
                </label>
                <Input
                  className="bg-zinc-50 dark:bg-zinc-950"
                  type="number"
                  {...register("appointmentFee")}
                />
                {errors.appointmentFee && (
                  <p className="text-xs text-red-500">
                    {errors.appointmentFee.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Specialties Selection */}
          <div className="bg-white dark:bg-zinc-900 p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  Specialties
                </h4>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Click to toggle specialties assigned to this doctor.
                </p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {selectedSpecialties.length} selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {specialtiesList.length === 0 ? (
                <p className="text-sm text-zinc-400 italic">
                  Loading specialties...
                </p>
              ) : (
                specialtiesList.map((specialty) => {
                  const isSelected = selectedSpecialties.includes(specialty.id);
                  return (
                    <button
                      key={specialty.id}
                      type="button"
                      onClick={() => toggleSpecialty(specialty.id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                        ${
                          isSelected
                            ? "bg-blue-100 text-blue-700 border-2 border-blue-600 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-500 shadow-xs"
                            : "bg-zinc-100 text-zinc-600 border-2 border-transparent hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                        }
                      `}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      )}
                      {specialty.title}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end gap-3 mt-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isUpdating}
            onClick={handleSubmit(handleEditSubmit)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm"
          >
            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
