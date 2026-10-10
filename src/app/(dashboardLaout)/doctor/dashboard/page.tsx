import * as React from "react";
import { getDashboardStats } from "@/src/services/stats.service";
import { StatCard } from "@/src/components/shared/stats/StatCard";
import { DashboardPieChart } from "@/src/components/shared/stats/StatCharts";
import {
  Users,
  CalendarCheck,
  Star,
  DollarSign,
} from "lucide-react";

export default async function DoctorDashboardPage() {
  const { success, data: stats, message } = await getDashboardStats();

  if (!success || !stats) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Dashboard</h2>
        <p className="text-zinc-500">{message || "Failed to fetch the latest statistics."}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Doctor Overview
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Here is a summary of your appointments, patients, and reviews.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          iconClassName="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500"
        />
        <StatCard
          title="Appointments"
          value={stats.appointmentCount || 0}
          icon={CalendarCheck}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500"
        />
        <StatCard
          title="My Patients"
          value={stats.patientCount || 0}
          icon={Users}
          iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-500"
        />
        <StatCard
          title="Reviews"
          value={stats.reviewCount || 0}
          icon={Star}
          iconClassName="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {stats.appointmentStatusDistribution && stats.appointmentStatusDistribution.length > 0 && (
          <DashboardPieChart 
            data={stats.appointmentStatusDistribution} 
            title="Appointment Status Distribution" 
          />
        )}
      </div>
    </div>
  );
}