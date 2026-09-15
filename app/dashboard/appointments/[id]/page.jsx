"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Scissors,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Edit3,
  Trash2,
  MessageSquare,
} from "lucide-react";

import {
  getAppointment,
  confirmAppointment,
  cancelAppointment,
  deleteAppointment,
} from "../../../../lib/api";

import ConfirmModal from "../../../../components/ConfirmModal";

function getInitials(name) {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTime(timeStr) {
  if (!timeStr) return "Not provided";

  const [hour, minute] = timeStr.split(":");

  const h = parseInt(hour, 10);

  const suffix = h >= 12 ? "PM" : "AM";

  const displayHour = h % 12 === 0 ? 12 : h % 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "Not provided";

  const date = new Date(dateStr + "T00:00:00");

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function capitalize(str) {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getStatusStyles(status) {
  const styles = {
    Confirmed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Completed: "bg-blue-50 text-blue-700",
    Cancelled: "bg-red-50 text-red-600",
  };

  return styles[status] || "bg-slate-50 text-slate-600";
}

export default function AppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = params?.id;

  const [appointment, setAppointment] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState("");

  const [actionLoading, setActionLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,
  });

  /*
   * Load appointment
   */
  useEffect(() => {
    async function loadAppointment() {
      if (!appointmentId) return;

      try {
        setIsLoading(true);
        setError("");

        const response = await getAppointment(appointmentId);

        console.log("APPOINTMENT DETAILS:", response);

        setAppointment(response?.data || response);
      } catch (err) {
        console.error("APPOINTMENT DETAILS ERROR:", err);

        setError(err?.message || "Failed to load appointment details.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointment();
  }, [appointmentId]);

  /*
   * Cancel appointment
   */
  async function handleCancel() {
    if (!appointmentId) return;

    try {
      setActionLoading(true);

      const response = await cancelAppointment(appointmentId);

      console.log("CANCEL APPOINTMENT:", response);

      setAppointment((prev) => ({
        ...prev,
        status: "cancelled",
      }));

      setConfirmModal({
        open: false,
        type: null,
      });
    } catch (err) {
      console.error("CANCEL APPOINTMENT ERROR:", err);

      setError(err?.message || "Failed to cancel appointment.");
    } finally {
      setActionLoading(false);
    }
  }

  /*
   * Delete appointment
   */
  async function handleDelete() {
    if (!appointmentId) return;

    try {
      setActionLoading(true);

      await deleteAppointment(appointmentId);

      setConfirmModal({
        open: false,
        type: null,
      });

      router.push("/dashboard/appointments");
    } catch (err) {
      console.error("DELETE APPOINTMENT ERROR:", err);

      setError(err?.message || "Failed to delete appointment.");

      setActionLoading(false);
    }
  }

  /*
   * Confirm appointment
   */
  async function handleConfirm() {
    if (!appointmentId) return;

    try {
      setActionLoading(true);

      const response = await confirmAppointment(appointmentId);

      console.log("CONFIRM APPOINTMENT:", response);

      setAppointment((prev) => ({
        ...prev,
        status: "confirmed",
      }));
    } catch (err) {
      console.error("CONFIRM APPOINTMENT ERROR:", err);

      setError(err?.message || "Failed to confirm appointment.");
    } finally {
      setActionLoading(false);
    }
  }

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="text-sm text-slate-400">Loading appointment...</p>
        </div>
      </div>
    );
  }

  /*
   * Error
   */
  if (error && !appointment) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <Link
          href="/dashboard/appointments"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </Link>

        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!appointment) return null;

  const status = capitalize(appointment.status);

  const customer = appointment.customer;

  const service = appointment.service;

  const staff = appointment.staff;

  const isPending = appointment.status === "pending";

  const isCompleted = appointment.status === "completed";

  const isCancelled = appointment.status === "cancelled";

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/dashboard/appointments"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-emerald-600">
                Appointment #{appointment.id}
              </p>

              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${getStatusStyles(
                  status,
                )}`}
              >
                {status}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
              Appointment Details
            </h1>

            <p className="mt-1.5 text-sm text-slate-400">
              View and manage appointment information.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {appointment.status === "pending" && (
              <Link
                href={`/dashboard/appointments/${appointment.id}/edit`}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                <Edit3 size={15} />
                Edit
              </Link>
            )}

            <button
              type="button"
              onClick={() =>
                setConfirmModal({
                  open: true,
                  type: "delete",
                })
              }
              disabled={actionLoading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={15} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* API Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Main */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Schedule */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-600">
                    Appointment Overview
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Schedule Information
                  </h2>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
                  <CalendarDays size={19} />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3">
              {/* Date */}
              <div className="border-b border-slate-100 p-5 sm:border-r lg:border-b-0">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <CalendarDays size={16} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Date
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatDate(appointment.appointment_date)}
                </p>
              </div>

              {/* Time */}
              <div className="border-b border-slate-100 p-5 lg:border-r lg:border-b-0">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Clock3 size={16} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Time
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {formatTime(appointment.appointment_time)}
                </p>
              </div>

              {/* Duration */}
              <div className="p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Clock3 size={16} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Duration
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {service?.duration_minutes
                    ? `${service.duration_minutes} mins`
                    : "Not provided"}
                </p>
              </div>
            </div>
          </section>

          {/* Customer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <p className="text-xs font-medium text-emerald-600">Customer</p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Customer Information
              </h2>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-semibold text-emerald-700">
                {getInitials(customer?.name)}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  {customer?.name || "Unknown Customer"}
                </h3>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Phone size={13} />
                    {customer?.phone || "Not provided"}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Mail size={13} />
                    {customer?.email || "Not provided"}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Service & Staff */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <p className="text-xs font-medium text-emerald-600">
                Appointment Details
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Service & Staff
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Service */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Scissors size={18} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Service
                </p>

                <h3 className="mt-1 text-base font-semibold text-slate-800">
                  {service?.name || "Unknown Service"}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {service?.category?.name || service?.category || "Service"}
                  </span>

                  {service?.price && (
                    <span className="text-sm font-semibold text-slate-800">
                      {service.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Staff */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <UserRound size={18} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Assigned Staff
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-semibold text-emerald-700">
                    {getInitials(staff?.name)}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {staff?.name || "Not assigned"}
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      {staff?.role || "Staff"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          {appointment.notes && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <MessageSquare size={16} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Appointment Notes
                  </h2>

                  <p className="text-xs text-slate-400">
                    Additional information
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-sm leading-6 text-slate-600">
                  {appointment.notes}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* RIGHT */}
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          {/* Status */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-emerald-700 p-5 text-white">
              <p className="text-xs text-emerald-100">Appointment Status</p>

              <div className="mt-2 flex items-center gap-2">
                {isCancelled ? (
                  <XCircle size={19} />
                ) : (
                  <CheckCircle2 size={19} />
                )}

                <h2 className="text-lg font-semibold">{status}</h2>
              </div>

              <p className="mt-2 text-xs leading-5 text-emerald-100">
                {isCancelled
                  ? "This appointment has been cancelled."
                  : isCompleted
                    ? "This appointment has been completed."
                    : "This appointment is scheduled."}
              </p>
            </div>

            <div className="p-5">
              {isPending && (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={actionLoading}
                  className="mb-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 size={16} />

                  {actionLoading ? "Confirming..." : "Confirm Appointment"}
                </button>
              )}

              {!isCompleted && !isCancelled && (
                <button
                  type="button"
                  onClick={() =>
                    setConfirmModal({
                      open: true,
                      type: "cancel",
                    })
                  }
                  disabled={actionLoading}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                >
                  <XCircle size={16} />
                  Cancel Appointment
                </button>
              )}
            </div>
          </section>
        </aside>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmModal.open}
        title={
          confirmModal.type === "delete"
            ? "Delete Appointment?"
            : "Cancel Appointment?"
        }
        message={
          confirmModal.type === "delete"
            ? "Are you sure you want to permanently delete this appointment? This action cannot be undone."
            : "Are you sure you want to cancel this appointment?"
        }
        confirmText={
          confirmModal.type === "delete"
            ? "Delete Appointment"
            : "Cancel Appointment"
        }
        cancelText="Keep Appointment"
        danger={true}
        onCancel={() =>
          setConfirmModal({
            open: false,
            type: null,
          })
        }
        onConfirm={confirmModal.type === "delete" ? handleDelete : handleCancel}
      />
    </div>
  );
}
