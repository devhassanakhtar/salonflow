"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  Clock,
  MoreHorizontal,
  Play,
  Plus,
  UserRound,
  X,
} from "lucide-react";

const initialQueue = [
  {
    id: 1,
    token: "Q-001",
    customer: "Ahmed Khan",
    service: "Haircut",
    staff: "Usman Ali",
    status: "Waiting",
    time: "10:15 AM",
  },
  {
    id: 2,
    token: "Q-002",
    customer: "Bilal Ahmed",
    service: "Beard Trim",
    staff: "Bilal Ahmed",
    status: "Called",
    time: "10:20 AM",
  },
  {
    id: 3,
    token: "Q-003",
    customer: "Hassan Raza",
    service: "Hair Styling",
    staff: "Usman Ali",
    status: "In Progress",
    time: "10:25 AM",
  },
  {
    id: 4,
    token: "Q-004",
    customer: "Ali Hassan",
    service: "Haircut",
    staff: "Bilal Ahmed",
    status: "Completed",
    time: "10:30 AM",
  },
];

const statusStyles = {
  Waiting: "bg-amber-50 text-amber-700",
  Called: "bg-blue-50 text-blue-700",
  "In Progress": "bg-emerald-50 text-emerald-700",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-50 text-red-600",
};

export default function QueuePage() {
  const [queue, setQueue] = useState(initialQueue);
  const [filter, setFilter] = useState("All");

  const updateStatus = (id, status) => {
    setQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const callNext = () => {
    const next = queue.find((item) => item.status === "Waiting");

    if (!next) return;

    updateStatus(next.id, "Called");
  };

  const filteredQueue =
    filter === "All"
      ? queue
      : queue.filter((item) => item.status === filter);

  const stats = [
    {
      label: "Waiting",
      value: queue.filter((q) => q.status === "Waiting").length,
      icon: Clock,
    },
    {
      label: "Called",
      value: queue.filter((q) => q.status === "Called").length,
      icon: Bell,
    },
    {
      label: "In Progress",
      value: queue.filter((q) => q.status === "In Progress").length,
      icon: Play,
    },
    {
      label: "Completed",
      value: queue.filter((q) => q.status === "Completed").length,
      icon: Check,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Queue
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage today&apos;s customer queue
            </p>
          </div>

          <button
            onClick={callNext}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Bell size={17} />
            Call Next
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                    <Icon size={17} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Queue Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

          {/* Card Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Today&apos;s Queue
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {queue.length} customers in queue
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 px-5 py-3">
            {["All", "Waiting", "Called", "In Progress", "Completed"].map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    filter === item
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Token
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Customer
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Service
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Staff
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
                {filteredQueue.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    {/* Token */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-slate-900">
                        {item.token}
                      </span>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                          <UserRound size={15} />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {item.customer}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.time}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Service */}
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {item.service}
                    </td>

                    {/* Staff */}
                    <td className="px-5 py-4">
                      <select
                        value={item.staff}
                        onChange={(e) => {
                          setQueue((prev) =>
                            prev.map((q) =>
                              q.id === item.id
                                ? { ...q, staff: e.target.value }
                                : q
                            )
                          );
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600 outline-none focus:border-emerald-500"
                      >
                        <option>Usman Ali</option>
                        <option>Bilal Ahmed</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[item.status]
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        {item.status === "Called" && (
                          <button
                            onClick={() =>
                              updateStatus(item.id, "In Progress")
                            }
                            className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                          >
                            Start
                          </button>
                        )}

                        {item.status === "In Progress" && (
                          <button
                            onClick={() =>
                              updateStatus(item.id, "Completed")
                            }
                            className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                          >
                            Complete
                          </button>
                        )}

                        {item.status === "Waiting" && (
                          <button
                            onClick={() =>
                              updateStatus(item.id, "Called")
                            }
                            className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                          >
                            Call
                          </button>
                        )}

                        {(item.status === "Waiting" ||
                          item.status === "Called") && (
                          <button
                            onClick={() =>
                              updateStatus(item.id, "Cancelled")
                            }
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        )}

                        {item.status === "Completed" && (
                          <MoreHorizontal
                            size={18}
                            className="text-slate-300"
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredQueue.map((item) => (
              <div key={item.id} className="p-4">

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <UserRound size={16} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.customer}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.token} • {item.time}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Service</p>
                    <p className="mt-0.5 text-sm text-slate-700">
                      {item.service}
                    </p>
                  </div>

                  <div>
                    <p className="text-right text-xs text-slate-400">
                      Staff
                    </p>

                    <select
                      value={item.staff}
                      onChange={(e) => {
                        setQueue((prev) =>
                          prev.map((q) =>
                            q.id === item.id
                              ? { ...q, staff: e.target.value }
                              : q
                          )
                        );
                      }}
                      className="mt-0.5 rounded-lg border-0 bg-transparent text-right text-sm text-slate-700 outline-none"
                    >
                      <option>Usman Ali</option>
                      <option>Bilal Ahmed</option>
                    </select>
                  </div>
                </div>

                {/* Mobile Actions */}
                <div className="mt-4 flex gap-2">
                  {item.status === "Waiting" && (
                    <button
                      onClick={() =>
                        updateStatus(item.id, "Called")
                      }
                      className="flex-1 rounded-lg bg-blue-50 py-2 text-xs font-medium text-blue-700"
                    >
                      Call Customer
                    </button>
                  )}

                  {item.status === "Called" && (
                    <button
                      onClick={() =>
                        updateStatus(item.id, "In Progress")
                      }
                      className="flex-1 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-700"
                    >
                      Start Service
                    </button>
                  )}

                  {item.status === "In Progress" && (
                    <button
                      onClick={() =>
                        updateStatus(item.id, "Completed")
                      }
                      className="flex-1 rounded-lg bg-emerald-50 py-2 text-xs font-medium text-emerald-700"
                    >
                      Complete
                    </button>
                  )}

                  {(item.status === "Waiting" ||
                    item.status === "Called") && (
                    <button
                      onClick={() =>
                        updateStatus(item.id, "Cancelled")
                      }
                      className="flex items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredQueue.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Clock size={18} />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No customers found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                There are no customers with this status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}