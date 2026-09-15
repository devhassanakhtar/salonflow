"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  UserRound,
  Phone,
  Mail,
  CheckCircle2,
  X,
  BriefcaseBusiness,
  ShieldCheck,
  LockKeyhole,
} from "lucide-react";

import { createStaff } from "../../../../lib/api";

export default function NewStaffPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    specialization: "",
    status: "available",
    password: "",
    password_confirmation: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter the full name.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter the phone number.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Please enter the email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.specialization.trim()) {
      newErrors.specialization = "Please enter the specialization.";
    }

    if (!form.password) {
      newErrors.password = "Please enter a password.";
    }

    if (!form.password_confirmation) {
      newErrors.password_confirmation =
        "Please confirm the password.";
    } else if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
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

      await createStaff(form);

      toast.success("Staff created successfully");

      router.push("/dashboard/staff");
    } catch (err) {
      console.error("CREATE STAFF ERROR:", err);

      toast.error(
        err?.message || "Failed to create staff. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const initials =
    form.name
      ?.split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "ST";

  const staffName = form.name.trim() || "Staff Name";

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/dashboard/staff"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Staff
        </Link>

        <p className="mb-1 text-sm font-medium text-emerald-600">
          Staff Management
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
          New Staff
        </h1>

        <p className="mt-1.5 text-sm text-slate-400">
          Create a new staff profile for your salon.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* LEFT */}
          <div>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              {/* Section Header */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <UserRound size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Staff Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Enter the staff member's basic information.
                  </p>
                </div>
              </div>

              <div className="grid gap-5">

                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Full Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                      errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.name}
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
                    <span className="ml-1 text-red-500">*</span>
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
                    <span className="ml-1 text-red-500">*</span>
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
                      placeholder="staff@example.com"
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

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Role
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="staff">Staff</option>
                    <option value="receptionist">Receptionist</option>
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label
                    htmlFor="specialization"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Specialization
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <BriefcaseBusiness
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={form.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Hair Stylist"
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                        errors.specialization
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {errors.specialization && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.specialization}
                    </p>
                  )}
                </div>

                {/* Status */}
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="off_duty">Off Duty</option>
                  </select>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Password
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                        errors.password
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="password_confirmation"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Confirm Password
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="password_confirmation"
                      name="password_confirmation"
                      type="password"
                      value={form.password_confirmation}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      className={`h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 ${
                        errors.password_confirmation
                          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    />
                  </div>

                  {errors.password_confirmation && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.password_confirmation}
                    </p>
                  )}
                </div>

                {/* Information */}
                <div className="rounded-xl bg-emerald-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <ShieldCheck size={14} />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-emerald-800">
                        Staff Account
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-emerald-700/70">
                        The staff member will use these login details
                        to access the salon system according to their
                        assigned role.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Summary Header */}
              <div className="border-b border-slate-100 bg-slate-50/70 p-5">
                <p className="text-xs font-medium text-emerald-600">
                  Staff Summary
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Review Details
                </h2>
              </div>

              <div className="p-5">

                {/* Staff */}
                <div className="mb-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Staff Member
                  </p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {staffName}
                      </p>

                      <p className="mt-0.5 text-xs capitalize text-slate-400">
                        {form.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-5 border-y border-slate-100 py-5">

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

                  {/* Specialization */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <BriefcaseBusiness size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Specialization
                      </p>

                      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
                        {form.specialization || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <ShieldCheck size={14} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Status
                      </p>

                      <p className="mt-0.5 text-sm font-medium capitalize text-slate-700">
                        {form.status.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-2.5">

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={17} />
                        Create Staff
                      </>
                    )}
                  </button>

                  <Link
                    href="/dashboard/staff"
                    className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50"
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

