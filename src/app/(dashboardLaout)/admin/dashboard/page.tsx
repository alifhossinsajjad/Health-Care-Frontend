import * as React from "react";
import { getDashboardStats } from "@/src/services/stats.service";
import { StatCard } from "@/src/components/shared/stats/StatCard";
import { DashboardPieChart, DashboardBarChart } from "@/src/components/shared/stats/StatCharts";
import {
  Users,
  Stethoscope,
  CalendarCheck,
  ShieldAlert,
  CreditCard,
  DollarSign,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

export default async function AdminPage() {
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
          Admin Overview
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Here is what's happening in your hospital today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue?.toLocaleString() || 0}`}
          icon={DollarSign}
          iconClassName="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
          description="+12.5% from last month"
        />
        <StatCard
          title="Appointments"
          value={stats.appointmentCount || 0}
          icon={CalendarCheck}
          iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
          description="Active sessions"
        />
        <StatCard
          title="Total Users"
          value={stats.userCount || 0}
          icon={Users}
          iconClassName="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
          description="Registered users"
        />
        <StatCard
          title="Doctors"
          value={stats.doctorCount || 0}
          icon={Stethoscope}
          iconClassName="bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
          description="Medical staff"
        />
        <StatCard
          title="Patients"
          value={stats.patientCount || 0}
          icon={UserCheck}
          iconClassName="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
          description="Enrolled patients"
        />
        <StatCard
          title="Payments"
          value={stats.paymentCount || 0}
          icon={CreditCard}
          iconClassName="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
          description="Successful txns"
        />
        <StatCard
          title="Admins"
          value={stats.adminCount || 0}
          icon={ShieldCheck}
          iconClassName="bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-500"
        />
        <StatCard
          title="Super Admins"
          value={stats.superAdminCount || 0}
          icon={ShieldAlert}
          iconClassName="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {stats.barChartData && stats.barChartData.length > 0 && (
          <DashboardBarChart 
            data={stats.barChartData} 
            title="Monthly Appointments" 
          />
        )}
        {stats.pieChartData && stats.pieChartData.length > 0 && (
          <DashboardPieChart 
            data={stats.pieChartData} 
            title="Appointment Status Distribution" 
          />
        )}
      </div>
    </div>
  );
}