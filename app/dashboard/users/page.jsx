"use client";

import { useEffect, useState } from "react";
import {
  MoreVertical,
  Plus,
  Search,
  Users,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getMe,
  getUsers,
  deleteUser,
} from "@/lib/api";

import Pagination from "@/components/Pagination";
import ConfirmModal from "@/components/ConfirmModal";

export default function UsersPage() {
  const router = useRouter();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState(null);

  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [currentPage, search]);

  const checkAdmin = async () => {
    try {
      const response = await getMe();
      const user = response?.data || response;

      if (user?.role !== "admin") {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers(currentPage, search);

      setUsers(response?.data || []);
      setTotalPages(response?.meta?.last_page || 1);
    } catch (error) {
      toast.error(error.message || "Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteModal(true);
    setOpenMenu(null);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      setDeleting(true);

      await deleteUser(selectedUser.id);

      toast.success("User deleted successfully.");

      setDeleteModal(false);
      setSelectedUser(null);

      loadUsers();
    } catch (error) {
      toast.error(error.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Users
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage salon users and their roles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push("/dashboard/users/create")}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          <Plus size={17} />
          Create User
        </button>
      </div>

      {/* Search */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={handleSearch}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Users size={22} className="text-slate-500" />
            </div>

            <h3 className="text-sm font-semibold text-slate-900">
              No users found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left">

                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      User
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Staff
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="transition hover:bg-slate-50"
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {user.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {user.email}
                          </p>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium capitalize text-emerald-700">
                          {user.role}
                        </span>
                      </td>

                      {/* Staff */}
                      <td className="px-5 py-4">
                        {user.staff ? (
                          <div>
                            <p className="text-sm text-slate-700">
                              {user.staff.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {user.staff.specialization}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">
                            —
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="relative px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === user.id ? null : user.id
                            )
                          }
                          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {openMenu === user.id && (
                          <div className="absolute right-5 top-14 z-20 w-40 rounded-xl border border-slate-200 bg-white p-1.5 text-left shadow-lg">

                            <button
                              type="button"
                              onClick={() => {
                                router.push(
                                  `/dashboard/users/${user.id}/edit`
                                );
                                setOpenMenu(null);
                              }}
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteClick(user)
                              }
                              className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>

                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end border-t border-slate-200 px-5 py-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      <ConfirmModal
        open={deleteModal}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => {
          if (!deleting) {
            setDeleteModal(false);
            setSelectedUser(null);
          }
        }}
        danger={true}
      />

    </div>
  );
}
