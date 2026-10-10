import React from "react";
import { getAllDoctors } from "@/src/services/doctor.service";
import { DebouncedSearch } from "@/src/components/shared/DebouncedSearch";
import { DoctorAvatar } from "@/src/components/shared/DoctorAvatar";
import { format } from "date-fns";

interface DoctorsManagementProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DoctorsManagementPage({ searchParams }: DoctorsManagementProps) {
  // Await search params (Next.js 15)
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.searchTerm || "";
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 10;

  // Fetch data
  const { success, data: doctors, meta } = await getAllDoctors({
    searchTerm,
    page,
    limit,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Doctors Management
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            View and manage all registered doctors in the system.
          </p>
        </div>
        <div className="w-full md:w-80">
          <DebouncedSearch placeholder="Search doctors by name or email..." />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-zinc-500 dark:text-zinc-400">
            <thead className="text-xs text-zinc-700 uppercase bg-zinc-50 dark:bg-zinc-900/50 dark:text-zinc-300 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Doctor</th>
                <th scope="col" className="px-6 py-4 font-semibold">Contact</th>
                <th scope="col" className="px-6 py-4 font-semibold">Designation</th>
                <th scope="col" className="px-6 py-4 font-semibold">Fee</th>
                <th scope="col" className="px-6 py-4 font-semibold">Joined At</th>
              </tr>
            </thead>
            <tbody>
              {success && doctors && doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <tr 
                    key={doctor.id} 
                    className="bg-white dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <DoctorAvatar 
                          src={doctor.profilePhoto} 
                          alt={doctor.name} 
                          className="w-10 h-10 border-none shadow-none" 
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-zinc-900 dark:text-zinc-100">{doctor.name}</span>
                          <span className="text-xs text-zinc-500">{doctor.qualification}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-200">{doctor.email}</span>
                        <span className="text-xs">{doctor.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-200">{doctor.designation}</span>
                        <span className="text-xs truncate max-w-[150px]">{doctor.currentWorkingPlace}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                        ৳{doctor.appointmentFee}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(doctor.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-zinc-500">
                    No doctors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Basic Pagination Info Footer */}
        {meta && (
          <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 flex items-center justify-between">
            <span className="text-sm text-zinc-500">
              Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{doctors?.length || 0}</span> of <span className="font-medium text-zinc-900 dark:text-zinc-100">{meta.total}</span> doctors
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
