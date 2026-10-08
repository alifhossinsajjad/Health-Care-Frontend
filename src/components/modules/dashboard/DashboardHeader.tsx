import * as React from "react";
import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { UserProfileDropdown } from "./UserProfileDropdown";

export function DashboardHeader({ userRole, userEmail }: { userRole?: string; userEmail?: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-6 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-14">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <div className="hidden md:block h-4 w-px bg-muted mx-2" />
        <h2 className="text-lg font-semibold hidden md:block tracking-tight">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <UserProfileDropdown initialRole={userRole} initialEmail={userEmail} />
      </div>
    </header>
  );
}
