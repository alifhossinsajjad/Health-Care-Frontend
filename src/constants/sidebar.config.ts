import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  UserRound,
  FileText,
  Activity,
} from "lucide-react";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export const SIDEBAR_LINKS: Record<UserRole, NavItem[]> = {
  SUPER_ADMIN: [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Manage Users", href: "/admin/manage-users", icon: Users },
    { title: "Appointments", href: "/admin/appointments", icon: Calendar },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ],
  ADMIN: [
    { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { title: "Manage Doctors", href: "/admin/doctors", icon: Users },
    { title: "Appointments", href: "/admin/appointments", icon: Calendar },
    { title: "Settings", href: "/admin/settings", icon: Settings },
  ],
  DOCTOR: [
    { title: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
    { title: "My Appointments", href: "/doctor/appointments", icon: Calendar },
    { title: "Patients", href: "/doctor/patients", icon: UserRound },
    { title: "Reports", href: "/doctor/reports", icon: FileText },
  ],
  PATIENT: [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    {
      title: "Book Appointment",
      href: "/dashboard/book-appointments",
      icon: Calendar,
    },
    { title: "My Health Record", href: "/dashboard/records", icon: Activity },
    { title: "Profile", href: "/profile", icon: UserRound },
  ],
};
