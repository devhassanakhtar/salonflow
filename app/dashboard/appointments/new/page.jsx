"use client";

import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Scissors,
  Phone,
  FileText,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

const customers = [
  {
    id: 1,
    name: "Ahmed Khan",
    phone: "+92 300 1234567",
  },
  {
    id: 2,
    name: "Sara Ali",
    phone: "+92 301 7654321",
  },
  {
    id: 3,
    name: "Hamza Malik",
    phone: "+92 302 4567890",
  },
  {
    id: 4,
    name: "Fatima Noor",
    phone: "+92 303 9876543",
  },
  {
    id: 5,
    name: "Areeba Khan",
    phone: "+92 305 8765432",
  },
];

const services = [
  {
    id: 1,
    name: "Haircut",
    duration: "45 min",
    price: "$20",
  },
  {
    id: 2,
    name: "Hair Coloring",
    duration: "90 min",
    price: "$55",
  },
  {
    id: 3,
    name: "Beard Trim",
    duration: "30 min",
    price: "$15",
  },
  {
    id: 4,
    name: "Facial",
    duration: "60 min",
    price: "$35",
  },
  {
    id: 5,
    name: "Hair Styling",
    duration: "45 min",
    price: "$25",
  },
  {
    id: 6,
    name: "Manicure",
    duration: "45 min",
    price: "$30",
  },
];

const staffMembers = [
  {
    id: 1,
    name: "Usman Ali",
    role: "Hair Stylist",
  },
  {
    id: 2,
    name: "Ayesha Malik",
    role: "Hair Colorist",
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    role: "Barber",
  },
  {
    id: 4,
    name: "Sana Khan",
    role: "Beauty Specialist",
  },
];

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
];

