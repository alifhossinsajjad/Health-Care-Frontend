"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/ui/sidebar";
import { getNavItemsByRole, UserRole } from "@/src/constants/sidebar.config";

export function DashboardSidebar({ userRole }: { userRole: UserRole }) {
  const pathname = usePathname();
  
  // Use the new sectioned config
  const navSections = getNavItemsByRole(userRole);

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-6">
        <Link href="/" className="flex items-center gap-2 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Activity className="size-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">HealthCare</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navSections.map((section, index) => (
          <SidebarGroup key={index}>
            {section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  // We check if the exact path matches.
                  // For nested routes, we only highlight if the item is not the root dashboard.
                  // E.g., if item is /admin/dashboard/doctors, it highlights for /admin/dashboard/doctors/xyz
                  const isDashboardRoot = item.href === "/admin/dashboard" || item.href === "/doctor/dashboard" || item.href === "/dashboard";
                  
                  const isActive = isDashboardRoot 
                    ? pathname === item.href 
                    : pathname === item.href || pathname.startsWith(item.href + "/");
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        // We intentionally omit `isActive={isActive}` so Shadcn doesn't apply `data-[active=true]:bg-sidebar-accent` 
                        // which overrides our custom `bg-blue-600` via Tailwind-merge conflicts.
                        tooltip={item.title}
                        className={isActive 
                          ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:text-white transition-all duration-300"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        }
                      >
                        <Link href={item.href}>
                          <item.icon className={isActive ? "text-white" : "text-zinc-500"} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}