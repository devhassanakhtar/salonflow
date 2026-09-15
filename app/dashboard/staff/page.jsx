"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  MoreHorizontal,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";

const initialStaff = [
  {
    id: 1,
    name: "Usman Ali",
    role: "Stylist",
    phone: "0300 1234567",
    status: "Active",
  },
  {
    id: 2,
    name: "Bilal Ahmed",
    role: "Barber",
    phone: "0312 7654321",
    status: "Active",
  },
  {
    id: 3,
    name: "Hamza Khan",
    role: "Stylist",
    phone: "0321 4567890",
    status: "Active",
  },
  {
    id: 4,
    name: "Ahsan Raza",
    role: "Receptionist",
    phone: "0333 9876543",
    status: "Inactive",
  },
];

const roles = ["All", "Stylist", "Barber", "Receptionist"];

export default function StaffPage() {
  const [staff, setStaff] = useState(initialStaff);
  const [role, setRole] = useState("All");

  const filteredStaff =
    role === "All"
      ? staff
      : staff.filter((member) => member.role === role);

  const toggleStatus = (id) => {
    setStaff((prev) =>
      prev.map((member) =>
        member.id === id
          ? {
              ...member,
              status:
                member.status === "Active" ? "Inactive" : "Active",
            }
          : member
      )
    );
  };

  const deleteStaff = (id) => {
    setStaff((prev) => prev.filter((member) => member.id !== id));
  };

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
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={17} />
            Add Staff
          </Link>
        </div>

        {/* Small Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Total Staff
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {staff.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">
              Active
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {staff.filter((member) => member.status === "Active").length}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500">
              Roles
            </p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {new Set(staff.map((member) => member.role)).size}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* Card Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Staff List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Your salon team members
              </p>
            </div>

            {/* Role Filter */}
            <div className="flex gap-1 overflow-x-auto">
              {roles.map((item) => (
                <button
                  key={item}
                  onClick={() => setRole(item)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    role === item
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

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
                    {/* Staff */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                          <UserRound size={16} />
                        </div>

                        <span className="text-sm font-medium text-slate-800">
                          {member.name}
                        </span>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {member.role}
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
                      <button
                        onClick={() => toggleStatus(member.id)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          member.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => deleteStaff(member.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
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
              <div key={member.id} className="p-4">

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                      <UserRound size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {member.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStatus(member.id)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      member.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {member.status}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-slate-400">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm text-slate-700">
                    {member.phone}
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <Edit3 size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteStaff(member.id)}
                    className="flex items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
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
                No staff members match this role.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}