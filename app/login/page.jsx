"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight, Scissors } from "lucide-react";
import { loginRequest } from "../../lib/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginRequest(email, password);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="fixed inset-0 overflow-hidden bg-[#f7faf9]">
      <div className="flex h-full w-full">
        <section className="relative hidden w-[48%] overflow-hidden bg-[#073b2a] lg:flex">
          {/* Decorative shapes */}
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-emerald-400/10" />
          <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-300/10" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/30">
                <Scissors className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-semibold tracking-tight text-white">
                  SalonFlow
                </h1>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-emerald-200/70">
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Main message */}
            <div className="max-w-lg">
              <p className="mb-4 text-sm font-medium text-emerald-300">
                SALON MANAGEMENT
              </p>

              <h2 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
                Everything your salon needs,
                <span className="text-emerald-300"> in one place.</span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-6 text-emerald-100/65">
                Manage appointments, customers, services, staff and your daily
                salon operations from a single workspace.
              </p>

              {/* Small feature row */}
              <div className="mt-7 flex flex-wrap gap-2">
                {["Appointments", "Customers", "Staff", "Queue"].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-emerald-100/80"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-emerald-100/40">
              © 2026 SalonFlow. All rights reserved.
            </p>
          </div>
        </section>

        {/* Login section */}
        <section className="flex h-full flex-1 items-center justify-center overflow-y-auto px-5 py-6 sm:px-8 lg:overflow-hidden lg:px-12">
          <div className="w-full max-w-[430px]">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  SalonFlow
                </h1>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Admin Portal
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600">
                Welcome back
              </p>

              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-5 text-slate-500">
                Enter your details to access your SalonFlow dashboard.
              </p>
            </div>

            {/* Login card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] sm:p-7">
              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@salonflow.test"
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

                {/* Remember */}
                <div className="flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 accent-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs text-slate-500">Remember me</span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700 active:scale-[0.99] cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign in"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </form>
            </div>

            {/* Bottom text */}
            <p className="mt-6 text-center text-xs text-slate-400">
              Secure access to your SalonFlow workspace
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
