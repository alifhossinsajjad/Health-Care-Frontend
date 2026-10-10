"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { cn } from "cn";
import { PieChartData, BarChartData } from "@/src/types/dashboard.types";

const COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ef4444", // Red
  "#8b5cf6", // Violet
  "#ec4899", // Pink
];

interface DashboardPieChartProps {
  data: PieChartData[];
  title?: string;
  className?: string;
}

export function DashboardPieChart({ data, title, className }: DashboardPieChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className={cn("p-6 rounded-3xl bg-gradient-to-br from-white to-zinc-50/80 dark:from-zinc-950 dark:to-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col", className)}>
      {title && <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">{title}</h3>}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#18181b',
                fontWeight: 600,
              }}
              itemStyle={{ fontWeight: 600 }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={6}
              dataKey="count"
              nameKey="status"
              stroke="none"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface DashboardBarChartProps {
  data: BarChartData[];
  title?: string;
  className?: string;
}

export function DashboardBarChart({ data, title, className }: DashboardBarChartProps) {
  if (!data || data.length === 0) {
    return null;
  }

  // Format month (e.g. "2026-09-01T..." to "Sep 2026")
  const formattedData = data.map((item) => {
    const date = new Date(item.month);
    return {
      ...item,
      displayMonth: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  });

  return (
    <div className={cn("p-6 rounded-3xl bg-gradient-to-br from-white to-zinc-50/80 dark:from-zinc-950 dark:to-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] flex flex-col", className)}>
      {title && <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6">{title}</h3>}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e4e4e7" opacity={0.5} />
            <XAxis dataKey="displayMonth" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 13, fontWeight: 500 }} dy={12} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 13, fontWeight: 500 }} dx={-10} />
            <Tooltip 
              cursor={{ fill: '#f4f4f5', opacity: 0.4 }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid rgba(255,255,255,0.1)', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(8px)',
                color: '#18181b',
                fontWeight: 600,
              }}
            />
            <Bar dataKey="count" fill="url(#colorUv)" radius={[6, 6, 0, 0]} barSize={45}>
              {/* Define a linear gradient for the bars */}
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
