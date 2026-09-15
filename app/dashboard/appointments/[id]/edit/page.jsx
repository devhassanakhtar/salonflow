"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  UserRound,
  Scissors,
  FileText,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

import {
  getAppointment,
  getCustomers,
  getServices,
  getStaff,
  updateAppointment,
} from "../../../../../lib/api";

export default function EditAppointmentPage() {
  const params = useParams();
  const router = useRouter();

  const appointmentId = params.id;

  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [apiError, setApiError] = useState("");
  const [updated, setUpdated] = useState(false);

  const [form, setForm] = useState({
    customer: "",
    service: "",
    staff: "",
    date: "",
    time: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // Load appointment + dropdown data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setApiError("");

        const [
          appointmentResponse,
          customersResponse,
          servicesResponse,
          staffResponse,
        ] = await Promise.all([
          getAppointment(appointmentId),
          getCustomers("?per_page=100"),
          getServices(),
          getStaff(),
        ]);

        const appointment = appointmentResponse?.data || appointmentResponse;

        const customerList = customersResponse?.data || [];

        const serviceList = (servicesResponse?.data || []).filter(
          (service) => service.is_active,
        );

        const staffList = staffResponse?.data || [];

        setCustomers(customerList);
        setServices(serviceList);
        setStaffMembers(staffList);

        // Fill form with existing appointment data
        setForm({
          customer: appointment?.customer?.id
            ? String(appointment.customer.id)
            : appointment?.customer_id
              ? String(appointment.customer_id)
              : "",

          service: appointment?.service?.id
            ? String(appointment.service.id)
            : appointment?.service_id
              ? String(appointment.service_id)
              : "",

          staff: appointment?.staff?.id
            ? String(appointment.staff.id)
            : appointment?.staff_id
              ? String(appointment.staff_id)
              : "",

          date: appointment?.appointment_date || "",

          time: appointment?.appointment_time
            ? appointment.appointment_time.slice(0, 5)
            : "",

          notes: appointment?.notes || "",
        });
      } catch (error) {
        console.error("Failed to load appointment:", error);
        setApiError(error.message || "Failed to load appointment.");
      } finally {
        setLoading(false);
      }
    }

    if (appointmentId) {
      loadData();
    }
  }, [appointmentId]);

  const selectedCustomer = customers.find(
    (customer) => String(customer.id) === form.customer,
  );

  const selectedService = services.find(
    (service) => String(service.id) === form.service,
  );

  const selectedStaff = staffMembers.find(
    (staff) => String(staff.id) === form.staff,
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

    setUpdated(false);
    setApiError("");
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

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);
      setApiError("");
      setUpdated(false);

      const appointmentData = {
        customer_id: Number(form.customer),
        service_id: Number(form.service),
        staff_id: Number(form.staff),
        appointment_date: form.date,
        appointment_time: form.time,
        notes: form.notes || null,
      };

      console.log("Updating appointment:", appointmentData);

      await updateAppointment(appointmentId, appointmentData);

      setUpdated(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Update appointment failed:", error);
      setApiError(error.message || "Failed to update appointment.");
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Success */}
      {updated && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold">
              Appointment updated successfully
            </p>

            <p className="mt-0.5 text-xs text-emerald-600">
              The appointment changes have been saved successfully.
            </p>
          </div>
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
          {apiError}
        </div>
      )}

      {/* Header */}
      <div className="mb-7">
        <Link
          href={`/dashboard/appointments/${appointmentId}`}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-emerald-600"
        >
          <ArrowLeft size={16} />
          Back to Appointment
        </Link>

        <p className="mb-1 text-sm font-medium text-emerald-600">
          Appointment Management
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
          Edit Appointment
        </h1>

        <p className="mt-1.5 text-sm text-slate-400">
          Update the appointment details below.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* LEFT */}
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
                  disabled={loading}
                  className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition ${
                    errors.customer
                      ? "border-red-300"
                      : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                  }`}
                >
                  <option value="">
                    {loading ? "Loading customers..." : "Select a customer"}
                  </option>

                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
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
                <p className="mt-1.5 text-xs text-red-500">{errors.customer}</p>
              )}
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
                      disabled={loading}
                      className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition ${
                        errors.service
                          ? "border-red-300"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    >
                      <option value="">
                        {loading ? "Loading services..." : "Select a service"}
                      </option>

                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
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
                      <span className="text-xs text-slate-500">Duration</span>

                      <span className="text-xs font-semibold text-slate-700">
                        {selectedService.duration_minutes} min
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
                      disabled={loading}
                      className={`h-12 w-full appearance-none rounded-xl border bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition ${
                        errors.staff
                          ? "border-red-300"
                          : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                      }`}
                    >
                      <option value="">
                        {loading ? "Loading staff..." : "Select staff member"}
                      </option>

                      {staffMembers.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name} — {staff.specialization}
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

              <div className="grid gap-5 md:grid-cols-2">
                {/* Date */}
                <div>
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
                    disabled={loading}
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition ${
                      errors.date
                        ? "border-red-300"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  {errors.date && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>
                  )}
                </div>

                {/* Time */}
                <div>
                  <label
                    htmlFor="time"
                    className="mb-2 block text-xs font-medium text-slate-600"
                  >
                    Appointment Time
                  </label>

                  <input
                    id="time"
                    name="time"
                    type="time"
                    value={form.time}
                    onChange={handleChange}
                    disabled={loading}
                    className={`h-12 w-full rounded-xl border bg-white px-4 text-sm text-slate-700 outline-none transition ${
                      errors.time
                        ? "border-red-300"
                        : "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                    }`}
                  />

                  {errors.time && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.time}</p>
                  )}
                </div>
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
                disabled={loading}
                placeholder="Write any notes about this appointment..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              />

              <p className="mt-2 text-[11px] text-slate-400">Optional</p>
            </section>
          </div>

          {/* RIGHT SUMMARY */}
          <div className="xl:sticky xl:top-24 xl:self-start">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50/70 p-5">
                <p className="text-xs font-medium text-emerald-600">
                  Appointment Summary
                </p>

                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                  Review Changes
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

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Service
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {selectedService?.name || "Not selected"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                      <UserRound size={14} />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Staff
                      </p>

                      <p className="mt-0.5 text-sm font-medium text-slate-700">
                        {selectedStaff?.name || "Not selected"}
                      </p>

                      {selectedStaff && (
                        <p className="text-[11px] text-slate-400">
                          {selectedStaff.specialization}
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
                              `${form.date}T00:00:00`,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
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
                        {form.time || "Not selected"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                {selectedService && (
                  <div className="mt-5 flex items-center justify-between rounded-xl bg-emerald-50 p-4">
                    <div>
                      <p className="text-xs text-emerald-600">Service Price</p>

                      <p className="mt-0.5 text-lg font-semibold text-emerald-800">
                        {selectedService.price}
                      </p>
                    </div>

                    <Scissors size={22} className="text-emerald-500" />
                  </div>
                )}

                {/* Update */}
                <button
                  type="submit"
                  disabled={submitLoading || loading}
                  className="mt-5 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />

                  {submitLoading ? "Updating..." : "Update Appointment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
