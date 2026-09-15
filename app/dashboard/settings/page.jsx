"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  ShieldCheck,
  Mail,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { getMe, logout, deleteUser } from "@/lib/api";
import ConfirmModal from "@/components/ConfirmModal";

export default function SettingsPage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [logoutLoading, setLogoutLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get current user
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getMe();

        setProfile(response?.data || response);
      } catch (error) {
        toast.error(error.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await logout();

      localStorage.removeItem("token");

      toast.success("Logged out successfully.");

      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Failed to logout.");
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!profile?.id) {
      toast.error("User ID not found.");
      return;
    }

    try {
      setDeleteLoading(true);

      await deleteUser(profile.id);

      localStorage.removeItem("token");

      toast.success("Account deleted successfully.");

      router.push("/login");
    } catch (error) {
      toast.error(error.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="w-full min-w-0 space-y-6 px-5 py-6 lg:px-7">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your account and profile settings.
          </p>
        </div>

        {/* Profile */}
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <User className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Profile
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Your current account information.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-5">
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          ) : profile ? (
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">
                  Name
                </label>

                <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                  <span className="text-sm text-slate-700">
                    {profile.name || "-"}
                  </span>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">
                  Email
                </label>

                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                  <Mail className="h-4 w-4 text-slate-400" />

                  <span className="truncate text-sm text-slate-700">
                    {profile.email || "-"}
                  </span>
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-500">
                  Role
                </label>

                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />

                  <span className="text-sm capitalize text-slate-700">
                    {profile.role || "-"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 text-sm text-slate-500">
              Unable to load profile.
            </div>
          )}
        </section>

        {/* Account */}
        <section className="rounded-2xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <LogOut className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Account
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Sign out from your current account.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              disabled={logoutLoading}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />

              {logoutLoading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </section>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                User Management
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Create, edit and delete salon users.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/dashboard/users")}
              className="cursor-pointer rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              Manage Users
            </button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <ConfirmModal
        open={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout from your account?"
        confirmText={logoutLoading ? "Logging out..." : "Logout"}
        cancelText="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
        danger={true}
      />

      {/* Delete Account Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone."
        confirmText={deleteLoading ? "Deleting..." : "Delete Account"}
        cancelText="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteModal(false)}
        danger={true}
      />
    </>
  );
}
