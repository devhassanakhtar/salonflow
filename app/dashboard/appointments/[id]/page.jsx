"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Scissors,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Edit3,
  Trash2,
  MessageSquare,
} from "lucide-react";

const appointment = {
  id: "APT-1024",
  status: "Confirmed",

  customer: {
    name: "Ahmed Khan",
    phone: "+92 300 1234567",
    email: "ahmed.khan@example.com",
    initials: "AK",
  },

  service: {
    name: "Haircut",
    duration: "45 min",
    price: "$20",
    category: "Hair",
  },

  staff: {
    name: "Usman Ali",
    role: "Hair Stylist",
    initials: "UA",
  },

  date: "September 10, 2026",
  time: "09:30 AM",
  endTime: "10:15 AM",

  notes:
    "Customer prefers a short haircut with a clean finish.",

  createdAt: "September 8, 2026",
};

const previousAppointments = [
  {
    date: "August 22, 2026",
    service: "Haircut",
    staff: "Usman Ali",
    status: "Completed",
    price: "$20",
  },
  {
    date: "July 18, 2026",
    service: "Beard Trim",
    staff: "Bilal Ahmed",
    status: "Completed",
    price: "$15",
  },
  {
    date: "June 12, 2026",
    service: "Hair Styling",
    staff: "Usman Ali",
    status: "Completed",
    price: "$25",
  },
];

export default function AppointmentDetailsPage() {
  const params = useParams();

  const appointmentId = params?.id || "1024";

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
                Appointment #{appointmentId}
              </p>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                {appointment.status}
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

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <Edit3 size={15} />
              Edit
            </button>

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-medium text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={15} />
              Delete
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            >
              <MoreHorizontal size={18} />
            </button>

          </div>

        </div>

      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">

        {/* LEFT */}
        <div className="space-y-6">

          {/* Appointment Overview */}
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
                  {appointment.date}
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
                  {appointment.time}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Ends at {appointment.endTime}
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
                  {appointment.service.duration}
                </p>
              </div>

            </div>

          </section>

          {/* Customer */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-emerald-600">
                  Customer
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Customer Information
                </h2>
              </div>

              <button
                type="button"
                className="hidden items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 sm:flex"
              >
                View Customer
                <ArrowLeft
                  size={13}
                  className="rotate-180"
                />
              </button>

            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-lg font-semibold text-emerald-700">
                {appointment.customer.initials}
              </div>

              <div className="min-w-0 flex-1">

                <h3 className="text-lg font-semibold text-slate-900">
                  {appointment.customer.name}
                </h3>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-5">

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Phone size={13} />
                    {appointment.customer.phone}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Mail size={13} />
                    {appointment.customer.email}
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
                  {appointment.service.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">

                  <span className="text-xs text-slate-400">
                    {appointment.service.category}
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {appointment.service.price}
                  </span>

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
                    {appointment.staff.initials}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {appointment.staff.name}
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      {appointment.staff.role}
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* Notes */}
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

          {/* Previous Appointments */}
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-100 p-5 md:p-6">

              <p className="text-xs font-medium text-emerald-600">
                Customer History
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Previous Appointments
              </h2>

            </div>

            <div className="divide-y divide-slate-100">

              {previousAppointments.map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                        <CalendarDays size={15} />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {item.service}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {item.date} · {item.staff}
                        </p>
                      </div>

                    </div>

                    <div className="flex items-center gap-4 pl-12 sm:pl-0">

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                        {item.status}
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {item.price}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>

        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">

          {/* Status Card */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="bg-emerald-700 p-5 text-white">

              <p className="text-xs text-emerald-100">
                Appointment Status
              </p>

              <div className="mt-2 flex items-center gap-2">

                <CheckCircle2 size={19} />

                <h2 className="text-lg font-semibold">
                  {appointment.status}
                </h2>

              </div>

              <p className="mt-2 text-xs leading-5 text-emerald-100">
                This appointment is confirmed and scheduled.
              </p>

            </div>

            <div className="p-5">

              <button
                type="button"
                className="mb-2.5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                <CheckCircle2 size={16} />
                Mark as Completed
              </button>

              <button
                type="button"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <XCircle size={16} />
                Cancel Appointment
              </button>

            </div>

          </section>

          {/* Quick Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <h2 className="text-sm font-semibold text-slate-900">
              Quick Details
            </h2>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <CalendarDays size={14} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Date
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {appointment.date}
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Clock3 size={14} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Time
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {appointment.time}
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <UserRound size={14} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Staff
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {appointment.staff.name}
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Scissors size={14} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Service
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {appointment.service.name}
                  </p>
                </div>

              </div>

            </div>

          </section>

          {/* Created Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <MapPin size={15} />
              </div>

              <div>

                <p className="text-xs font-semibold text-slate-700">
                  SalonFlow
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Appointment created on{" "}
                  {appointment.createdAt}.
                </p>

              </div>

            </div>

          </section>

        </aside>

      </div>

    </div>
  );
}