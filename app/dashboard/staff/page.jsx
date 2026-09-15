"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Edit3,
  MoreHorizontal,
  Plus,
  Trash2,
  UserRound,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Pagination from "../../../components/Pagination";
import { toast } from "sonner";
import { getStaff, updateStaff } from "../../../lib/api";

export default function StaffPage() {
  const [staff, setStaff] = useState([]);

  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [openStatus, setOpenStatus] = useState(null);

  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [status, setStatus] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  async function loadStaff(page = 1) {
    try {
      setLoading(true);

      const response = await getStaff(page);

      setStaff(response?.data || []);
      setCurrentPage(response?.meta?.current_page || page);
      setTotalPages(response?.meta?.last_page || 1);
      setTotalStaff(response?.meta?.total || 0);
    } catch (error) {
      console.error("STAFF ERROR:", error);

      toast.error(
        error?.message || "Failed to load staff."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff(1);
  }, []);

  async function handleStatusChange(member, newStatus) {
    if (member.status === newStatus) {
      setOpenStatus(null);
      return;
    }

    try {
      await updateStaff(member.id, {
        name: member.name,
        role: member.role,
        status: newStatus,
      });

      setStaff((currentStaff) =>
        currentStaff.map((item) =>
          item.id === member.id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setOpenStatus(null);

      const statusText = newStatus.replace("_", " ");

      toast.success(
        `${member.name} is now ${statusText}`
      );
    } catch (error) {
      toast.error(
        error?.message ||
          "Failed to update staff status."
      );
    }
  }

  function statusLabel(status) {
    return status.replace("_", " ");
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

  const filteredStaff = staff.filter((member) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      member.name
        ?.toLowerCase()
        .includes(searchText) ||
      member.email
        ?.toLowerCase()
        .includes(searchText) ||
      member.phone
        ?.toLowerCase()
        .includes(searchText);

    const matchesSpecialization =
      specialization === "all" ||
      member.specialization
        ?.toLowerCase()
        .includes(
          specialization.toLowerCase()
        );

    const matchesStatus =
      status === "all" ||
      member.status === status;

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesStatus
    );
  });

  const activeStaff = staff.filter(
    (member) => member.status === "available"
  ).length;

  const busyStaff = staff.filter(
    (member) => member.status === "busy"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Staff
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your salon staff
            </p>
          </div>

          <Link
            href="/dashboard/staff/new"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={17} />
            Add Staff
          </Link>
        </div>

        {/* Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Total Staff
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {totalStaff}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Available
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {activeStaff}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500">
              Busy
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {busyStaff}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* Card Header */}
          <div className="border-b border-slate-200 px-5 py-4">

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Staff List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Your salon team members
              </p>
            </div>

            {/* Search & Filters */}
            <div className="mt-4 flex flex-col gap-3 lg:flex-row">

              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search staff by name, email or phone..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Specialization */}
              <div className="relative">
                <SlidersHorizontal
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={specialization}
                  onChange={(e) =>
                    setSpecialization(e.target.value)
                  }
                  className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 lg:w-48"
                >
                  <option value="all">
                    All Specializations
                  </option>

                  <option value="Hair Stylist">
                    Hair Stylist
                  </option>

                  <option value="Barber">
                    Barber
                  </option>

                  <option value="Nail Technician">
                    Nail Technician
                  </option>

                  <option value="Facial Specialist">
                    Facial Specialist
                  </option>

                  <option value="Makeup Artist">
                    Makeup Artist
                  </option>
                </select>
              </div>

              {/* Status */}
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-600 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 lg:w-40"
              >
                <option value="all">
                  All Status
                </option>

                <option value="available">
                  Available
                </option>

                <option value="busy">
                  Busy
                </option>

                <option value="off_duty">
                  Off Duty
                </option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="flex flex-col items-center gap-3">

                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

                <p className="text-sm text-slate-400">
                  Loading staff...
                </p>

              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/70">

                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                        Staff Member
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                        Role
                      </th>

                      {/* NEW */}
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                        Specialization
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                        Phone
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-medium text-slate-500">
                        Action
                      </th>

                    </tr>
                  </thead>

                  <tbody>
                    {filteredStaff.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-slate-100 last:border-0"
                      >

                        {/* Staff Member */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <UserRound size={16} />
                            </div>

                            <div>
                              <p className="text-sm font-medium text-slate-800">
                                {member.name}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-400">
                                {member.email}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-600">
                            {member.role}
                          </span>
                        </td>

                        {/* Specialization */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">
                            {member.specialization || "—"}
                          </span>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-600">
                            {member.phone}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <div className="relative">

                            <button
                              type="button"
                              onClick={() =>
                                setOpenStatus(
                                  openStatus === member.id
                                    ? null
                                    : member.id
                                )
                              }
                              className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses(
                                member.status
                              )}`}
                            >
                              {statusLabel(member.status)}
                            </button>

                            {openStatus === member.id && (
                              <div className="absolute left-0 top-9 z-30 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      member,
                                      "available"
                                    )
                                  }
                                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-emerald-600 hover:bg-emerald-50"
                                >
                                  Available
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      member,
                                      "busy"
                                    )
                                  }
                                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-amber-600 hover:bg-amber-50"
                                >
                                  Busy
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleStatusChange(
                                      member,
                                      "off_duty"
                                    )
                                  }
                                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-100"
                                >
                                  Off Duty
                                </button>

                              </div>
                            )}

                          </div>
                        </td>

                        {/* Action */}
                        <td className="px-5 py-4">
                          <div className="relative flex justify-end">

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === member.id
                                    ? null
                                    : member.id
                                )
                              }
                              className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {openMenu === member.id && (
                              <div className="absolute right-0 top-10 z-20 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">

                                <Link
                                  href={`/dashboard/staff/${member.id}`}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  <UserRound size={13} />
                                  View
                                </Link>

                                <Link
                                  href={`/dashboard/staff/${member.id}/edit`}
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  <Edit3 size={13} />
                                  Edit
                                </Link>

                                <button
                                  type="button"
                                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={13} />
                                  Delete
                                </button>

                              </div>
                            )}

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              {/* Mobile */}
              <div className="divide-y divide-slate-100 md:hidden">

                {filteredStaff.map((member) => (
                  <div
                    key={member.id}
                    className="p-4"
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <UserRound size={16} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {member.name}
                          </p>

                          <p className="mt-0.5 text-xs capitalize text-slate-400">
                            {member.role}
                          </p>
                        </div>

                      </div>

                      {/* Status */}
                      <div className="relative">

                        <button
                          type="button"
                          onClick={() =>
                            setOpenStatus(
                              openStatus === member.id
                                ? null
                                : member.id
                            )
                          }
                          className={`cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClasses(
                            member.status
                          )}`}
                        >
                          {statusLabel(member.status)}
                        </button>

                        {openStatus === member.id && (
                          <div className="absolute right-0 top-9 z-30 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  member,
                                  "available"
                                )
                              }
                              className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-emerald-600 hover:bg-emerald-50"
                            >
                              Available
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  member,
                                  "busy"
                                )
                              }
                              className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-amber-600 hover:bg-amber-50"
                            >
                              Busy
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  member,
                                  "off_duty"
                                )
                              }
                              className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-100"
                            >
                              Off Duty
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                    {/* Specialization */}
                    <div className="mt-4">
                      <p className="text-xs text-slate-400">
                        Specialization
                      </p>

                      <p className="mt-0.5 text-sm text-slate-700">
                        {member.specialization || "—"}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="mt-4">
                      <p className="text-xs text-slate-400">
                        Phone
                      </p>

                      <p className="mt-0.5 text-sm text-slate-700">
                        {member.phone}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex justify-end">
                      <div className="relative">

                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === member.id
                                ? null
                                : member.id
                            )
                          }
                          className="cursor-pointer rounded-lg border border-slate-200 p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700"
                        >
                          <MoreHorizontal size={18} />
                        </button>

                        {openMenu === member.id && (
                          <div className="absolute right-0 bottom-10 z-20 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">

                            <Link
                              href={`/dashboard/staff/${member.id}`}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                            >
                              <UserRound size={13} />
                              View
                            </Link>

                            <Link
                              href={`/dashboard/staff/${member.id}/edit`}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                            >
                              <Edit3 size={13} />
                              Edit
                            </Link>

                            <button
                              type="button"
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-red-50"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>

                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                ))}

              </div>

              {/* Empty State */}
              {filteredStaff.length === 0 && (
                <div className="px-5 py-16 text-center">

                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <UserRound size={18} />
                  </div>

                  <p className="mt-3 text-sm font-medium text-slate-700">
                    No staff found
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Try changing your search or filters.
                  </p>

                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">

                <p className="text-xs text-slate-500">
                  Showing page {currentPage} of{" "}
                  {totalPages}
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={loadStaff}
                />

              </div>

            </>
          )}

        </div>

      </div>
    </div>
  );
}
