"use client";

import {
  Search,
  Bell,
  Menu,
} from "lucide-react";

export default function TopHeader({
  onMenuClick,
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-[#f7f8f7]/95 px-4 py-3 backdrop-blur-xl md:px-8">

      <div className="flex h-11 items-center justify-between gap-3">

        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {/* Desktop Search */}
        <div className="relative hidden w-full max-w-xl lg:block">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search customers, appointments..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-16 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-400">
            ⌘ K
          </span>

        </div>

        {/* Mobile search */}
        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 lg:hidden"
          aria-label="Search"
        >
          <Search size={19} />
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Notification */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            aria-label="Notifications"
          >

            <Bell size={18} />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />

          </button>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-slate-200 sm:block" />

          {/* Admin */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              A
            </div>

            <div className="hidden sm:block">

              <p className="text-sm font-semibold text-slate-800">
                Admin
              </p>

              <p className="text-xs text-slate-400">
                Administrator
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}