import React from "react";
import { getAllDoctors } from "@/src/services/doctor.service";
import { DebouncedSearch } from "@/src/components/shared/DebouncedSearch";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { FilterSelect } from "@/src/components/shared/FilterSelect";
import { AppPagination } from "@/src/components/shared/AppPagination";
import Link from "next/link";
import { MapPin, Briefcase, Star, Stethoscope, IndianRupee, SearchX } from "lucide-react";

export const metadata = {
  title: "Find Doctors | Health Care",
  description: "Search and find the best doctors",
};

interface DoctorsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DoctorsPage({ searchParams }: DoctorsPageProps) {
  // Await the searchParams object in Next.js 15
  const resolvedParams = await searchParams;
  
  // Extract parameters
  const searchTerm = resolvedParams.searchTerm || "";
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 12;
  const gender = resolvedParams.gender || undefined;
  
  // Sorting for fee
  const sortOption = resolvedParams.sort || undefined;
  let sortBy;
  let sortOrder;

  if (sortOption === "fee-asc") {
    sortBy = "appointmentFee";
    sortOrder = "asc";
  } else if (sortOption === "fee-desc") {
    sortBy = "appointmentFee";
    sortOrder = "desc";
  }

  // Fetch data directly on the server
  const { success, data: doctors, meta } = await getAllDoctors({
    searchTerm,
    page,
    limit,
    gender,
    sortBy,
    sortOrder,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header & Search */}
      <div className="flex flex-col mb-10 gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
              Find Your <span className="text-blue-600 dark:text-blue-500">Doctor</span>
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              Book an appointment with our highly qualified medical professionals.
            </p>
          </div>
          
          <div className="w-full md:w-80">
            <DebouncedSearch placeholder="Search by name, qualification..." />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div className="w-full sm:w-48">
            <FilterSelect 
              paramName="gender" 
              placeholder="Gender"
              defaultLabel="All Genders"
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" }
              ]}
            />
          </div>
          <div className="w-full sm:w-48">
            <FilterSelect 
              paramName="sort" 
              placeholder="Sort By Fee"
              defaultLabel="All Appointment Fee"
              options={[
                { label: "Fee: Low to High", value: "fee-asc" },
                { label: "Fee: High to Low", value: "fee-desc" }
              ]}
            />
          </div>
        </div>
      </div>

      {/* Grid of Doctors */}
      {success && doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="relative group flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  doctor.user?.status === "ACTIVE" 
                    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400" 
                    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
                }`}>
                  {doctor.user?.status || "UNKNOWN"}
                </span>
              </div>

              {/* Card Header (Avatar + Name) */}
              <div className="p-6 flex flex-col items-center text-center border-b border-zinc-100 dark:border-zinc-800/50 bg-gradient-to-b from-zinc-50/50 to-white dark:from-zinc-900/20 dark:to-zinc-950">
                <DoctorAvatar 
                  src={doctor.profilePhoto} 
                  alt={doctor.name} 
                  className="w-24 h-24 mb-4 ring-4 ring-white dark:ring-zinc-950 shadow-md"
                />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {doctor.name}
                </h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5 justify-center">
                  <Stethoscope className="w-4 h-4" />
                  {doctor.designation}
                </p>
              </div>

              {/* Card Body (Details) */}
              <div className="p-6 flex flex-col gap-3 flex-1 bg-white dark:bg-zinc-950">
                <div className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                  <Briefcase className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                  <span className="line-clamp-2">{doctor.currentWorkingPlace}</span>
                </div>
                
                <div className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
                  <MapPin className="w-4 h-4 mt-0.5 text-zinc-400 shrink-0" />
                  <span className="line-clamp-2">{doctor.address}</span>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-100 dark:border-zinc-900">
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Fee</span>
                    <span className="text-lg font-black text-zinc-900 dark:text-zinc-100">
                      ৳{doctor.appointmentFee}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/doctors/${doctor.id}`}
                    className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold text-white bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-full transition-transform active:scale-95 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-10 h-10 text-zinc-400" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">No doctors found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
            We couldn't find any doctors matching your search "{searchTerm}". Try adjusting your filters or search terms.
          </p>
        </div>
      )}

      {/* Pagination Footer */}
      {meta && meta.total > 0 && (
        <div className="mt-8">
          <AppPagination meta={meta} />
        </div>
      )}
    </div>
  );
}


