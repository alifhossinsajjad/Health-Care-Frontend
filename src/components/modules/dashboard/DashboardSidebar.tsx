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
                  // We check if the exact path matches, or if it's a child path
                  // but for the root dashboard path (e.g. `/dashboard`), we only highlight if exact match
                  const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href + "/"));
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <item.icon />
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