export default function NewAppointmentPage() {
  const [form, setForm] = useState({
    customer: "",
    service: "",
    staff: "",
    date: "2026-09-10",
    time: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [created, setCreated] = useState(false);

  const selectedCustomer = customers.find(
    (customer) => String(customer.id) === form.customer
  );

  const selectedService = services.find(
    (service) => String(service.id) === form.service
  );

  const selectedStaff = staffMembers.find(
    (staff) => String(staff.id) === form.staff
  );

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setCreated(false);
  }

  function selectTime(time) {
    setForm((prev) => ({
      ...prev,
      time,
    }));

    if (errors.time) {
      setErrors((prev) => ({
        ...prev,
        time: "",
      }));
    }

    setCreated(false);
  }

  function validateForm() {
    const newErrors = {};

    if (!form.customer) {
      newErrors.customer = "Please select a customer.";
    }

    if (!form.service) {
      newErrors.service = "Please select a service.";
    }

    if (!form.staff) {
      newErrors.staff = "Please select a staff member.";
    }

    if (!form.date) {
      newErrors.date = "Please select a date.";
    }

    if (!form.time) {
      newErrors.time = "Please select an appointment time.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Filhal backend nahi lagaya.
    setCreated(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">

      {/* Success Message */}
      {created && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">

          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Appointment created successfully
            </p>

            <p className="mt-0.5 text-xs text-emerald-600">
              This is currently a demo appointment. Backend integration will be added later.
            </p>
          </div>

        </div>
      )}

      {/* Header */}
      <div className="mb-7">

        <Link
          href="/dashboard/appointments"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Appointments
        </Link>

        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">
            Appointment Management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
            New Appointment
          </h1>

          <p className="mt-1.5 text-sm text-slate-400">
            Schedule a new appointment for your customer.
          </p>
        </div>

      </div>

      {/* Main Layout */}
      <form onSubmit={handleSubmit}>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* Left */}
          <div className="space-y-5">

            {/* Customer */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Customer Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Select the customer for this appointment.
                  </p>
                </div>

              </div>

              <div>

                <label
                  htmlFor="customer"
                  className="mb-2 block text-xs font-medium text-slate-600"
                >
                  Customer
                </label>

                <div className="relative">

                  <select
                    id="customer"
                    name="customer"
                    value={form.customer}
                    onChange={handleChange}
                    className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition ${
                      errors.customer
                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  >
                    <option value="">
                      Select a customer
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name} — {customer.phone}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={17}
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                </div>

                {errors.customer && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.customer}
                  </p>
                )}

                {selectedCustomer && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                      {selectedCustomer.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .slice(0, 2)}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        {selectedCustomer.name}
                      </p>

                      <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                        <Phone size={10} />
                        {selectedCustomer.phone}
                      </p>
                    </div>

                  </div>
                )}

              </div>

            </section>

            {/* Service & Staff */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Scissors size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Service & Staff
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Choose the service and staff member.
                  </p>
                </div>

              </div>

              <div className="grid gap-5 md:grid-cols-2">

                {/* Service */}
                <div>

                  <label
                    htmlFor="service"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Service
                  </label>

                  <div className="relative">

                    <select
                      id="service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition ${
                        errors.service
                          ? "border-red-300"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    >
                      <option value="">
                        Select a service
                      </option>

                      {services.map((service) => (
                        <option
                          key={service.id}
                          value={service.id}
                        >
                          {service.name} — {service.price}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>

                  {errors.service && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.service}
                    </p>
                  )}

                  {selectedService && (
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">

                      <span className="text-xs text-slate-500">
                        Duration
                      </span>

                      <span className="text-xs font-semibold text-slate-700">
                        {selectedService.duration}
                      </span>

                    </div>
                  )}

                </div>

                {/* Staff */}
                <div>

                  <label
                    htmlFor="staff"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Staff Member
                  </label>

                  <div className="relative">

                    <select
                      id="staff"
                      name="staff"
                      value={form.staff}
                      onChange={handleChange}
                      className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition ${
                        errors.staff
                          ? "border-red-300"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    >
                      <option value="">
                        Select staff member
                      </option>

                      {staffMembers.map((staff) => (
                        <option
                          key={staff.id}
                          value={staff.id}
                        >
                          {staff.name} — {staff.role}
                        </option>
                      ))}
                    </select>

                    <ChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                  </div>

                  {errors.staff && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.staff}
                    </p>
                  )}

                </div>

              </div>

            </section>

            {/* Date & Time */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Date & Time
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Choose when the appointment should take place.
                  </p>
                </div>

              </div>

              {/* Date */}
              <div className="mb-5">

                <label
                  htmlFor="date"
                  className="mb-2 block text-xs font-medium text-slate-600"
                >
                  Appointment Date
                </label>

                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition md:max-w-sm ${
                    errors.date
                      ? "border-red-300"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  }`}
                />

                {errors.date && (
                  <p className="mt-1.5 text-xs text-red-500">
                    {errors.date}
                  </p>
                )}

              </div>

              {/* Time */}
              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="block text-xs font-medium text-slate-600">
                    Available Time
                  </label>

                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock3 size={12} />
                    Select a time
                  </span>

                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">

                  {timeSlots.map((time) => {

                    const active = form.time === time;

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() =>
                          selectTime(time)
                        }
                        className={`rounded-xl border px-3 py-2.5 text-xs font-medium transition ${
                          active
                            ? "border-emerald-700 bg-emerald-700 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}

                </div>

                {errors.time && (
                  <p className="mt-2 text-xs text-red-500">
                    {errors.time}
                  </p>
                )}

              </div>

            </section>

            {/* Notes */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-5 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
                  <FileText size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Additional Notes
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Add any special instructions or notes.
                  </p>
                </div>

              </div>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Write any notes about this appointment..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <p className="mt-2 text-[11px] text-slate-400">
                Optional
              </p>

            </section>

          </div>

          {/* Right Summary */}
          <div className="xl:sticky xl:top-24 xl:self-start">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Summary Header */}
              <div className="border-b border-slate-100 bg-slate-50/70 p-5">

                <p className="text-xs font-medium text-emerald-600">
                  Appointment Summary
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Review Details
                </h2>

              </div>

              <div className="p-5">

                {/* Customer */}
                <div className="mb-5">

                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </p>

                  {selectedCustomer ? (
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                        {selectedCustomer.name
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {selectedCustomer.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {selectedCustomer.phone}
                        </p>
                      </div>

                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      No customer selected
                    </p>
                  )}

                </div>

                {/* Details */}
                <div className="space-y-4 border-t border-slate-100 pt-5">

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <Scissors size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Service
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {selectedService?.name ||
                          "Not selected"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <UserRound size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Staff
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {selectedStaff?.name ||
                          "Not selected"}
                      </p>

                      {selectedStaff && (
                        <p className="text-[11px] text-slate-400">
                          {selectedStaff.role}
                        </p>
                      )}
                    </div>

                  </div>

                  <div className="flex items-start gap-3">

                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <CalendarDays size={14} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Date
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {form.date
                          ? new Date(
                              `${form.date}T00:00:00`
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Not selected"}
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
                        {form.time ||
                          "Not selected"}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Price */}
                {selectedService && (
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 p-4">

                    <div>
                      <p className="text-xs text-emerald-600">
                        Service Price
                      </p>

                      <p className="mt-0.5 text-lg font-semibold text-emerald-800">
                        {selectedService.price}
                      </p>
                    </div>

                    <Scissors
                      size={22}
                      className="text-emerald-500"
                    />

                  </div>
                )}

                {/* Buttons */}
                <div className="mt-6 space-y-2.5">

                  <button
                    type="submit"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99]"
                  >
                    <CheckCircle2 size={17} />
                    Create Appointment
                  </button>

                  <Link
                    href="/dashboard/appointments"
                    className="flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
}