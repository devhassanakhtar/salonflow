"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  DollarSign,
  FileText,
  Scissors,
  ToggleLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getService,
  updateService,
} from "../../../../../lib/api";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    duration_minutes: "",
    is_active: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Get service
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);

        const response = await getService(id);

        const service = response?.data || response;

        setForm({
          name: service?.name || "",
          description: service?.description || "",
          price: service?.price || "",
          duration_minutes:
            service?.duration_minutes || "",
          is_active: service?.is_active ?? true,
        });
      } catch (error) {
        toast.error(
          error.message || "Failed to load service.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadService();
    }
  }, [id]);

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // Status change
  const handleStatusChange = (value) => {
    setForm((prev) => ({
      ...prev,
      is_active: value,
    }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Service name is required.";
    }

    if (!form.description.trim()) {
      newErrors.description =
        "Description is required.";
    }

    if (!form.price) {
      newErrors.price = "Price is required.";
    } else if (Number(form.price) < 0) {
      newErrors.price = "Price cannot be negative.";
    }

    if (!form.duration_minutes) {
      newErrors.duration_minutes =
        "Duration is required.";
    } else if (Number(form.duration_minutes) <= 0) {
      newErrors.duration_minutes =
        "Duration must be greater than 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setSaving(true);

      const data = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration_minutes: Number(
          form.duration_minutes,
        ),
        is_active: form.is_active,
      };

      await updateService(id, data);

      toast.success("Service updated successfully.");

      router.push("/dashboard/services");
    } catch (error) {
      toast.error(
        error.message || "Failed to update service.",
      );
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name
    ? form.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "SV";

  if (loading) {
    return (
      <div className="px-4 py-8 md:px-8">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-slate-500">
            Loading service...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">

      {/* Header */}
      <div className="mb-8">

        <Link
          href={`/dashboard/services`}
          className="mb-4 inline-flex cursor-pointer items-center gap-2 text-sm text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft size={16} />
          Back to Services
        </Link>

        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Service Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          Edit Service
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Update service information and pricing.
        </p>

      </div>

      <form onSubmit={handleSubmit}>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">

          {/* Left */}
          <div className="space-y-6">

            {/* Basic Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <Scissors size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Service Information
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Basic details about this service.
                  </p>
                </div>

              </div>

              <div className="space-y-5">

                {/* Name */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Service Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Haircut"
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.name
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  />

                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.name}
                    </p>
                  )}

                </div>

                {/* Description */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the service..."
                    className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                      errors.description
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                    }`}
                  />

                  {errors.description && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.description}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Pricing & Duration */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <DollarSign size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Pricing & Duration
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Set the service price and duration.
                  </p>
                </div>

              </div>

              <div className="grid gap-5 sm:grid-cols-2">

                {/* Price */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Price
                  </label>

                  <div className="relative">

                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      Rs.
                    </span>

                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      min="0"
                      placeholder="500"
                      className={`h-12 w-full rounded-xl border bg-white pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.price
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                      }`}
                    />

                  </div>

                  {errors.price && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.price}
                    </p>
                  )}

                </div>

                {/* Duration */}
                <div>

                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Duration
                  </label>

                  <div className="relative">

                    <Clock3
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      name="duration_minutes"
                      value={form.duration_minutes}
                      onChange={handleChange}
                      min="1"
                      placeholder="30"
                      className={`h-12 w-full rounded-xl border bg-white pl-11 pr-14 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
                        errors.duration_minutes
                          ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-100"
                      }`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      min
                    </span>

                  </div>

                  {errors.duration_minutes && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.duration_minutes}
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Status */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ToggleLeft size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    Service Status
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Control whether this service is available.
                  </p>
                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-2">

                {/* Active */}
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(true)
                  }
                  className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                    form.is_active
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Active
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Service is available.
                      </p>
                    </div>

                    {form.is_active && (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600"
                      />
                    )}

                  </div>

                </button>

                {/* Inactive */}
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(false)
                  }
                  className={`cursor-pointer rounded-xl border p-4 text-left transition ${
                    !form.is_active
                      ? "border-slate-400 bg-slate-50"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        Inactive
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Service is unavailable.
                      </p>
                    </div>

                    {!form.is_active && (
                      <CheckCircle2
                        size={18}
                        className="text-slate-500"
                      />
                    )}

                  </div>

                </button>

              </div>

            </div>

          </div>

          {/* Right Summary */}
          <div className="xl:sticky xl:top-24 xl:self-start">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Summary Header */}
              <div className="border-b border-slate-200 bg-slate-50/70 px-5 py-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                  Review
                </p>

                <h2 className="mt-1 text-base font-semibold text-slate-900">
                  Service Summary
                </h2>

              </div>

              <div className="p-5">

                {/* Preview */}
                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-700">
                    {initials}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-slate-900">
                      {form.name || "Service Name"}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Service #{id}
                    </p>

                  </div>

                </div>

                {/* Details */}
                <div className="mt-6 space-y-4">

                  <div className="flex items-start gap-3">

                    <FileText
                      size={16}
                      className="mt-0.5 text-slate-400"
                    />

                    <div className="min-w-0">

                      <p className="text-xs text-slate-400">
                        Description
                      </p>

                      <p className="mt-0.5 text-sm text-slate-700">
                        {form.description ||
                          "No description"}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <DollarSign
                      size={16}
                      className="text-slate-400"
                    />

                    <div>

                      <p className="text-xs text-slate-400">
                        Price
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        Rs.{" "}
                        {form.price
                          ? Number(
                              form.price,
                            ).toLocaleString()
                          : "0"}
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <Clock3
                      size={16}
                      className="text-slate-400"
                    />

                    <div>

                      <p className="text-xs text-slate-400">
                        Duration
                      </p>

                      <p className="mt-0.5 text-sm text-slate-700">
                        {form.duration_minutes || "0"} min
                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <CheckCircle2
                      size={16}
                      className={
                        form.is_active
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }
                    />

                    <div>

                      <p className="text-xs text-slate-400">
                        Status
                      </p>

                      <p
                        className={`mt-0.5 text-sm font-medium ${
                          form.is_active
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        {form.is_active
                          ? "Active"
                          : "Inactive"}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Update */}
                <button
                  type="submit"
                  disabled={saving}
                  className="mt-7 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />

                  {saving
                    ? "Updating..."
                    : "Update Service"}
                </button>

                <Link
                  href="/dashboard/services"
                  className="mt-2 flex h-10 cursor-pointer items-center justify-center rounded-xl text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
                >
                  Cancel
                </Link>

              </div>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
}
