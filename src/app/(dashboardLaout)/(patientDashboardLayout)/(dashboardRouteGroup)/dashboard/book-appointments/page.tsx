import React from "react";
import { ClipboardList } from "lucide-react";
import { getAllDoctorSchedules } from "@/src/services/doctor-schedule.service";
import { DataTable } from "@/src/components/shared/DataTable";
import { doctorScheduleColumns } from "@/src/components/modules/doctor-schedules/columns";
import { DoctorScheduleFilters } from "@/src/components/modules/doctor-schedules/DoctorScheduleFilters";
import { IDoctorScheduleFilters } from "@/src/types/doctor-schedule.type";

interface BookAppointmentsPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function BookAppointmentsPage({
  searchParams,
}: BookAppointmentsPageProps) {
  const resolvedParams = await searchParams;

  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 10;
  const searchTerm = resolvedParams.searchTerm || undefined;
  const isBooked =
    resolvedParams.isBooked !== undefined && resolvedParams.isBooked !== "all"
      ? resolvedParams.isBooked === "true"
        ? true
        : resolvedParams.isBooked === "false"
        ? false
        : undefined
      : false; // Defaults to available slots for booking
  const startDate = resolvedParams.startDate || undefined;
  const endDate = resolvedParams.endDate || undefined;
  const sortOrder = (resolvedParams.sortOrder as "asc" | "desc") || "asc";

  const filters: IDoctorScheduleFilters = {
    page,
    limit,
    searchTerm,
    isBooked,
    startDate,
    endDate,
    sortOrder,
  };

  const schedulesRes = await getAllDoctorSchedules(filters);
  const schedules = schedulesRes.success && schedulesRes.data ? schedulesRes.data : [];
  const meta = schedulesRes.meta;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5" />
            </span>
            Book Doctor Appointment
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 pt-1">
            Browse available doctor schedule slots, choose your preferred timing, and schedule your appointment.
          </p>
        </div>
      </div>

      {/* Senior-Level Filter Bar with DebouncedSearch */}
      <DoctorScheduleFilters
        totalResults={meta?.total ?? schedules.length}
      />

      {/* Schedules Data Table */}
      <DataTable
        columns={doctorScheduleColumns}
        data={schedules}
        meta={meta}
      />
    </div>
  );
}
