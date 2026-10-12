import React from "react";
import { getAllSchedules } from "@/src/services/schedule.service";
import { DataTable } from "@/src/components/shared/DataTable";
import { scheduleColumns } from "@/src/components/modules/schedules/columns";
import { CreateScheduleSheet } from "@/src/components/modules/schedules/CreateScheduleSheet";
import { FilterSelect } from "@/src/components/shared/FilterSelect";

interface SchedulesManagementProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function SchedulesManagementPage({
  searchParams,
}: SchedulesManagementProps) {
  // Await search params (Next.js 15 requirement)
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 10;
  const sortOrder = (resolvedParams.sortOrder as "asc" | "desc") || "desc";
  const startDateTime = resolvedParams.startDateTime || undefined;
  const endDateTime = resolvedParams.endDateTime || undefined;

  // Fetch schedules from backend
  const {
    success,
    data: schedules,
    meta,
  } = await getAllSchedules({
    page,
    limit,
    sortOrder,
    startDateTime,
    endDateTime,
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Schedules Management
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Generate and manage appointment availability slots for doctors and
            patients.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-44">
            <FilterSelect
              paramName="sortOrder"
              placeholder="Sort Order"
              defaultLabel="All Schedules"
              options={[
                { label: "Latest Schedules", value: "desc" },
                { label: "Oldest Schedules", value: "asc" },
              ]}
            />
          </div>

          <CreateScheduleSheet />
        </div>
      </div>

      {/* Schedules Data Table */}
      <DataTable
        columns={scheduleColumns}
        data={success && schedules ? schedules : []}
        meta={meta}
      />
    </div>
  );
}
