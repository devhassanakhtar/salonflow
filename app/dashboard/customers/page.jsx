"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Search,
  Plus,
  Users,
  MoreHorizontal,
  Phone,
  Mail,
  Eye,
  X,
  Trash2,
  Edit3,
} from "lucide-react";

import { getCustomers, deleteCustomer } from "../../../lib/api";

import Pagination from "../../../components/Pagination";
import ConfirmModal from "../../../components/ConfirmModal";

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
  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [filteredTotal, setFilteredTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openMenu, setOpenMenu] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    customerId: null,
  });

  useEffect(() => {
    loadCustomers();
  }, [search, currentPage]);

  async function loadCustomers() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("per_page", CUSTOMERS_PER_PAGE);
      params.set("page", currentPage);

      if (search.trim()) {
        params.set("q", search.trim());
      }

      const [response, totalResponse] = await Promise.all([
        getCustomers(`?${params.toString()}`),
        getCustomers("?per_page=1"),
      ]);

      const customerList = Array.isArray(response?.data) ? response.data : [];

      setCustomers(customerList);

      // Total customers without search
      setTotalCustomers(Number(totalResponse?.meta?.total) || 0);

      // Total customers after search
      setFilteredTotal(Number(response?.meta?.total) || 0);

      setTotalPages(Number(response?.meta?.last_page) || 1);
    } catch (err) {
      console.error("Customers Error:", err);

      setError(err?.message || "Failed to load customers");

      setCustomers([]);
      setFilteredTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    setOpenMenu(null);
  }

  function handleDelete(id) {
    setConfirmModal({
      open: true,
      customerId: id,
    });

    setOpenMenu(null);
  }

  async function confirmDelete() {
    const id = confirmModal.customerId;

    if (!id) return;

    try {
      setDeleteLoading(true);

      await deleteCustomer(id);

      setCustomers((prev) => prev.filter((customer) => customer.id !== id));

      setTotalCustomers((prev) => Math.max(prev - 1, 0));

      setFilteredTotal((prev) => Math.max(prev - 1, 0));

      toast.success("Customer deleted successfully");

      setConfirmModal({
        open: false,
        customerId: null,
      });
    } catch (err) {
      console.error("Delete Customer Error:", err);

      toast.error(err?.message || "Failed to delete customer.");
    } finally {
      setDeleteLoading(false);
    }
  }

  const showingFrom =
    filteredTotal === 0 ? 0 : (currentPage - 1) * CUSTOMERS_PER_PAGE + 1;

  const showingTo = Math.min(currentPage * CUSTOMERS_PER_PAGE, filteredTotal);

  return (
    <div className="px-4 py-6 md:px-8 md:py-8">
      {/* Header */}

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
          className="flex w-fit items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-800"
        >
          <Plus size={17} />
          New Customer
        </Link>
      </div>

      {/* Total Customers */}

      <div className="mb-6 w-full rounded-2xl border border-emerald-700 bg-emerald-700 p-4 text-white shadow-sm md:p-5 lg:max-w-[calc(25%-12px)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
            <Users size={18} />
          </div>

          <span className="text-xs text-white/60">Total</span>
        </div>

        <p className="text-xs text-white/70">Total Customers</p>

        <p className="mt-1 text-2xl font-semibold md:text-3xl">
          {totalCustomers}
        </p>
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
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search customers..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
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

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Loading */}

        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-700" />

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

            <p className="mt-1 text-xs text-slate-400">{error}</p>

            <button
              type="button"
              onClick={loadCustomers}
              className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Customers */}

        {!loading && !error && (
          <>
            {/* Desktop */}

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
                    <tr key={customer.id} className="hover:bg-slate-50/60">
                      {/* Customer */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                            {getInitials(customer.name)}
                          </div>

                          <div>
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
                            <Phone size={14} className="text-slate-400" />

                            {customer.phone || "—"}
                          </p>

                          <p className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail size={14} />

                            {customer.email || "—"}
                          </p>
                        </div>
                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu === customer.id ? null : customer.id,
                                )
                              }
                              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {openMenu === customer.id && (
                              <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
                                {/* View */}

                                <Link
                                  href={`/dashboard/customers/${customer.id}`}
                                  className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  <Eye size={12} />
                                  View Details
                                </Link>

                                {/* Edit */}

                                <Link
                                  href={`/dashboard/customers/${customer.id}/edit`}
                                  className="flex w-full items-center gap-1.5 rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50"
                                >
                                  <Edit3 size={12} />
                                  Edit
                                </Link>

                                {/* Delete */}

                                <button
                                  type="button"
                                  onClick={() => handleDelete(customer.id)}
                                  className="flex w-full cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-left text-xs text-red-500 hover:bg-slate-50"
                                >
                                  <Trash2 size={12} />
                                  Delete
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
                <div key={customer.id} className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-semibold text-emerald-700">
                      {getInitials(customer.name)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {customer.name || "—"}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-400">
                        ID: #{customer.id}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                        <Phone size={13} />
                        <span className="text-[10px] uppercase">Phone</span>
                      </div>

                      <p className="truncate text-xs font-medium text-slate-700">
                        {customer.phone || "—"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
                        <Mail size={13} />
                        <span className="text-[10px] uppercase">Email</span>
                      </div>

                      <p className="truncate text-xs font-medium text-slate-700">
                        {customer.email || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {/* View */}

                    <Link
                      href={`/dashboard/customers/${customer.id}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Eye size={14} />
                      View
                    </Link>

                    {/* Edit */}

                    <Link
                      href={`/dashboard/customers/${customer.id}/edit`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <Edit3 size={14} />
                      Edit
                    </Link>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={() => handleDelete(customer.id)}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 py-2 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 size={14} />
                      Delete
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

                <p className="mt-1 text-xs text-slate-400">
                  Try changing your search.
                </p>

                {search && (
                  <button
                    type="button"
                    onClick={() => handleSearch("")}
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
                  </span>{" "}
                  to{" "}
                  <span className="font-medium text-slate-600">
                    {showingTo}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-slate-600">
                    {filteredTotal}
                  </span>{" "}
                  customers
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

      {/* Delete Modal */}

      <ConfirmModal
        open={confirmModal.open}
        title="Delete Customer?"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText={deleteLoading ? "Deleting..." : "Delete Customer"}
        cancelText="Cancel"
        danger={true}
        onCancel={() =>
          setConfirmModal({
            open: false,
            customerId: null,
          })
        }
        onConfirm={confirmDelete}
      />
    </div>
  );
}
