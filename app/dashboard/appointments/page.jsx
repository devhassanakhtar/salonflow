"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Search,
  Plus,
  CalendarDays,
  Clock3,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  SlidersHorizontal,
  UserRound,
  Scissors,
  Phone,
  X,
  Trash2,
} from "lucide-react";

import {
  getAppointments,
  confirmAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../../../lib/api";

import { useAuth } from "../../../context/AuthContext";

import Pagination from "../../../components/Pagination";

const APPOINTMENTS_PER_PAGE = 10;

const statusFilters = ["All", "Confirmed", "Pending", "Completed", "Cancelled"];

function getInitials(name) {
  if (!name) {
    return "";
  }

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(timeStr) {
  if (!timeStr) {
    return "Not provided";
  }

  const [hour, minute] = timeStr.split(":");

  const h = parseInt(hour, 10);

  const suffix = h >= 12 ? "PM" : "AM";

  const displayHour = h % 12 === 0 ? 12 : h % 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function formatDate(dateStr) {
  if (!dateStr) {
    return "Not provided";
  }

  const date = new Date(dateStr + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(str) {
  if (!str) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-100",

    Pending: "bg-amber-50 text-amber-700 border-amber-100",

    Completed: "bg-blue-50 text-blue-700 border-blue-100",

    Cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  const icons = {
    Confirmed: CheckCircle2,
    Pending: Clock3,
    Completed: CheckCircle2,
    Cancelled: XCircle,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
        styles[status] || "bg-slate-50 text-slate-600 border-slate-100"
      }`}
    >
      <Icon size={12} />
      {status || "Unknown"}
    </span>
  );
}

export default function AppointmentsPage() {
  const { user, role } = useAuth();

  const [appointments, setAppointments] = useState([]);

  const [totalAppointments, setTotalAppointments] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [confirmedAppointments, setConfirmedAppointments] = useState(0);
  const [pendingAppointments, setPendingAppointments] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  async function loadAppointmentStats() {
    try {
      const all = await getAppointments("?per_page=1");
      const confirmed = await getAppointments("?per_page=1&status=confirmed");
      const pending = await getAppointments("?per_page=1&status=pending");
      const completed = await getAppointments("?per_page=1&status=completed");
      setTotalAppointments(all.meta.total);
      setConfirmedAppointments(confirmed.meta.total);
      setPendingAppointments(pending.meta.total);
      setCompletedAppointments(completed.meta.total);
    } catch (error) {
      console.log("Stats Error:", error);
    }
  }

  /*
   * Get appointments from API
   */
  useEffect(() => {
    async function loadAppointments() {
      try {
        setIsLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set("per_page", APPOINTMENTS_PER_PAGE);

        params.set("page", currentPage);

        /*
         * Search
         */
        if (search.trim()) {
          params.set("q", search.trim());
        }

        /*
         * Status
         */
        if (status !== "All") {
          params.set("status", status.toLowerCase());
        }

        const response = await getAppointments(`?${params.toString()}`);

        console.log("APPOINTMENTS RESPONSE:", response);

        let appointmentList = Array.isArray(response?.data)
          ? response.data
          : [];

        /*
         * Staff users should only see
         * their own appointments.
         */
        if (role === "staff" && user) {
          appointmentList = appointmentList.filter(
            (appointment) => appointment.staff?.id === user.staff_id,
          );
        }

        /*
         * Convert API data into simple
         * data for our UI.
         */
        const mappedAppointments = appointmentList.map((appointment) => ({
          id: appointment.id,

          customer: appointment.customer?.name || "Unknown Customer",

          phone: appointment.customer?.phone || "Not provided",

          service: appointment.service?.name || "Unknown Service",

          duration: appointment.service?.duration_minutes
            ? `${appointment.service.duration_minutes} mins`
            : "Not provided",

          staff: appointment.staff?.name || "Not assigned",

          date: formatDate(appointment.appointment_date),

          time: formatTime(appointment.appointment_time),

          status: capitalize(appointment.status),
        }));

        setAppointments(mappedAppointments);

        setTotalPages(Number(response?.meta?.last_page) || 1);
      } catch (err) {
        console.error("APPOINTMENTS ERROR:", err);

        setError(err?.message || "Failed to load appointments.");

        setAppointments([]);

        setTotalAppointments(0);

        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    }

    if (role) {
      loadAppointments();
      loadAppointmentStats();
    }
  }, [role, user, search, status, currentPage]);

  /*
   * Search
   */
  function handleSearch(value) {
    setSearch(value);

    setCurrentPage(1);

    setOpenMenu(null);
  }

  /*
   * Status
   */
  function handleStatusChange(value) {
    setStatus(value);

    setCurrentPage(1);

    setOpenMenu(null);
  }

  /*
   * Pagination
   */
  function handlePageChange(page) {
    setCurrentPage(page);

    setOpenMenu(null);
  }

  /*
   * Confirm appointment
   */
  async function handleConfirm(id) {
    try {
      setActionLoadingId(id);

      await confirmAppointment(id);

      /*
       * Update current appointment
       * immediately in UI.
       */
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "Confirmed",
              }
            : appointment,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("CONFIRM APPOINTMENT ERROR:", err);

      alert(err?.message || "Failed to confirm appointment.");
    } finally {
      setActionLoadingId(null);
    }
  }

  /*
   * Cancel appointment
   */
  async function handleCancel(id) {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setActionLoadingId(id);

      await cancelAppointment(id);

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? {
                ...appointment,
                status: "Cancelled",
              }
            : appointment,
        ),
      );

      setOpenMenu(null);
    } catch (err) {
      console.error("CANCEL APPOINTMENT ERROR:", err);

      alert(err?.message || "Failed to cancel appointment.");
    } finally {
      setActionLoadingId(null);
    }
  }

  /*
   * Delete appointment
   */
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this appointment?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setActionLoadingId(id);

      await deleteAppointment(id);

      /*
       * Remove appointment from UI.
       */
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id),
      );

      /*
       * Update total.
       */
      setTotalAppointments((prev) => Math.max(prev - 1, 0));

      setOpenMenu(null);
    } catch (err) {
      console.error("DELETE APPOINTMENT ERROR:", err);

      alert(err?.message || "Failed to delete appointment.");
    } finally {
      setActionLoadingId(null);
    }
  }

  /*
   * Clear filters
   */
  function clearFilters() {
    setSearch("");

    setStatus("All");

    setCurrentPage(1);
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">
            Appointment Management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
            Appointments
          </h1>

          <p className="mt-1.5 text-sm text-slate-400">
            Manage your salon schedule and appointments.
          </p>
        </div>

        {role !== "staff" && (
          <Link
            href="/dashboard/appointments/new"
            className="flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800"
          >
            <Plus size={17} />
            New Appointment
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {/* Total */}
        <div className="rounded-2xl border border-emerald-700 bg-emerald-700 p-4 text-white shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <CalendarDays size={18} />
            </div>
          </div>

          <p className="text-xs text-white/70">Total Appointments</p>

          <p className="mt-1 text-2xl font-semibold md:text-3xl">
            {totalAppointments}
          </p>
        </div>

        {/* Confirmed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>

            <span className="text-xs text-emerald-600">Active</span>
          </div>

          <p className="text-xs text-slate-400">Confirmed</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900 md:text-3xl">
            {confirmedAppointments}
          </p>
        </div>

        {/* Pending */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={18} />
            </div>

            <span className="text-xs text-amber-600">Waiting</span>
          </div>

          <p className="text-xs text-slate-400">Pending</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900 md:text-3xl">
            {pendingAppointments}
          </p>
        </div>

        {/* Completed */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={18} />
            </div>

            <span className="text-xs text-blue-600">Finished</span>
          </div>

          <p className="text-xs text-slate-400">Completed</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900 md:text-3xl">
            {completedAppointments}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Search */}
          <div className="relative w-full xl:max-w-md">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search customer, service or staff..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
            />

            {search && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Status Select */}
          <div className="hidden sm:relative">
            <SlidersHorizontal
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm text-slate-600 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 sm:w-[145px]"
            >
              {statusFilters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {/* Status Buttons */}
          <div className="sm:hidden mt-4 flex gap-2 overflow-x-auto pb-1">
            {statusFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleStatusChange(item)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  status === item
                    ? "bg-emerald-700 text-white"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Loading */}
        {isLoading && (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

              <p className="text-sm text-slate-400">Loading appointments...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {!isLoading && error && (
          <div className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Data */}
        {!isLoading && !error && (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70">
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Service
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Staff
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Date & Time
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {appointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="transition hover:bg-slate-50/60"
                    >
                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                            {getInitials(appointment.customer)}
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800">
                              {appointment.customer}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              {appointment.phone}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                            <Scissors size={15} />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {appointment.service}
                            </p>

                            <p className="text-xs text-slate-400">
                              {appointment.duration}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Staff */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                            <UserRound size={14} />
                          </div>

                          <span className="text-sm text-slate-600">
                            {appointment.staff}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {appointment.date}
                        </p>

                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                          <Clock3 size={11} />

                          {appointment.time}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge status={appointment.status} />
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === appointment.id
                                  ? null
                                  : appointment.id,
                              )
                            }
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenu === appointment.id && (
                            <div className="absolute right-0 top-9 z-50 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-lg">
                              {/* View */}
                              <Link
                                href={`/dashboard/appointments/${appointment.id}`}
                                onClick={() => setOpenMenu(null)}
                                className="block w-full rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                              >
                                View Details
                              </Link>

                              {/* Edit */}
                              {role !== "staff" && (
                                <Link
                                  href={`/dashboard/appointments/${appointment.id}/edit`}
                                  onClick={() => setOpenMenu(null)}
                                  className="block w-full rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  Edit
                                </Link>
                              )}

                              {/* Confirm */}
                              {appointment.status === "Pending" && (
                                <button
                                  type="button"
                                  onClick={() => handleConfirm(appointment.id)}
                                  disabled={actionLoadingId === appointment.id}
                                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-emerald-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {actionLoadingId === appointment.id
                                    ? "Confirming..."
                                    : "Confirm"}
                                </button>
                              )}

                              {/* Cancel */}
                              {appointment.status !== "Cancelled" &&
                                appointment.status !== "Completed" && (
                                  <button
                                    type="button"
                                    onClick={() => handleCancel(appointment.id)}
                                    disabled={
                                      actionLoadingId === appointment.id
                                    }
                                    className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-xs text-amber-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {actionLoadingId === appointment.id
                                      ? "Cancelling..."
                                      : "Cancel"}
                                  </button>
                                )}

                              {/* Delete */}
                              {role !== "staff" && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(appointment.id)}
                                  disabled={actionLoadingId === appointment.id}
                                  className="flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <Trash2 size={12} />

                                  {actionLoadingId === appointment.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-slate-100 lg:hidden">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {getInitials(appointment.customer)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {appointment.customer}
                        </p>

                        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
                          <Phone size={11} />

                          {appointment.phone}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={appointment.status} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {/* Service */}
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                        <Scissors size={13} />

                        <span className="text-[10px] uppercase tracking-wide">
                          Service
                        </span>
                      </div>

                      <p className="truncate text-xs font-medium text-slate-700">
                        {appointment.service}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {appointment.duration}
                      </p>
                    </div>

                    {/* Staff */}
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                        <UserRound size={13} />

                        <span className="text-[10px] uppercase tracking-wide">
                          Staff
                        </span>
                      </div>

                      <p className="truncate text-xs font-medium text-slate-700">
                        {appointment.staff}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                        <CalendarDays size={13} />

                        <span className="text-[10px] uppercase tracking-wide">
                          Date
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-700">
                        {appointment.date}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                        <Clock3 size={13} />

                        <span className="text-[10px] uppercase tracking-wide">
                          Time
                        </span>
                      </div>

                      <p className="text-xs font-medium text-slate-700">
                        {appointment.time}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Actions */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      href={`/dashboard/appointments/${appointment.id}`}
                      className="flex flex-1 items-center justify-center rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      View Details
                    </Link>

                    {role !== "staff" && (
                      <Link
                        href={`/dashboard/appointments/${appointment.id}/edit`}
                        className="flex flex-1 items-center justify-center rounded-xl bg-emerald-50 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                      >
                        Edit Appointment
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty */}
            {appointments.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <CalendarDays size={25} />
                </div>

                <h3 className="text-sm font-semibold text-slate-800">
                  No appointments found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  Try changing your search or filters to find appointments.
                </p>

                {(search || status !== "All") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-4 cursor-pointer rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {appointments.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <p className="text-xs text-slate-400">
                  Showing{" "}
                  <span className="font-medium text-slate-600">
                    {(currentPage - 1) * APPOINTMENTS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-600">
                    {Math.min(
                      currentPage * APPOINTMENTS_PER_PAGE,
                      totalAppointments,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-600">
                    {totalAppointments}
                  </span>{" "}
                  appointments
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
