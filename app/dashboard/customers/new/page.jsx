"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  CheckCircle2,
  X,
} from "lucide-react";

import { createCustomer } from "../../../../lib/api";

export default function NewCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const [apiError, setApiError] = useState("");

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

    setApiError("");
  }

  function validateForm() {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "Please enter the first name.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Please enter the last name.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter the phone number.";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");

      const customerData = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        phone: form.phone.trim(),
        email: form.email.trim() || null,
      };

      const response = await createCustomer(customerData);

      router.push("/dashboard/customers");
    } catch (err) {
      console.error("CREATE CUSTOMER ERROR:", err);

      setApiError(
        err?.message || "Failed to create customer. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    });

    setErrors({});
    setApiError("");
  }

  const initials =
    `${form.firstName?.[0] || ""}${form.lastName?.[0] || ""}`.toUpperCase() ||
    "CU";

  const customerName =
    `${form.firstName} ${form.lastName}`.trim() || "Customer Name";

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* API Error */}
      {apiError && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
            <X size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold">Failed to create customer</p>

            <p className="mt-0.5 text-xs text-red-600">{apiError}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-7">
        <Link
          href="/dashboard/customers"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </Link>

        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">
            Customer Management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
            New Customer
          </h1>

          <p className="mt-1.5 text-sm text-slate-400">
            Create a new customer profile for your salon.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* LEFT SIDE */}
          <div className="space-y-8">
            {/* Personal Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Personal Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Enter the customer's basic information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5">
                {/* First Name */}
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                      errors.firstName
                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  {errors.firstName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                      errors.lastName
                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  {errors.lastName && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                        errors.phone
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="customer@example.com"
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                        errors.email
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
                
                {/* Information */}
                <div className="rounded-xl bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <UserRound size={14} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-emerald-800">
                        Customer Profile
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-emerald-700/70">
                        Customer information can be used when creating
                        appointments and managing salon visits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Summary Header */}
              <div className="border-b border-slate-100 bg-slate-50/70 p-5">
                <p className="text-xs font-medium text-emerald-600">
                  Customer Summary
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Review Details
                </h2>
              </div>

              <div className="p-5">
                {/* Customer Preview */}
                <div className="mb-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Customer
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {customerName}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        New Customer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-7 border-y border-slate-100 py-5">
                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <Phone size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Phone
                      </p>

                      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                        {form.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <Mail size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Email
                      </p>

                      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                        {form.email || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Date of Birth */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <CalendarDays size={14} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Date of Birth
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {form.dateOfBirth
                          ? new Date(
                              `${form.dateOfBirth}T00:00:00`,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-2.5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Create Customer
                      </>
                    )}
                  </button>

                  <Link
                    href="/dashboard/customers"
                    onClick={handleCancel}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                  >
                    <X size={16} />
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
