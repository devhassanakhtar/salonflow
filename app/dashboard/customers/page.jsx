
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getCustomers } from "../../../lib/api";
import Pagination from "../../../components/Pagination";

import {
  Search,
  Plus,
  Users,
  MoreHorizontal,
  Phone,
  Mail,
  Eye,
  X,
} from "lucide-react";

const CUSTOMERS_PER_PAGE = 8;

function getInitials(name) {
  if (!name) return "";

  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CustomersPage() {
  // Search and pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Customer data
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Loading and error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action menu
  const [openMenu, setOpenMenu] = useState(null);

  // Load customers
  useEffect(() => {
    let isCancelled = false;

    async function loadCustomers() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        params.set("per_page", CUSTOMERS_PER_PAGE);
        params.set("page", currentPage);

        if (search.trim()) {
          params.set("q", search.trim());
        }

        const response = await getCustomers(
          `?${params.toString()}`
        );

        if (isCancelled) return;

        const customerList = Array.isArray(response?.data)
          ? response.data
          : [];

        setCustomers(customerList);

        setTotalCustomers(
          Number(response?.meta?.total) ||
            customerList.length
        );

        setTotalPages(
          Number(response?.meta?.last_page) || 1
        );
      } catch (err) {
        if (!isCancelled) {
          console.error("Customers Error:", err);

          setError(
            err?.message || "Failed to load customers"
          );

          setCustomers([]);
          setTotalCustomers(0);
          setTotalPages(1);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadCustomers();

    return () => {
      isCancelled = true;
    };
  }, [search, currentPage]);

  // Search
  function handleSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  // Pagination
  function handlePageChange(page) {
    setCurrentPage(page);
    setOpenMenu(null);
  }

  // Showing numbers
  const showingFrom =
    totalCustomers === 0
      ? 0
      : (currentPage - 1) * CUSTOMERS_PER_PAGE + 1;

  const showingTo = Math.min(
    currentPage * CUSTOMERS_PER_PAGE,
    totalCustomers
  );

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">

      {/* Page Header */}
      <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">

        <div>
          <p className="mb-1 text-sm font-medium text-emerald-600">
            Customer Management
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-[34px]">
            Customers
          </h1>

          <p className="mt-1.5 text-sm text-slate-400">
            Manage your salon customers and their information.
          </p>
        </div>

        <Link
          href="/dashboard/customers/new"
          className="flex w-fit items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800"
        >
          <Plus size={17} />
          New Customer
        </Link>

      </div>

      {/* Stats */}
      <div className="mb-6">

        {/* Total Customers */}
        <div className="w-full rounded-2xl border border-emerald-700 bg-emerald-700 p-4 text-white shadow-sm md:p-5 lg:max-w-[calc(25%-12px)]">

          <div className="mb-4 flex items-center justify-between">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
              <Users size={18} />
            </div>

            <span className="text-xs text-white/60">
              Total
            </span>

          </div>

          <p className="text-xs text-white/70">
            Total Customers
          </p>

          <p className="mt-1 text-2xl font-semibold md:text-3xl">
            {totalCustomers}
          </p>

        </div>

      </div>

      {/* Search */}
      <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative w-full xl:max-w-md">

          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              handleSearch(e.target.value)
            }
            placeholder="Search customers..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
          />

          {search && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}

        </div>

      </div>

      {/* Customer Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex flex-col items-center">

              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700"></div>

              <p className="mt-3 text-sm text-slate-400">
                Loading customers...
              </p>

            </div>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <X size={25} />
            </div>

            <h3 className="text-sm font-semibold text-slate-800">
              Failed to load customers
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => {
                setCurrentPage(currentPage);
              }}
              className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              Try Again
            </button>

          </div>
        )}

        {/* Customer Data */}
        {!loading && !error && (
          <>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">

              <table className="w-full">

                <thead>

                  <tr className="border-b border-slate-100 bg-slate-50/70">

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Customer
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Contact
                    </th>

                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {customers.map((customer) => (

                    <tr
                      key={customer.id}
                      className="transition hover:bg-slate-50/60"
                    >

                      {/* Customer */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                            {getInitials(customer.name)}
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-medium text-slate-800">
                              {customer.name || "—"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              ID: #{customer.id}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4">

                        <div className="space-y-1">

                          <p className="flex items-center gap-2 text-sm text-slate-600">

                            <Phone
                              size={14}
                              className="text-slate-400"
                            />

                            {customer.phone || "—"}

                          </p>

                          <p className="flex items-center gap-2 text-xs text-slate-400">

                            <Mail
                              size={14}
                              className="text-slate-400"
                            />

                            {customer.email || "—"}

                          </p>

                        </div>

                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">

                        <div className="flex items-center justify-end gap-2">

                          <Link
                            href={`/dashboard/customers/${customer.id}`}
                            className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
                          >
                            <Eye size={14} />
                            View
                          </Link>

                          <div className="relative">

                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === customer.id
                                    ? null
                                    : customer.id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {openMenu === customer.id && (
                              <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-lg">

                                <Link
                                  href={`/dashboard/customers/${customer.id}`}
                                  className="block w-full rounded-lg px-3 py-2 text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  View Details
                                </Link>

                                <button
                                  type="button"
                                  className="w-full rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  Edit
                                </button>

                              </div>
                            )}

                          </div>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {/* Mobile */}
            <div className="divide-y divide-slate-100 lg:hidden">

              {customers.map((customer) => (

                <div
                  key={customer.id}
                  className="p-4 sm:p-5"
                >

                  {/* Customer */}
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                      {getInitials(customer.name)}
                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {customer.name || "—"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        ID: #{customer.id}
                      </p>

                    </div>

                  </div>

                  {/* Contact */}
                  <div className="mt-4 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">

                        <Phone size={13} />

                        <span className="text-[10px] uppercase tracking-wide">
                          Phone
                        </span>

                      </div>

                      <p className="truncate text-xs font-medium text-slate-700">
                        {customer.phone || "—"}
                      </p>

                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">

                        <Mail size={13} />

                        <span className="text-[10px] uppercase tracking-wide">
                          Email
                        </span>

                      </div>

                      <p className="truncate text-xs font-medium text-slate-700">
                        {customer.email || "—"}
                      </p>

                    </div>

                  </div>

                  {/* Mobile Actions */}
                  <div className="mt-3 flex gap-2">

                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
                    >
                      <Eye size={14} />
                      View Customer
                    </Link>

                    <button
                      type="button"
                      className="flex-1 rounded-xl bg-emerald-50 py-2 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                    >
                      Edit Customer
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* No Customers */}
            {customers.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Users size={25} />
                </div>

                <h3 className="text-sm font-semibold text-slate-800">
                  No customers found
                </h3>

                <p className="mt-1 max-w-sm text-xs text-slate-400">
                  Try changing your search to find customers.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCurrentPage(1);
                    }}
                    className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                  >
                    Clear Search
                  </button>
                )}

              </div>
            )}

            {/* Pagination */}
            {customers.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                <p className="text-xs text-slate-400">

                  Showing{" "}

                  <span className="font-medium text-slate-600">
                    {showingFrom}
                  </span>

                  {" "}to{" "}

                  <span className="font-medium text-slate-600">
                    {showingTo}
                  </span>

                  {" "}of{" "}

                  <span className="font-medium text-slate-600">
                    {totalCustomers}
                  </span>

                  {" "}customers

                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />

              </div>
            )}

          </>
        )}

      </div>

    </div>
  );
}

