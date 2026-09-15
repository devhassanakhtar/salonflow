"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit3,
  Mail,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";

const staff = {
  id: 1,
  name: "Usman Ali",
  role: "Stylist",
  phone: "0300 1234567",
  email: "usman@example.com",
  status: "Active",
  joined: "January 12, 2026",
  appointments: 18,
  completed: 14,
  upcoming: 4,
};

const appointments = [
  {
    id: 1,
    customer: "Ahmed Khan",
    service: "Haircut",
    time: "10:30 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    customer: "Bilal Ahmed",
    service: "Hair Styling",
    time: "12:00 PM",
    status: "Confirmed",
  },
  {
    id: 3,
    customer: "Hassan Raza",
    service: "Haircut",
    time: "02:30 PM",
    status: "Completed",
  },
];

export default function StaffDetailsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/staff"
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to Staff
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Staff Details
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View staff member information and activity
              </p>
            </div>

            <Link
              href={`/dashboard/staff/${staff.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Edit3 size={16} />
              Edit Staff
            </Link>
          </div>
        </div>

        {/* Profile */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5">
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

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {staff.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {staff.role}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-slate-600 sm:items-end">
              <div className="flex items-center gap-2">
                <Phone size={15} className="text-slate-400" />
                {staff.phone}
              </div>

              <div className="flex items-center gap-2">
                <Mail size={15} className="text-slate-400" />
                {staff.email}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Appointments
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {staff.appointments}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Completed
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {staff.completed}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500">
              Upcoming
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {staff.upcoming}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Appointments */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white lg:col-span-2">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Recent Appointments
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Appointments assigned to this staff member
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                      <CalendarDays size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {appointment.customer}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {appointment.service}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock3 size={14} />
                      {appointment.time}
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        appointment.status === "Completed"
                          ? "bg-slate-100 text-slate-500"
                          : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="rounded-2xl border border-slate-200 bg-white">

            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Staff Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Basic staff details
              </p>
            </div>

            <div className="space-y-5 p-5">

              {/* Role */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Scissors size={16} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Role
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {staff.role}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {staff.phone}
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">
                    Email
                  </p>

                  <p className="mt-0.5 break-all text-sm font-medium text-slate-700">
                    {staff.email}
                  </p>
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <CalendarDays size={16} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Joined
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {staff.joined}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}