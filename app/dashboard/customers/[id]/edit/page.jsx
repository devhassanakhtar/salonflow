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
  MapPin,
  Save,
} from "lucide-react";

import { getCustomer, updateCustomer } from "../../../../../lib/api";

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();

  const customerId = params?.id;

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // Get customer data
  useEffect(() => {
    async function loadCustomer() {
      try {
        setLoading(true);
        setError("");

        const response = await getCustomer(customerId);

        console.log("CUSTOMER RESPONSE:", response);

        const customer = response?.data || response;

        // Split full name into first and last name
        const nameParts = (customer.name || "").trim().split(" ");

        const firstName = nameParts[0] || "";

        const lastName = nameParts.slice(1).join(" ");

        setForm({
          firstName: firstName,
          lastName: lastName,
          phone: customer.phone || "",
          email: customer.email || "",
          dateOfBirth: customer.date_of_birth || "",
          address: customer.address || "",
        });
      } catch (err) {
        console.error("CUSTOMER EDIT ERROR:", err);

        setError(err?.message || "Failed to load customer.");
      } finally {
        setLoading(false);
      }
    }

    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  // Update customer
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // Basic validation
    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    if (!form.lastName.trim()) {
      setError("Last name is required.");
      return;
    }

    if (!form.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setSaving(true);

      const customerData = {
        name: `${form.firstName.trim()} ${form.lastName.trim()}`,
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        date_of_birth: form.dateOfBirth || null,
        address: form.address.trim() || null,
      };

      console.log("UPDATE CUSTOMER DATA:", customerData);

      await updateCustomer(customerId, customerData);

      // After successful update go back to details page
      router.push(`/dashboard/customers/${customerId}`);
    } catch (err) {
      console.error("UPDATE CUSTOMER ERROR:", err);

      setError(err?.message || "Failed to update customer.");
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-7">
        <Link
          href={`/dashboard/customers/${customerId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Customer
        </Link>

        <div>
          <p className="text-sm font-medium text-emerald-600">
            Customer #{customerId}
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
            Edit Customer
          </h1>

          <p className="mt-1.5 text-sm text-slate-400">
            Update customer information.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-100 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-600">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Basic Information */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <UserRound size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-emerald-600">
                      Customer Information
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Basic Information
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      First Name
                    </label>

                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Last Name
                    </label>

                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-emerald-600">
                      Contact Details
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-slate-900">
                      Contact Information
                    </h2>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Phone Number
                    </label>

                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-xs font-semibold text-slate-600">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* Save Card */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <p className="text-xs font-medium text-emerald-600">
                  Save Changes
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Update Customer
                </h2>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Make sure the customer information is correct before saving.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />

                {saving ? "Saving..." : "Save Changes"}
              </button>

              <Link
                href={`/dashboard/customers/${customerId}`}
                className="mt-2.5 flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </Link>
            </section>
          </aside>
        </div>
      </form>
    </div>
  );
}
