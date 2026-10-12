import React from "react";
import { Clock } from "lucide-react";
import {
  getMyDoctorSchedules,
  getAllDoctorSchedules,
} from "@/src/services/doctor-schedule.service";
import { DataTable } from "@/src/components/shared/DataTable";
import { myDoctorScheduleColumns } from "@/src/components/modules/doctor-schedules/columns";
import { DoctorScheduleFilters } from "@/src/components/modules/doctor-schedules/DoctorScheduleFilters";
import { CreateMyDoctorScheduleSheet } from "@/src/components/modules/doctor-schedules/CreateMyDoctorScheduleSheet";
import { BulkUpdateDoctorScheduleModal } from "@/src/components/modules/doctor-schedules/BulkUpdateDoctorScheduleModal";
import { IDoctorScheduleFilters } from "@/src/types/doctor-schedule.type";

interface DoctorMySchedulesPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function DoctorMySchedulesPage({
  searchParams,
}: DoctorMySchedulesPageProps) {
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
      : undefined;
  const startDate = resolvedParams.startDate || undefined;
  const endDate = resolvedParams.endDate || undefined;
  const sortOrder = (resolvedParams.sortOrder as "desc" | "asc") || "desc";

  const filters: IDoctorScheduleFilters = {
    page,
    limit,
    searchTerm,
    isBooked,
    startDate,
    endDate,
    sortOrder,
  };

  const mySchedulesRes = await getMyDoctorSchedules(filters);
  let schedules =
    mySchedulesRes.success && mySchedulesRes.data ? mySchedulesRes.data : [];
  let meta = mySchedulesRes.meta;

  // Fallback to all schedules if personal schedules return 0
  if (schedules.length === 0) {
    const allRes = await getAllDoctorSchedules(filters);
    if (allRes.success && allRes.data && allRes.data.length > 0) {
      schedules = allRes.data;
      meta = allRes.meta;
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </span>
            My Schedule Slots
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 pt-1">
            View your consultation schedule intervals, booking status, and
            patient appointments.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <BulkUpdateDoctorScheduleModal schedules={schedules} />
          <CreateMyDoctorScheduleSheet
            existingScheduleIds={schedules.map((s) => s.scheduleId)}
          />
        </div>
      </div>

      {/* Senior-Level Filter Bar with DebouncedSearch */}
      <DoctorScheduleFilters
        totalResults={meta?.total ?? schedules?.length ?? 0}
      />

      {/* Schedules Data Table */}
      <DataTable
        columns={myDoctorScheduleColumns}
        data={schedules}
        meta={meta}
      />
    </div>
  );
}
