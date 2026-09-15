"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import { AuthProvider, useAuth } from "../../context/AuthContext";
import { isRouteAllowed } from "../../lib/permissions";

function DashboardGuard({ children }) {
  const { role, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && role && !isRouteAllowed(role, pathname)) {
      router.replace("/dashboard"); 
    }
  }, [isLoading, role, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
      </div>
    );
  }

  if (role && !isRouteAllowed(role, pathname)) {
    return null; 
  }

  return children;
}

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f7f8f7] text-slate-900">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="lg:pl-[245px]">
          <DashboardGuard>{children}</DashboardGuard>
        </main>
      </div>
    </AuthProvider>
  );
}