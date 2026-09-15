"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  getMe,
  getUser,
  updateUser,
} from "@/lib/api";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "staff",
  });

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const meResponse = await getMe();
      const currentUser = meResponse?.data || meResponse;

      if (currentUser?.role !== "admin") {
        router.replace("/dashboard");
        return;
      }

      loadUser();
    } catch (error) {
      console.error(error);
    }
  };

  const loadUser = async () => {
    try {
      const response = await getUser(id);

      const user = response?.data || response;

      setForm({
        name: user?.name || "",
        email: user?.email || "",
        role: user?.role || "staff",
      });
    } catch (error) {
      toast.error(error.message || "Failed to load user.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return;
    }

    try {
      setSaving(true);

      await updateUser(id, {
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
      });

      toast.success("User updated successfully.");

      router.push("/dashboard/users");
    } catch (error) {
      toast.error(error.message || "Failed to update user.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/users")}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
        </button>

        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Edit User
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Update user information.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6"
      >

        <div className="grid gap-5 md:grid-cols-2">

          {/* Name */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Role
            </label>

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500"
            >
              <option value="staff">Staff</option>
              <option value="receptionist">Receptionist</option>
              <option value="admin">Admin</option>
            </select>
          </div>

        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/users")}
            className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="cursor-pointer rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update User"}
          </button>
        </div>

      </form>

    </div>
  );
}