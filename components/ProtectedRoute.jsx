"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isRouteAllowed } from "@/lib/permissions";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!isRouteAllowed(role, pathname)) {
      router.replace("/unauthorized");
      return;
    }

    setChecked(true);
  }, [router, pathname]);

  if (!checked) {
    return <p style={{ padding: 20 }}>Checking access...</p>;
  }

  return children;
}