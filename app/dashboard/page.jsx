"use client";

import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import {
  Search,
  Bell,
  CalendarDays,
  Users,
  Clock3,
  Scissors,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MoreHorizontal,
  Plus,
  UserRound,
  Activity,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  getAppointments,
  getCustomers,
  cancelAppointment,
  getDashboardStats,
} from "../..//lib/api";

function formatTime(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const h = parseInt(hour, 10);
  const suffix = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  return `${displayHour}:${minute} ${suffix}`;
}

export default function AdminDashboard() {
  const [statsData, setStatsData] = useState(null);
  const [totalCustomers, setTotalCustomers] = useState(null);
  const [queueData, setqueueData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [allAppointments, setAllAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, role } = useAuth();

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getDashboardStats();
        let queue = res.data.queue;
        let stats = res.data.stats;

        if (role === "staff" && user) {
          queue = queue.filter((item) => item.staff.id === user.staff_id);
        }

        setStatsData(stats);
        setqueueData(queue);

        if (role === "admin") {
          const customersRes = await getCustomers("?per_page=1");
          setTotalCustomers(customersRes.meta.total);
        }
        const appointmentsRes = await getAppointments("?per_page=200");
        let allAppts = appointmentsRes.data;

        if (role === "staff" && user) {
          allAppts = allAppts.filter((a) => a.staff.id === user.staff_id);
        }

        setAllAppointments(allAppts);
        const today = new Date().toLocaleDateString("en-CA");
        setAppointments(allAppts.filter((a) => a.appointment_date === today));
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    if (role) fetchStats();
  }, [role, user]);

  const stats = (() => {
    if (role === "staff") {
      return [
        {
          title: "Waiting",
          value: queueData.filter((q) => q.status === "waiting").length,
          icon: Clock3,
        },
        {
          title: "Called",
          value: queueData.filter((q) => q.status === "called").length,
          icon: Bell,
        },
        {
          title: "Serving",
          value: queueData.filter((q) => q.status === "serving").length,
          icon: Scissors,
        },
        {
          title: "Completed",
          value: queueData.filter((q) => q.status === "completed").length,
          icon: CheckCircle2,
        },
        {
          title: "My Appointments",
          value: appointments.length,
          icon: CalendarDays,
        },
      ];
    }

    if (role === "receptionist") {
      return [
        {
          title: "Appointments",
          value: statsData ? statsData.today_appointments : "-",
          icon: CalendarDays,
        },
        {
          title: "Serving",
          value: statsData ? statsData.serving : "-",
          icon: Scissors,
        },
        {
          title: "Waiting",
          value: statsData ? statsData.waiting : "-",
          icon: Clock3,
        },
        {
          title: "Completed",
          value: statsData ? statsData.completed : "-",
          icon: CheckCircle2,
        },
      ];
    }

    // admin (default)
    return [
      {
        title: "Total Customers",
        value: totalCustomers !== null ? totalCustomers : "-",
        icon: Users,
      },
      {
        title: "Today's Appointments",
        value: statsData ? statsData.today_appointments : "-",
        icon: CalendarDays,
      },
      {
        title: "Waiting",
        value: statsData ? statsData.waiting : "-",
        icon: Clock3,
      },
      {
        title: "Serving",
        value: statsData ? statsData.serving : "-",
        icon: Scissors,
      },
      {
        title: "Completed",
        value: statsData ? statsData.completed : "-",
        icon: CheckCircle2,
      },
      {
        title: "Active Staff",
        value: statsData ? statsData.available_staff : "-",
        icon: Users,
      },
    ];
  })();

  const queueChartData = (() => {
    if (role === "staff") {
      const countByStatus = (status) =>
        queueData.filter((q) => q.status === status).length;

      return [
        { name: "Waiting", value: countByStatus("waiting") },
        { name: "Called", value: countByStatus("called") },
        { name: "Serving", value: countByStatus("serving") },
        { name: "Completed", value: countByStatus("completed") },
      ];
    }

    return statsData
      ? [
          { name: "Waiting", value: statsData.waiting },
          { name: "Serving", value: statsData.serving },
          { name: "Completed", value: statsData.completed },
          { name: "Cancelled", value: statsData.cancelled },
        ]
      : [];
  })();

  const weeklyChartData = (() => {
    const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];
    const now = new Date();
    const todayIndex = now.getDay(); // 0 = Sunday ... 6 = Saturday

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - todayIndex);

    const days = dayLabels.map((label, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateStr = date.toLocaleDateString("en-CA");

      const completedCount = allAppointments.filter(
        (a) => a.appointment_date === dateStr && a.status === "completed",
      ).length;

      return {
        label,
        value: 100,
        count: completedCount,
        isFuture: i > todayIndex,
      };
    });

    const maxCount = Math.max(...days.map((d) => d.count), 1);

    return days.map((d) => ({
      ...d,
      hasData: d.count > 0,
      intensity: d.count / maxCount,
    }));
  })();

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }

  function getFormattedDate() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#f7f8f7] text-slate-900">
      {/* Main */}
      <main>
        {/* Top Header */}

        {/* Dashboard Content */}
        <div className="px-5 py-6 md:px-8 md:py-8">
          {/* Heading */}
          <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-emerald-600">
                {getFormattedDate()}
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
                {getGreeting()}, {user ? user.name.split(" ")[0] : ""}
              </h1>

              <p className="mt-1.5 text-sm text-slate-400">
                Here&apos;s what&apos;s happening at your salon today.
              </p>
            </div>

            {role !== "staff" && (
              <div className="flex gap-2">
                <Link
                  href="/dashboard/appointments/new"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <Plus size={17} />
                  New Appointment
                </Link>

                <Link
                  href="/dashboard/customers/new"
                  className="hidden items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex"
                >
                  <Users size={17} />
                  Add Customer
                </Link>
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              <span>{error}</span>
              <button
                onClick={() => window.location.reload()}
                className="font-medium underline hover:text-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Stats */}
          <div
            className="mb-6 grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 ${
                    index === 0
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                        index === 0 ? "bg-white/10" : "bg-slate-50"
                      }`}
                    >
                      <Icon
                        size={19}
                        className={
                          index === 0 ? "text-white" : "text-slate-500"
                        }
                      />
                    </div>

                    <ArrowUpRight
                      size={17}
                      className={
                        index === 0 ? "text-white/60" : "text-slate-400"
                      }
                    />
                  </div>

                  <p
                    className={`text-sm ${
                      index === 0 ? "text-white/70" : "text-slate-400"
                    }`}
                  >
                    {stat.title}
                  </p>

                  <p className="mt-1 text-3xl font-semibold tracking-tight">
                    {isLoading ? (
                      <span
                        className={`inline-block h-5 w-5 animate-spin rounded-full border-2 ${
                          index === 0
                            ? "border-white/30 border-t-white"
                            : "border-slate-200 border-t-emerald-600"
                        }`}
                      />
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Main Grid */}
          <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
            {/* Appointment Overview */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Today&apos;s Appointments
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Your schedule for today
                  </p>
                </div>

                <Link
                  href="/dashboard/appointments"
                  className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                >
                  View all
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="max-h-[420px] divide-y divide-slate-100 overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center px-5 py-10">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                    </div>
                  ) : appointments.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-slate-400">
                      No appointments today.
                    </p>
                  ) : (
                    appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50/70"
                      >
                        <div className="w-[72px] shrink-0">
                          <p className="text-sm font-semibold text-slate-700">
                            {formatTime(appointment.appointment_time)}
                          </p>
                        </div>

                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                            <UserRound size={16} />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {appointment.customer.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                              {appointment.service.name} ·{" "}
                              {appointment.staff.name}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:inline-flex ${
                            appointment.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-600"
                              : appointment.status === "pending"
                                ? "bg-amber-50 text-amber-600"
                                : appointment.status === "completed"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-red-50 text-red-500"
                          }`}
                        >
                          {appointment.status}
                        </span>

                        <button className="text-slate-300 hover:text-slate-500">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Queue */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Live Queue
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Customers currently waiting
                  </p>
                </div>

                <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <div className="p-4">
                <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1">
                  {isLoading ? (
                    <div className="flex items-center justify-center px-2 py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                    </div>
                  ) : queueData.length === 0 ? (
                    <p className="px-2 py-8 text-center text-sm text-slate-400">
                      No one in queue right now.
                    </p>
                  ) : (
                    queueData.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-slate-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-semibold text-slate-500">
                          {String(item.queue_number).padStart(2, "0")}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {item.customer.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {item.service.name}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${
                            item.status === "waiting"
                              ? "bg-amber-50 text-amber-600"
                              : item.status === "serving"
                                ? "bg-blue-50 text-blue-600"
                                : item.status === "completed"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  href="/dashboard/queue"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Open Queue
                  <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          </div>

          {/* Bottom Grid */}
          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-semibold">Queue Overview</h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Today's queue status breakdown
                </p>
              </div>

              {isLoading ? (
                <div className="flex h-[220px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={queueChartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      allowDecimals={false}
                      width={28}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h2 className="text-base font-semibold">
                  Completed Appointments
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Completed customers this week
                </p>
              </div>

              {isLoading ? (
                <div className="flex h-[220px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={weeklyChartData} barCategoryGap="25%">
                    <defs>
                      <pattern
                        id="diagonalHatch"
                        patternUnits="userSpaceOnUse"
                        width="6"
                        height="6"
                        patternTransform="rotate(45)"
                      >
                        <rect width="6" height="6" fill="#f8fafc" />
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="6"
                          stroke="#cbd5e1"
                          strokeWidth="2"
                        />
                      </pattern>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />

                    <XAxis
                      dataKey="label"
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={{ stroke: "#e2e8f0" }}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      width={28}
                      axisLine={{ stroke: "#e2e8f0" }}
                      tickLine={{ stroke: "#e2e8f0" }}
                      tick={{ fontSize: 12, fill: "#94a3b8" }}
                    />

                    <Tooltip
                      cursor={false}
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const item = payload[0].payload;
                        if (!item.hasData) return null;
                        return (
                          <div className="rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow">
                            {item.count} completed
                          </div>
                        );
                      }}
                    />

                    <Bar
                      dataKey="value"
                      radius={[20, 20, 20, 20]}
                      maxBarSize={50}
                    >
                      {weeklyChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.isFuture || !entry.hasData
                              ? "url(#diagonalHatch)"
                              : entry.intensity >= 0.7
                                ? "#065f46"
                                : entry.intensity >= 0.4
                                  ? "#10b981"
                                  : "#6ee7b7"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
