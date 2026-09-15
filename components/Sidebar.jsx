"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  ListOrdered,
  Scissors,
  UserRoundCog,
  Settings,
  Bell,
  LogOut,
  ChevronRight,
  X,
  User,
  ChevronUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { ROLE_ALLOWED_ROUTES } from "../lib/permissions";
import { getMe, logout } from "../lib/api";

const ALL_MENU_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    href: "/dashboard/appointments",
    icon: CalendarDays,
  },
  {
    label: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    label: "Queue",
    href: "/dashboard/queue",
    icon: ListOrdered,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: "Services",
    href: "/dashboard/services",
    icon: Scissors,
  },
  {
    label: "Staff",
    href: "/dashboard/staff",
    icon: UserRoundCog,
  },
];

const generalItems = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAuth();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const allowedRoutes = ROLE_ALLOWED_ROUTES[role] || [];

  const menuItems = ALL_MENU_ITEMS.filter((item) =>
    allowedRoutes.includes(item.href),
  );

  const visibleGeneralItems = generalItems.filter((item) =>
    allowedRoutes.includes(item.href),
  );

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await getMe();

      const userData = response?.data || response;

      setUser(userData);
    } catch (error) {
      console.error(error);
    }
  };

  function isActive(href) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(href);
  }

  function handleNavigation() {
    if (onClose) {
      onClose();
    }

    setProfileOpen(false);
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");

      if (onClose) {
        onClose();
      }

      router.push("/login");
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[245px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/dashboard"
            onClick={handleNavigation}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
              <Scissors size={18} />
            </div>

            <div>
              <h1 className="text-[17px] font-bold tracking-tight text-slate-900">
                SalonFlow
              </h1>

              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {role
                  ? `${role.charAt(0).toUpperCase()}${role.slice(1)} Portal`
                  : "Portal"}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={19} />
          </button>
        </div>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-7">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Main Menu
            </p>

            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleNavigation}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.2 : 1.8}
                      className={
                        active
                          ? "text-emerald-600"
                          : "text-slate-400 group-hover:text-slate-600"
                      }
                    />

                    <span className="flex-1">{item.label}</span>

                    {active && (
                      <ChevronRight size={14} className="text-emerald-500" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* General */}
          {visibleGeneralItems.length > 0 && (
            <div>
              <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                General
              </p>

              <nav className="space-y-1">
                {visibleGeneralItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavigation}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <Icon
                        size={18}
                        strokeWidth={active ? 2.2 : 1.8}
                        className={
                          active
                            ? "text-emerald-600"
                            : "text-slate-400 group-hover:text-slate-600"
                        }
                      />

                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="relative shrink-0 border-t border-slate-100 p-4">
          {/* Dropup */}
          {profileOpen && (
            <div className="absolute bottom-[78px] left-4 right-4 z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left text-sm text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={17} />

                <span>Logout</span>
              </button>
            </div>
          )}

          {/* User Button */}
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition hover:bg-slate-50"
          >
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-sm font-semibold text-emerald-700">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name || "Loading..."}
              </p>

              <p className="truncate text-xs text-slate-400">
                {user?.email || ""}
              </p>
            </div>

            <ChevronUp
              size={17}
              className={`shrink-0 text-slate-400 transition-transform ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
