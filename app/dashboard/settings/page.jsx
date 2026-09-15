"use client";

import { useState } from "react";
import {
  User,
  KeyRound,
  LogOut,
  Plus,
  Trash2,
  ShieldCheck,
  Mail,
} from "lucide-react";

const initialTokens = [
  {
    id: 1,
    name: "my-frontend",
    abilities: ["read", "write"],
    expires_at: "2027-01-01",
    created_at: "Sep 10, 2026",
  },
];

export default function SettingsPage() {
  const [tokens, setTokens] = useState(initialTokens);
  const [showCreateToken, setShowCreateToken] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenExpiry, setTokenExpiry] = useState("");

  const [profile] = useState({
    name: "Admin",
    email: "admin@salonflow.test",
    role: "admin",
  });

  const handleCreateToken = (e) => {
    e.preventDefault();

    if (!tokenName.trim()) return;

    const newToken = {
      id: Date.now(),
      name: tokenName.trim(),
      abilities: ["read", "write"],
      expires_at: tokenExpiry || "Never",
      created_at: "Sep 10, 2026",
    };

    setTokens((current) => [...current, newToken]);
    setTokenName("");
    setTokenExpiry("");
    setShowCreateToken(false);
  };

  const handleRevokeToken = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to revoke this token?"
    );

    if (!confirmed) return;

    setTokens((current) => current.filter((token) => token.id !== id));
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    console.log("Logout API: POST /v1/auth/logout");

    // Backend connect karte waqt:
    // POST /v1/auth/logout
  };

  return (
     <div className="w-full min-w-0 space-y-6 px-5 py-6 lg:px-7">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account and API access.
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

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">
              Name
            </label>

            <div className="flex h-11 items-center rounded-xl border border-slate-200 bg-slate-50 px-3.5">
              <span className="text-sm text-slate-700">
                {profile.name}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">
              Email
            </label>

            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
              <Mail className="h-4 w-4 text-slate-400" />

              <span className="truncate text-sm text-slate-700">
                {profile.email}
              </span>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium text-slate-500">
              Role
            </label>

            <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />

              <span className="text-sm capitalize text-slate-700">
                {profile.role}
              </span>
            </div>
          </div>
        </div>
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
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
}