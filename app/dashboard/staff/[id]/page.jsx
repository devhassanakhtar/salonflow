"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Edit3,
  Mail,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { getStaffMember } from "../../../../lib/api";
export default function StaffDetailsPage() {
  const params = useParams();
  const id = params.id;
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadStaff() {
      try {
        setLoading(true);
        const response = await getStaffMember(id);
        setStaff(response?.data || response);
      } catch (error) {
        console.error("STAFF DETAILS ERROR:", error);
        toast.error(error?.message || "Failed to load staff details.");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadStaff();
    }
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-500">Loading staff details...</p>
          </div>
        </div>
      </div>
    );
  }
  if (!staff) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/staff"
            className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} /> Back to Staff
          </Link>
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <h1 className="text-base font-semibold text-slate-900">
              Staff not found
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              The staff member you are looking for does not exist.
            </p>
          </div>
        </div>
      </div>
    );
  }
  function statusClasses(status) {
    if (status === "available") {
      return "bg-emerald-50 text-emerald-700";
    }
    if (status === "busy") {
      return "bg-amber-50 text-amber-700";
    }
    return "bg-slate-100 text-slate-500";
  }
  function statusLabel(status) {
    return status?.replace("_", " ") || "Unknown";
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/staff"
            className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} /> Back to Staff
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-600">
                Staff Management
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Staff Details
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View staff member information and profile details.
              </p>
            </div>
            <Link
              href={`/dashboard/staff/${staff.id}/edit`}
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Edit3 size={16} /> Edit Staff
            </Link>
          </div>
        </div>
        {/* Profile */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <UserRound size={28} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {staff.name}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses(staff.status)}`}
                  >
                    {statusLabel(staff.status)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500 capitalize">
                  {staff.role}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-slate-600 sm:items-end">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400" />
                <span>{staff.phone || "No phone number"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-slate-400" />
                <span className="break-all">
                  {staff.email || "No email address"}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Main Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Staff Information */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm lg:col-span-2">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Staff Information
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Basic information about this staff member
              </p>
            </div>
            <div className="grid gap-5 p-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <UserRound size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400"> Full Name </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {staff.name || "-"}
                  </p>
                </div>
              </div>
              {/* Role */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Scissors size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400"> Role </p>
                  <p className="mt-0.5 text-sm font-medium capitalize text-slate-700">
                    {staff.role || "-"}
                  </p>
                </div>
              </div>
              {/* Specialization */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Scissors size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Specialization</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {staff.specialization || "-"}
                  </p>
                </div>
              </div>
              {/* Status */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400"> Status </p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses(staff.status)}`}
                  >
                    {statusLabel(staff.status)}
                  </span>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs text-slate-400"> Phone </p>
                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {staff.phone || "-"}
                  </p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Mail size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400"> Email </p>
                  <p className="mt-0.5 break-all text-sm font-medium text-slate-700">
                    {staff.email || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Account Details */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Account Details
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Staff account information
              </p>
            </div>
            <div className="space-y-5 p-5">
              {/* Staff ID */}
              <div>
                <p className="text-xs text-slate-400"> Staff ID </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  #{staff.id}
                </p>
              </div>
              {/* Role */}
              <div>
                <p className="text-xs text-slate-400"> Role </p>
                <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                  {staff.role || "-"}
                </p>
              </div>
              {/* Status */}
              <div>
                <p className="text-xs text-slate-400"> Current Status </p>
                <span
                  className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses(staff.status)}`}
                >
                  {statusLabel(staff.status)}
                </span>
              </div>
              {/* Joined */}
              <div>
                <p className="text-xs text-slate-400"> Joined </p>
                <p className="mt-1 text-sm font-medium text-slate-700">
                  {staff.created_at
                    ? new Date(staff.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
