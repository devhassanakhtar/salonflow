"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/lib/api";

import Pagination from "@/components/Pagination";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [currentPage]);

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const response = await getNotifications(currentPage);

      setNotifications(response?.data || []);
      setTotalPages(response?.meta?.last_page || 1);
    } catch (error) {
      toast.error(
        error.message || "Failed to load notifications."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (notification) => {
    if (notification.read_at) return;

    try {
      setReadingId(notification.id);

      await markNotificationAsRead(notification.id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? {
                ...item,
                read_at: new Date().toISOString(),
              }
            : item
        )
      );

      toast.success("Notification marked as read.");
    } catch (error) {
      toast.error(
        error.message || "Failed to mark notification as read."
      );
    } finally {
      setReadingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read_at:
            item.read_at || new Date().toISOString(),
        }))
      );

      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(
        error.message || "Failed to mark all notifications as read."
      );
    } finally {
      setMarkingAll(false);
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read_at
  ).length;

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Bell size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Notifications
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Stay updated with your salon activity.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={markingAll || unreadCount === 0}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCheck size={17} />

          {markingAll
            ? "Marking..."
            : "Mark all as read"}
        </button>
      </div>

      {/* Unread Count */}
      {!loading && (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500">
            You have{" "}
            <span className="font-semibold text-slate-900">
              {unreadCount}
            </span>{" "}
            unread notification
            {unreadCount !== 1 ? "s" : ""}.
          </p>
        </div>
      )}

      {/* Notifications */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Bell
                size={24}
                className="text-slate-400"
              />
            </div>

            <h3 className="text-sm font-semibold text-slate-900">
              No notifications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              You don't have any notifications yet.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => {
                const isRead = Boolean(
                  notification.read_at
                );

                return (
                  <div
                    key={notification.id}
                    className={`flex flex-col gap-4 px-5 py-5 transition md:flex-row md:items-center md:justify-between ${
                      isRead
                        ? "bg-white"
                        : "bg-emerald-50/40"
                    }`}
                  >

                    <div className="flex gap-4">

                      <div
                        className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isRead
                            ? "bg-slate-100 text-slate-400"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        <Bell size={17} />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-slate-900">
                            {notification.title ||
                              "Notification"}
                          </h3>

                          {!isRead && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                              New
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {notification.message ||
                            notification.description ||
                            "You have a new notification."}
                        </p>

                        {notification.created_at && (
                          <p className="mt-2 text-xs text-slate-400">
                            {new Date(
                              notification.created_at
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {!isRead && (
                      <button
                        type="button"
                        onClick={() =>
                          handleMarkRead(notification)
                        }
                        disabled={
                          readingId === notification.id
                        }
                        className="flex cursor-pointer items-center justify-center gap-2 self-start rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 md:self-center"
                      >
                        <Check size={14} />

                        {readingId === notification.id
                          ? "Reading..."
                          : "Mark as read"}
                      </button>
                    )}
                  </div>
                );
              })}
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
    </div>
  );
}