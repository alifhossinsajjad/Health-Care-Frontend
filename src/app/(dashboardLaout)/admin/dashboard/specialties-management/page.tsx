import React from "react";
import { getAllSpecialties } from "@/src/services/specialty.service";
import { DebouncedSearch } from "@/src/components/shared/DebouncedSearch";
import Image from "next/image";
import { Trash2, Plus } from "lucide-react";
import CreateSpecialtyModal from "@/src/components/modules/specialties/CreateSpecialtyModal";
import SpecialtyIcon from "@/src/components/modules/specialties/SpecialtyIcon";
import DeleteSpecialtyButton from "@/src/components/modules/specialties/DeleteSpecialtyButton";

interface SpecialtiesManagementProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SpecialtiesManagementPage({
  searchParams,
}: SpecialtiesManagementProps) {
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.searchTerm || "";
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 12; // 12 is good for grid layouts

  const {
    success,
    data: specialties,
    meta,
  } = await getAllSpecialties({
    searchTerm,
    page,
    limit,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Specialties Management
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Manage medical specialties that doctors can be associated with.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-80">
            <DebouncedSearch placeholder="Search specialties..." />
          </div>
          <CreateSpecialtyModal />
        </div>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {success && specialties && specialties.length > 0 ? (
          specialties.map((specialty) => (
            <div
              key={specialty.id}
              className="group relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              {/* Delete Button (Hidden by default, shown on hover) */}
              <DeleteSpecialtyButton
                id={specialty.id}
                title={specialty.title}
              />

              {/* Icon Container */}
              <div className="w-20 h-20 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center p-4 border border-zinc-100 dark:border-zinc-800 group-hover:border-blue-100 dark:group-hover:border-blue-900 transition-colors">
                <SpecialtyIcon
                  src={specialty.icon}
                  alt={specialty.title}
                  className="w-full h-full object-contain filter group-hover:brightness-110 transition-all"
                />
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 capitalize">
                  {specialty.title}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl border-dashed">
            <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
              <Hospital className="w-8 h-8 text-zinc-400" />
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              No specialties found
            </h3>
            <p className="text-sm text-zinc-500 max-w-sm text-center mt-2">
              Get started by creating a new medical specialty. Doctors will need
              these during registration.
            </p>
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      {meta && meta.total > 0 && (
        <div className="flex items-center justify-between px-2 pt-4">
          <span className="text-sm text-zinc-500">
            Showing{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {specialties?.length || 0}
            </span>{" "}
            of{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {meta.total}
            </span>{" "}
            specialties
          </span>
          {/* Reusable table's pagination component would ideally be extracted, but here we can keep it simple or implement a standalone pagination component. For now, since it's a grid, we can just show the total. */}
        </div>
      )}
    </div>
  );
}

// Temporary import for the icon used in the empty state
import { Hospital } from "lucide-react";
