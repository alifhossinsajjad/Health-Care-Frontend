import React from "react";
import { getAllDoctors } from "@/src/services/doctor.service";
import { DebouncedSearch } from "@/src/components/shared/DebouncedSearch";
import { DataTable } from "@/src/components/shared/DataTable";
import { doctorColumns } from "@/src/components/modules/doctors/columns";
import { FilterSelect } from "@/src/components/shared/FilterSelect";
import CreateDoctorSheet from "@/src/components/modules/doctors/CreateDoctorSheet";

interface DoctorsManagementProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DoctorsManagementPage({
  searchParams,
}: DoctorsManagementProps) {
  // Await search params (Next.js 15)
  const resolvedParams = await searchParams;
  const searchTerm = resolvedParams.searchTerm || "";
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 10;
  const gender = resolvedParams.gender || undefined;

  // Fetch data
  const {
    success,
    data: doctors,
    meta,
  } = await getAllDoctors({
    searchTerm,
    page,
    limit,
    gender,
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
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full md:w-40">
            <FilterSelect
              paramName="gender"
              placeholder="Gender"
              defaultLabel="All Genders"
              options={[
                { label: "Male", value: "MALE" },
                { label: "Female", value: "FEMALE" },
              ]}
            />
          </div>
          <div className="w-full md:w-80">
            <DebouncedSearch placeholder="Search doctors by name or email..." />
          </div>
          <CreateDoctorSheet />
        </div>
      </div>

      <DataTable
        columns={doctorColumns}
        data={success && doctors ? doctors : []}
        meta={meta}
      />
    </div>
  );
}
