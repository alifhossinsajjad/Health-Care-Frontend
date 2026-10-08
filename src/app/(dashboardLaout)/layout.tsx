import React from "react";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import { DashboardSidebar } from "@/src/components/modules/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/src/components/modules/dashboard/DashboardHeader";
import { UserRole } from "@/src/constants/sidebar.config";

export default async function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  let userRole: UserRole = "PATIENT";
  let userEmail = "";
  try {
    const decoded: any = jwtDecode(token);
    userRole = decoded?.role === "SUPER_ADMIN" ? "ADMIN" : (decoded?.role as UserRole) || "PATIENT";
    userEmail = decoded?.email || "";
  } catch (error) {
    console.error("Failed to decode token in layout", error);
  }

  return (
    <SidebarProvider>
      <DashboardSidebar userRole={userRole} />
      
      <div className="flex flex-1 flex-col w-full min-h-screen">
        <DashboardHeader userRole={userRole} userEmail={userEmail} />
        
        <main className="flex-1 overflow-auto bg-zinc-50/50 dark:bg-zinc-900/50 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
