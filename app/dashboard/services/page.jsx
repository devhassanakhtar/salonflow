"use client";

import { useEffect, useState } from "react";
import {
  Clock3,
  Edit3,
  MoreHorizontal,
  Plus,
  Scissors,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { getServices, updateService, deleteService } from "../../../lib/api";

import Pagination from "../../../components/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";

export default function ServicesPage() {
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [deleteModal, setDeleteModal] = useState({
    open: false,
    service: null,
  });

  const [openMenu, setOpenMenu] = useState(null);

  // Get Services
  const loadServices = async (page = 1) => {
    try {
      setLoading(true);

      const response = await getServices(page);

      setServices(response?.data || []);
      setCurrentPage(response?.meta?.current_page || page);
      setTotalPages(response?.meta?.last_page || 1);
    } catch (error) {
      toast.error(error.message || "Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices(currentPage);
  }, [currentPage]);

  // Status Toggle
  const handleStatusToggle = async (service) => {
    try {
      setUpdatingId(service.id);

      const newStatus = !service.is_active;

      await updateService(service.id, {
        name: service.name,
        description: service.description,
        price: service.price,
        duration_minutes: service.duration_minutes,
        is_active: newStatus,
      });

      setServices((prev) =>
        prev.map((item) =>
          item.id === service.id
            ? {
                ...item,
                is_active: newStatus,
              }
            : item,
        ),
      );

      toast.success(
        `${service.name} is now ${newStatus ? "Active" : "Inactive"}.`,
      );
    } catch (error) {
      toast.error(error.message || "Failed to update service status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete Service
  const handleDelete = async () => {
    const service = deleteModal.service;

    if (!service) return;

    try {
      await deleteService(service.id);

      setServices((prev) => prev.filter((item) => item.id !== service.id));

      setDeleteModal({
        open: false,
        service: null,
      });

      setOpenMenu(null);

      toast.success("Service deleted successfully.");

      // Agar current page empty ho jaye
      if (services.length === 1 && currentPage > 1) {
        setCurrentPage((page) => page - 1);
      } else {
        loadServices(currentPage);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete service.");
    }
  };

  // Search + Status Filter
  const filteredServices = services.filter((service) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      service.name?.toLowerCase().includes(searchText) ||
      service.description?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" && service.is_active) ||
      (statusFilter === "Inactive" && !service.is_active);

    return matchesSearch && matchesStatus;
  });

  const activeServices = services.filter((service) => service.is_active).length;

  const inactiveServices = services.filter(
    (service) => !service.is_active,
  ).length;

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Service Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            Services
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your salon services and pricing.
          </p>
        </div>

        <Link
          href="/dashboard/services/new"
          className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          <Plus size={17} />
          Add Service
        </Link>
      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Total Services</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {services.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {activeServices}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Inactive</p>

          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {inactiveServices}
          </p>
        </div>
      </div>

      {/* Main Card */}
      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Service List
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Your available salon services.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-64"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
              {["All", "Active", "Inactive"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setStatusFilter(item)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    statusFilter === item
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-slate-500">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          /* Empty State */
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Scissors size={18} />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-700">
              No services found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                      Service
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                      Description
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                      Duration
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                      Price
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
                  {filteredServices.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b border-slate-100 last:border-0"
                    >
                      {/* Service */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Scissors size={16} />
                          </div>

                          <span className="text-sm font-medium text-slate-800">
                            {service.name}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="max-w-xs px-5 py-4">
                        <p className="truncate text-sm text-slate-600">
                          {service.description || "—"}
                        </p>
                      </td>

                      {/* Duration */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Clock3 size={15} className="text-slate-400" />
                          {service.duration_minutes} min
                        </div>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-medium text-slate-800">
                          Rs. {Number(service.price).toLocaleString()}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(service)}
                          disabled={updatingId === service.id}
                          className="flex cursor-pointer items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span
                            className={`relative h-5 w-9 rounded-full transition ${
                              service.is_active
                                ? "bg-emerald-600"
                                : "bg-slate-300"
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                                service.is_active ? "left-[18px]" : "left-0.5"
                              }`}
                            />
                          </span>

                          <span
                            className={`text-xs font-medium ${
                              service.is_active
                                ? "text-emerald-700"
                                : "text-slate-500"
                            }`}
                          >
                            {service.is_active ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </td>

                      {/* Action Dropdown */}
                      <td className="relative px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === service.id ? null : service.id,
                              )
                            }
                            className="cursor-pointer rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenu === service.id && (
                            <div className="absolute right-5 top-12 z-50 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                              <Link
                                href={`/dashboard/services/${service.id}/edit`}
                                onClick={() => setOpenMenu(null)}
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                              >
                                <Edit3 size={14} />
                                Edit
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteModal({
                                    open: true,
                                    service,
                                  })
                                }
                                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredServices.map((service) => (
                <div key={service.id} className="p-4">
                  {/* Top */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                        <Scissors size={16} />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {service.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {service.description || "No description"}
                        </p>
                      </div>
                    </div>

                    {/* Mobile Action */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenu(
                            openMenu === service.id ? null : service.id,
                          )
                        }
                        className="cursor-pointer rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {openMenu === service.id && (
                        <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                          <Link
                            href={`/dashboard/services/${service.id}/edit`}
                            onClick={() => setOpenMenu(null)}
                            className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            <Edit3 size={14} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                open: true,
                                service,
                              })
                            }
                            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Duration</p>

                      <p className="mt-0.5 text-sm text-slate-700">
                        {service.duration_minutes} min
                      </p>
                    </div>

                    <div>
                      <p className="text-right text-xs text-slate-400">Price</p>

                      <p className="mt-0.5 text-right text-sm font-medium text-slate-800">
                        Rs. {Number(service.price).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-400">Status</p>

                    <button
                      type="button"
                      onClick={() => handleStatusToggle(service)}
                      disabled={updatingId === service.id}
                      className="flex cursor-pointer items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <span
                        className={`relative h-5 w-9 rounded-full transition ${
                          service.is_active ? "bg-emerald-600" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                            service.is_active ? "left-[18px]" : "left-0.5"
                          }`}
                        />
                      </span>

                      <span
                        className={`text-xs font-medium ${
                          service.is_active
                            ? "text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-end border-t border-slate-100 px-5 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={deleteModal.open}
        title="Delete Service?"
        message={`Are you sure you want to delete "${deleteModal.service?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteModal({
            open: false,
            service: null,
          })
        }
      />
    </div>
  );
}
