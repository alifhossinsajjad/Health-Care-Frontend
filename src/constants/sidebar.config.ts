import {
  Home,
  LayoutDashboard,
  User,
  Settings,
  Calendar,
  Clock,
  FileText,
  Star,
  Shield,
  Stethoscope,
  Users,
  Hospital,
  CalendarClock,
  CreditCard,
  ClipboardList,
  Activity,
  LucideIcon
} from "lucide-react";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR" | "PATIENT";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return "/admin/dashboard";
    case "DOCTOR":
      return "/doctor/dashboard";
    case "PATIENT":
    default:
      return "/dashboard";
  }
};

export const getCommonNavItems = (role: UserRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);
  return [
    {
      items: [
        { title: "Home", href: "/", icon: Home },
        { title: "Dashboard", href: defaultDashboard, icon: LayoutDashboard },
        { title: "My Profile", href: "/profile", icon: User },
      ],
    },
    {
      title: "Settings",
      items: [
        { title: "Change Password", href: "/change-password", icon: Settings },
      ],
    },
  ];
};

export const doctorNavItems: NavSection[] = [
  {
    title: "Patient Management",
    items: [
      { title: "Appointments", href: "/doctor/dashboard/appointments", icon: Calendar },
      { title: "My Schedules", href: "/doctor/dashboard/my-schedules", icon: Clock },
      { title: "Prescriptions", href: "/doctor/dashboard/prescriptions", icon: FileText },
      { title: "My Reviews", href: "/doctor/dashboard/my-reviews", icon: Star },
    ],
  },
];

export const adminNavItems: NavSection[] = [
  {
    title: "User Management",
    items: [
      { title: "Admins", href: "/admin/dashboard/admins-management", icon: Shield },
      { title: "Doctors", href: "/admin/dashboard/doctors-management", icon: Stethoscope },
      { title: "Patients", href: "/admin/dashboard/patients-management", icon: Users },
    ],
  },
  {
    title: "Hospital Management",
    items: [
      { title: "Appointments", href: "/admin/dashboard/appointments-management", icon: Calendar },
      { title: "Schedules", href: "/admin/dashboard/schedules-management", icon: Clock },
      { title: "Specialties", href: "/admin/dashboard/specialties-management", icon: Hospital },
      { title: "Doctor Schedules", href: "/admin/dashboard/doctor-schedules-management", icon: CalendarClock },
      { title: "Doctor Specialties", href: "/admin/dashboard/doctor-specialties-management", icon: Stethoscope },
      { title: "Payments", href: "/admin/dashboard/payments-management", icon: CreditCard },
      { title: "Prescriptions", href: "/admin/dashboard/prescriptions-management", icon: FileText },
      { title: "Reviews", href: "/admin/dashboard/reviews-management", icon: Star },
    ],
  },
];

export const patientNavItems: NavSection[] = [
  {
    title: "Appointments",
    items: [
      { title: "My Appointments", href: "/dashboard/my-appointments", icon: Calendar },
      { title: "Book Appointment", href: "/dashboard/book-appointments", icon: ClipboardList },
    ],
  },
  {
    title: "Medical Records",
    items: [
      { title: "My Prescriptions", href: "/dashboard/my-prescriptions", icon: FileText },
      { title: "Health Records", href: "/dashboard/health-records", icon: Activity },
    ],
  },
];

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);
  // Split common items to put Dashboard at top and Settings at the bottom
  const topNav = commonNavItems[0];
  const bottomNav = commonNavItems[1];

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [topNav, ...adminNavItems, bottomNav];
    case "DOCTOR":
      return [topNav, ...doctorNavItems, bottomNav];
    case "PATIENT":
    default:
      return [topNav, ...patientNavItems, bottomNav];
  }
};
