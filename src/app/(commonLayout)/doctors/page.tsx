import React from "react";
import { getAllDoctors } from "@/src/services/doctor.service";
import { DebouncedSearch } from "@/src/components/shared/DebouncedSearch";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import Link from "next/link";
import { MapPin, Briefcase, Star, Stethoscope, IndianRupee } from "lucide-react";

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

  // Fetch data directly on the server
  const { success, data: doctors, meta } = await getAllDoctors({
    searchTerm,
    page,
    limit,
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Find Your <span className="text-blue-600 dark:text-blue-500">Doctor</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Book an appointment with our highly qualified medical professionals.
          </p>
        </div>
        
        <div className="w-full md:w-auto">
          <DebouncedSearch placeholder="Search by name, qualification..." />
        </div>
      </div>

      {/* Grid of Doctors */}
      {success && doctors && doctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id} 
              className="group flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
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
    </div>
  );
}

// Temporary placeholder for SearchX icon in the no-results state
function SearchX(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m13.5 8.5-5 5" />
      <path d="m8.5 8.5 5 5" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
