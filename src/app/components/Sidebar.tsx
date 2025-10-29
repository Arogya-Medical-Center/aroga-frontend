"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  active?: boolean;
};

type Props = {
  user?: {
    name: string;
    role: string;
    avatar?: string;
  };
  navItems?: NavItem[];
  className?: string;
};

export default function Sidebar({ user, navItems, className }: Props) {
  const [open, setOpen] = useState(false);
  const { logout, hasAccess } = useAuth(); // removed unused 'authUser'

  const defaultUser = {
    name: "Dr. Danushka Ranasinghe",
    role: "Medical Officer",
    avatar: "/avatar.jpg", // Replace with actual path
  };

  const defaultNavItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DashboardIcon />,
      href: "/dashboard/admin",
    },
    {
      id: "patients",
      label: "Patients",
      icon: <PatientsIcon />,
      href: "/dashboard/patients",
      active: true,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: <CalendarIcon />,
      href: "/appointments",
    },
    {
      id: "reports",
      label: "Reports",
      icon: <ReportsIcon />,
      href: "/reports",
    },  
    {
      id: "registration",
      label: "Patient Registration",
      icon: <PatientsIcon />,
      href: "/patient-registration",
    },
    {
      id: "profile",
      label: "Patient Profile",
      icon: <DashboardIcon />,
      href: "/patient-profile",
    },
    {
      id: "bmi-calculator",
      label: "BMI Calculator",
      icon: <BMICalculatorIcon />,
      href: "/BMICalculator",
    },
    {
      id: "create-prescription",
      label: "Create Prescription",
      icon: <PrescriptionIcon />,
      href: "/dashboard/create-prescription",
    },
    {
      id: "prescription-assistant",
      label: "Treatment Protocols",
      icon: <PillIcon />,
      href: "/dashboard/prescription-assistant",
    },
    {
      id: "drug-inventory",
      label: "Drug Inventory",
      icon: <PillIcon />,
      href: "/dashboard/drug-inventory",
    },
    {
      id: "appointments-dashboard",
      label: "Appointments",
      icon: <AppointmentsIcon />,
      href: "/appointments",
    },
    {
      id: "prescription",
      label: "Prescription",
      icon: <PrescriptionIcon />,
      href: "/dashboard/prescription",
    },
    {
      id: "appointments-calendar",
      label: "Calendar",
      icon: <CalendarIcon />,
      href: "/calendar",
    },
  ];

  const currentUser = user || defaultUser;

  // Filter nav items based on user role permissions
  const filteredNavItems = (navItems || defaultNavItems).filter((item) =>
    hasAccess(item.href)
  );

  const nav = filteredNavItems;

  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle button */}
      <button
        type="button"
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden fixed left-3 top-3 z-40 inline-flex items-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm shadow-sm"
      >
        <MenuIcon />
        <span className="font-medium">Menu</span>
      </button>

      {/* Sidebar */}
      <aside
        className={[
          "fixed md:static z-30 h-screen top-0 left-0 w-64 transform md:transform-none transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "bg-white border-r border-neutral-300",
          "flex flex-col",
          className || "",
        ].join(" ")}
      >
        {/* Header: Patient Management & Search */}

        {/* User Profile */}
        <div className="px-4 py-5 border-b border-neutral-300">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-200">
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-neutral-600 text-lg font-semibold">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900">
                {currentUser.name}
              </p>
              <p className="text-xs text-neutral-600">{currentUser.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {nav.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={[
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-green-100 text-green-800"
                        : "text-neutral-700 hover:bg-neutral-100",
                    ].join(" ")}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-neutral-300 p-4 space-y-3">
          <Link
            href="/patient-registration"
            className="block text-center w-full rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium text-sm py-2.5 transition-colors"
          >
            New Patient
          </Link>

          <button
            type="button"
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <SettingsIcon />
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <LogOutIcon />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay when drawer is open on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

// Icons
function MenuIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function PatientsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}



function PillIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.59 3.41a5 5 0 0 0-7.07 0L3.41 13.52a5 5 0 0 0 7.07 7.07l10.12-10.12a5 5 0 0 0 0-7.06z" />
      <path d="M8.46 8.46l7.07 7.07" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ReportsIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 3v18h18" />
      <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function BMICalculatorIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <rect x="7" y="5" width="10" height="4" rx="1" />
      <rect x="7" y="11" width="3" height="3" rx="0.5" />
      <rect x="11" y="11" width="3" height="3" rx="0.5" />
      <rect x="15" y="11" width="3" height="3" rx="0.5" />
      <rect x="7" y="16" width="3" height="3" rx="0.5" />
      <rect x="11" y="16" width="3" height="3" rx="0.5" />
      <rect x="15" y="16" width="3" height="3" rx="0.5" />
    </svg>
  );
}

function AppointmentsIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="17" cy="17" r="4" />
      <path d="M17 15v2l1 1" />
    </svg>
  );
}

function PrescriptionIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
