"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Phone,
  Scissors,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { getStaffMember, updateStaff } from "../../../../../lib/api";

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "staff",
    specialization: "",
    status: "available",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function loadStaff() {
      try {
        const response = await getStaffMember(id);
        const staff = response?.data || response;

        setForm({
          name: staff?.name || "",
          email: staff?.email || "",
          phone: staff?.phone || "",
          role: staff?.role || "staff",
          specialization: staff?.specialization || "",
          status: staff?.status || "available",
          password: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("STAFF EDIT ERROR:", error);

        toast.error(
          error?.message || "Failed to load staff details."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadStaff();
    }
  }, [id]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Full name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    }

    if (!form.role) {
      newErrors.role = "Role is required.";
    }

    if (!form.specialization.trim()) {
      newErrors.specialization = "Specialization is required.";
    }

    if (!form.status) {
      newErrors.status = "Status is required.";
    }

    // Password optional on edit
    if (form.password && form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: form.name,
        role: form.role,
        status: form.status,
      };

      await updateStaff(id, data);

      toast.success("Staff updated successfully.");

      router.push(`/dashboard/staff/${id}`);
    } catch (error) {
      console.error("UPDATE STAFF ERROR:", error);

      toast.error(
        error?.message || "Failed to update staff."
      );
    } finally {
      setSaving(false);
    }
  }

  const initials = form.name
    ? form.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "ST";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8 md:py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Loading staff details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-4 py-6 md:px-8 md:py-8">

        {/* Header */}
        <div className="mb-7">
          <Link
            href={`/dashboard/staff/${id}`}
            className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            Back to Staff Details
          </Link>

          <p className="text-sm font-medium text-emerald-600">
            Staff Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Edit Staff
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update staff member information and account details.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

            {/* Left Side */}
            <div className="space-y-6">

              {/* Personal Information */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <UserRound size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Personal Information
                    </h2>

                    <p className="text-xs text-slate-500">
                      Basic information about the staff member
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.name
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                        }`}
                      />
                    </div>

                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Phone
                    </label>

                    <div className="relative">
                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="0300 1234567"
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.phone
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
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
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="staff@example.com"
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.email
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                        }`}
                      />
                    </div>

                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <BriefcaseBusiness size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Staff Information
                    </h2>

                    <p className="text-xs text-slate-500">
                      Role, specialization and availability
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Role */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Role
                    </label>

                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={`h-12 w-full cursor-pointer rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition focus:ring-2 ${
                        errors.role
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                      }`}
                    >
                      <option value="staff">Staff</option>
                      <option value="receptionist">Receptionist</option>
                      <option value="admin">Admin</option>
                    </select>

                    {errors.role && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.role}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Status
                    </label>

                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className={`h-12 w-full cursor-pointer rounded-xl border bg-white px-4 text-sm capitalize text-slate-700 outline-none transition focus:ring-2 ${
                        errors.status
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                      }`}
                    >
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="off_duty">Off Duty</option>
                    </select>

                    {errors.status && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.status}
                      </p>
                    )}
                  </div>

                  {/* Specialization */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Specialization
                    </label>

                    <div className="relative">
                      <Scissors
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        placeholder="e.g. Hair Stylist"
                        className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                          errors.specialization
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                        }`}
                      />
                    </div>

                    {errors.specialization && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.specialization}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <LockKeyhole size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                      Account Security
                    </h2>

                    <p className="text-xs text-slate-500">
                      Leave password fields empty to keep the current password
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      New Password
                    </label>

                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.password
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                      }`}
                    />

                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.confirmPassword
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                      }`}
                    />

                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      Staff Profile
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-700">
                      Update the information above and save your
                      changes. Password fields can be left empty if
                      you do not want to change the current password.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary */}
            <div className="xl:sticky xl:top-24 xl:self-start">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* Summary Header */}
                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                  <h2 className="text-base font-semibold text-slate-900">
                    Staff Summary
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Review changes before saving
                  </p>
                </div>

                <div className="p-5">

                  {/* Avatar */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700">
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {form.name || "Staff Name"}
                      </p>

                      <p className="mt-0.5 text-xs capitalize text-slate-500">
                        {form.role || "staff"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-6 space-y-4">

                    <div className="flex items-start gap-3">
                      <Scissors
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Specialization
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-slate-700">
                          {form.specialization || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Phone
                        </p>

                        <p className="mt-0.5 text-sm font-medium text-slate-700">
                          {form.phone || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">
                          Email
                        </p>

                        <p className="mt-0.5 break-all text-sm font-medium text-slate-700">
                          {form.email || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <BadgeCheck
                        size={16}
                        className="mt-0.5 shrink-0 text-slate-400"
                      />

                      <div>
                        <p className="text-xs text-slate-400">
                          Status
                        </p>

                        <p className="mt-0.5 text-sm font-medium capitalize text-slate-700">
                          {form.status.replace("_", " ") || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-6 space-y-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2 size={17} />

                      {saving ? "Updating..." : "Update Staff"}
                    </button>

                    <Link
                      href={`/dashboard/staff/${id}`}
                      className="flex h-11 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
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
    </div>
  );
}
