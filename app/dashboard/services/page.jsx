"use client";

import { useState } from "react";
import {
  Clock3,
  Edit3,
  MoreHorizontal,
  Plus,
  Scissors,
  Trash2,
} from "lucide-react";
import Link from "next/link";

const initialServices = [
  {
    id: 1,
    name: "Haircut",
    category: "Hair",
    duration: "30 min",
    price: 1200,
    status: "Active",
  },
  {
    id: 2,
    name: "Beard Trim",
    category: "Grooming",
    duration: "20 min",
    price: 700,
    status: "Active",
  },
  {
    id: 3,
    name: "Hair Styling",
    category: "Hair",
    duration: "45 min",
    price: 1800,
    status: "Active",
  },
  {
    id: 4,
    name: "Facial",
    category: "Skin Care",
    duration: "60 min",
    price: 2500,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Hair Color",
    category: "Hair",
    duration: "90 min",
    price: 3500,
    status: "Active",
  },
];

const categories = ["All", "Hair", "Grooming", "Skin Care"];

export default function ServicesPage() {
  const [services, setServices] = useState(initialServices);
  const [category, setCategory] = useState("All");

  const filteredServices =
    category === "All"
      ? services
      : services.filter((service) => service.category === category);

  const toggleStatus = (id) => {
    setServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              status: service.status === "Active" ? "Inactive" : "Active",
            }
          : service,
      ),
    );
  };

  const deleteService = (id) => {
    setServices((prev) => prev.filter((service) => service.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Services
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your salon services and pricing
            </p>
          </div>

          <Link
            href="/dashboard/services/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700"
          >
            <Plus size={17} />
            Add Service
          </Link>
        </div>

        {/* Small Summary */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Total Services</p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {services.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Active</p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {services.filter((s) => s.status === "Active").length}
            </p>
          </div>

          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-4 sm:col-span-1">
            <p className="text-xs font-medium text-slate-500">Categories</p>

            <p className="mt-1 text-2xl font-semibold text-slate-900">
              {new Set(services.map((s) => s.category)).size}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Card Header */}
          <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Service List
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Your available salon services
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-1 overflow-x-auto">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    category === item
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Service
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-medium text-slate-500">
                    Category
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

                    {/* Category */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {service.category}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock3 size={15} className="text-slate-400" />
                        {service.duration}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-slate-800">
                        Rs. {service.price.toLocaleString()}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleStatus(service.id)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          service.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {service.status}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          onClick={() => deleteService(service.id)}
                          className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
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
                        {service.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleStatus(service.id)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      service.status === "Active"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {service.status}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400">Duration</p>

                    <p className="mt-0.5 text-sm text-slate-700">
                      {service.duration}
                    </p>
                  </div>

                  <div>
                    <p className="text-right text-xs text-slate-400">Price</p>

                    <p className="mt-0.5 text-sm font-medium text-slate-800">
                      Rs. {service.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
                    <Edit3 size={14} />
                    Edit
                  </button>

                  <button
                    onClick={() => deleteService(service.id)}
                    className="flex items-center justify-center rounded-lg border border-slate-200 px-3 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredServices.length === 0 && (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Scissors size={18} />
              </div>

              <p className="mt-3 text-sm font-medium text-slate-700">
                No services found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                No services are available in this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
