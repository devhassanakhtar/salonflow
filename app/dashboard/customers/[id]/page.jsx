"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  UserRound,
  Phone,
  Mail,
  CalendarDays,
  Clock3,
  Scissors,
  MapPin,
  Edit3,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  CheckCircle2,
  CalendarPlus,
} from "lucide-react";

import { getCustomer, deleteCustomer } from "../../../../lib/api";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const customerId = params?.id;

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Get customer from API
  useEffect(() => {
    async function loadCustomer() {
      try {
        setLoading(true);
        setError("");

        const response = await getCustomer(customerId);

        console.log("CUSTOMER RESPONSE:", response);

        setCustomer(response?.data || response);
      } catch (err) {
        console.error("CUSTOMER DETAILS ERROR:", err);

        setError(err?.message || "Failed to load customer.");
      } finally {
        setLoading(false);
      }
    }

    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  // Delete customer
  async function handleDelete() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this customer?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(true);

      await deleteCustomer(customerId);

      router.push("/dashboard/customers");
    } catch (err) {
      console.error("DELETE CUSTOMER ERROR:", err);

      alert(err?.message || "Failed to delete customer.");
    } finally {
      setDeleting(false);
    }
  }

  // Create initials from customer name
  function getInitials(name) {
    if (!name) {
      return "";
    }

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  // Format date
  function formatDate(date) {
    if (!date) {
      return "Not provided";
    }

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  // Loading
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

          <p className="text-sm text-slate-400">Loading customer...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error || !customer) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-8">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </Link>

        <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-600">
            {error || "Customer not found."}
          </p>
        </div>
      </div>
    );
  }

  // Customer data
  const name = customer.name || "Unnamed Customer";

  const phone = customer.phone || "Not provided";

  const email = customer.email || "Not provided";

  const address = customer.address || "Not provided";

  const initials = getInitials(name);

  const status = customer.status || "Customer";

  const statistics = customer.statistics || {};

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-7">
        <Link
          href="/dashboard/customers"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Customers
        </Link>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <p className="text-sm font-medium text-emerald-600">
                Customer #{customer.id || customerId}
              </p>

              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                {status}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
              Customer Details
            </h1>

            <p className="mt-1.5 text-sm text-slate-400">
              View and manage customer information.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/dashboard/customers/${customerId}/edit`}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 transition hover:bg-slate-50 cursor-pointer"
            >
              <Edit3 size={15} />
              Edit
            </Link>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={15} />

              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* Customer Overview */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 p-5 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-emerald-600">
                    Customer Overview
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Customer Information
                  </h2>
                </div>

                <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:flex">
                  <UserRound size={19} />
                </div>
              </div>
            </div>

            <div className="p-5 md:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-lg font-semibold text-emerald-700">
                  {initials}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {name}
                  </h3>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5">
              <p className="text-xs font-medium text-emerald-600">
                Contact Details
              </p>

              <h2 className="mt-1 text-lg font-semibold text-slate-900">
                Contact Information
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Phone */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Phone size={18} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Phone Number
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {phone}
                </p>
              </div>

              {/* Email */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <Mail size={18} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                  {email}
                </p>
              </div>

              {/* Address */}
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 md:col-span-2">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <MapPin size={18} />
                </div>

                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Address
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {address}
                </p>
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
                  Customer Notes
                </h2>

                <p className="text-xs text-slate-400">
                  Additional customer information
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm leading-6 text-slate-600">
                {customer.notes || "No notes available."}
              </p>
            </div>
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-5 xl:sticky xl:top-24 xl:self-start">
          {/* Customer Status */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-emerald-700 p-5 text-white">
              <p className="text-xs text-emerald-100">Customer Status</p>

              <div className="mt-2 flex items-center gap-2">
                <CheckCircle2 size={19} />

                <h2 className="text-lg font-semibold">{status}</h2>
              </div>

              <p className="mt-2 text-xs leading-5 text-emerald-100">
                Customer information and account details.
              </p>
            </div>

            <div className="p-5">
              <Link
                href={`/dashboard/appointments/new?customer=${customerId}`}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                <CalendarPlus size={16} />
                New Appointment
              </Link>
            </div>
          </section>

          {/* Quick Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              Quick Details
            </h2>

            <div className="mt-5 space-y-4">
              {/* Customer ID */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <UserRound size={14} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Customer ID
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {customer.id || customerId}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                  <Phone size={14} />
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">
                    Phone
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-slate-700">
                    {phone}
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

                  <p className="mt-0.5 break-all text-sm font-medium text-slate-700">
                    {email}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Created Info */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                <CalendarDays size={15} />
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-700">
                  SalonFlow
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Customer created on{" "}
                  {formatDate(customer.created_at || customer.createdAt)}.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
