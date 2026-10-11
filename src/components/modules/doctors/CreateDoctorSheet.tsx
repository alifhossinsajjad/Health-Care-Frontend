"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { createDoctor } from "@/src/services/doctor.service";
import { getAllSpecialties } from "@/src/services/specialty.service";
import { ISpecialty } from "@/src/types/specialty.type";

import { createDoctorValidationSchema, type DoctorFormValues } from "@/src/zod/doctor.validation";

export default function CreateDoctorSheet() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [specialtiesList, setSpecialtiesList] = useState<ISpecialty[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DoctorFormValues>({
    resolver: zodResolver(createDoctorValidationSchema),
    defaultValues: {
      specialties: [],
    },
  });

  // Fetch specialties when sheet opens
  useEffect(() => {
    if (open && specialtiesList.length === 0) {
      const fetchSpecialties = async () => {
        const res = await getAllSpecialties({ limit: 100 });
        if (res.success && res.data) {
          setSpecialtiesList(res.data);
        }
      };
      fetchSpecialties();
    }
  }, [open, specialtiesList.length]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // Parse numbers before sending to API
      const payload = {
        ...data,
        doctor: {
          ...data.doctor,
          experience: Number(data.doctor.experience),
          appointmentFee: Number(data.doctor.appointmentFee),
        }
      };
      
      const res = await createDoctor(payload);
      if (res.success) {
        setOpen(false);
        reset();
        router.refresh();
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedSpecialties = watch("specialties");

  const toggleSpecialty = (id: string) => {
    const current = selectedSpecialties || [];
    if (current.includes(id)) {
      setValue("specialties", current.filter((sId) => sId !== id), { shouldValidate: true });
    } else {
      setValue("specialties", [...current, id], { shouldValidate: true });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md font-medium px-5">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </Button>
      </SheetTrigger>
      
      {/* We use sm:max-w-xl md:max-w-3xl for a very wide, premium sheet */}
      <SheetContent className="sm:max-w-xl md:max-w-3xl p-0 flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800">
        <div className="px-6 py-6 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-zinc-900 dark:text-white">Register New Doctor</SheetTitle>
            <SheetDescription>
              Fill in the details below to onboard a new doctor to the system.
            </SheetDescription>
          </SheetHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Section 1: Basic Information */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">1</span>
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="Dr. John Doe" {...register("doctor.name")} />
                {errors.doctor?.name && <p className="text-xs text-red-500">{errors.doctor.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Email Address</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="john@example.com" type="email" {...register("doctor.email")} />
                {errors.doctor?.email && <p className="text-xs text-red-500">{errors.doctor.email.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Initial Password</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="******" type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Contact Number</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="01711000000" {...register("doctor.contactNumber")} />
                {errors.doctor?.contactNumber && <p className="text-xs text-red-500">{errors.doctor.contactNumber.message}</p>}
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Address</label>
              <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="Dhaka, Bangladesh" {...register("doctor.address")} />
              {errors.doctor?.address && <p className="text-xs text-red-500">{errors.doctor.address.message}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Gender</label>
                <Controller
                  name="doctor.gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full bg-zinc-50 dark:bg-zinc-950">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.doctor?.gender && <p className="text-xs text-red-500">{errors.doctor.gender.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Professional Details */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">2</span>
              Professional Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Designation</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="Senior Consultant" {...register("doctor.designation")} />
                {errors.doctor?.designation && <p className="text-xs text-red-500">{errors.doctor.designation.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Qualification</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="MBBS, FCPS" {...register("doctor.qualification")} />
                {errors.doctor?.qualification && <p className="text-xs text-red-500">{errors.doctor.qualification.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Current Working Place</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="Dhaka Medical College" {...register("doctor.currentWorkingPlace")} />
                {errors.doctor?.currentWorkingPlace && <p className="text-xs text-red-500">{errors.doctor.currentWorkingPlace.message}</p>}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Registration No (BMDC)</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" placeholder="BMDC-XXXX" {...register("doctor.registrationNumber")} />
                {errors.doctor?.registrationNumber && <p className="text-xs text-red-500">{errors.doctor.registrationNumber.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Experience (Years)</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" type="number" placeholder="5" {...register("doctor.experience")} />
                {errors.doctor?.experience && <p className="text-xs text-red-500">{errors.doctor.experience.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Appointment Fee (৳)</label>
                <Input className="bg-zinc-50 dark:bg-zinc-950" type="number" placeholder="1000" {...register("doctor.appointmentFee")} />
                {errors.doctor?.appointmentFee && <p className="text-xs text-red-500">{errors.doctor.appointmentFee.message}</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Specialties Selection */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
            <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm">3</span>
                Assign Specialties
              </h3>
              <p className="text-sm text-zinc-500 mt-1 pl-8">Select one or more specialties for this doctor.</p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {specialtiesList.length === 0 ? (
                <p className="text-sm text-zinc-400 italic pl-2">No specialties found. Please add specialties first.</p>
              ) : (
                specialtiesList.map((specialty) => {
                  const isSelected = selectedSpecialties?.includes(specialty.id);
                  return (
                    <button
                      key={specialty.id}
                      type="button"
                      onClick={() => toggleSpecialty(specialty.id)}
                      className={`
                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all
                        ${isSelected 
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-600 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-500 shadow-sm" 
                          : "bg-zinc-100 text-zinc-600 border-2 border-transparent hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"}
                      `}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {specialty.title}
                    </button>
                  );
                })
              )}
            </div>
            {errors.specialties && <p className="text-xs text-red-500 pl-2">{errors.specialties.message}</p>}
          </div>
        </form>

        {/* Fixed Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-end gap-3 mt-auto">
          <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full px-6">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm" disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Doctor
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
