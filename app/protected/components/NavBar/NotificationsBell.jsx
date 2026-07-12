"use client";

import useSWR from "swr";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "./notificationsActions";

function formatDate(value) {
  return new Date(value).toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsBell({ userId }) {
  // refreshInterval: no hay websockets/SSE (el backend corre serverless en
  // Vercel, sin conexiones persistentes), así que un poll cada 30s es la
  // forma simple y confiable de mantener el conteo al día.
  const { data, mutate } = useSWR(
    userId ? ["notifications", userId] : null,
    () => getNotifications(userId),
    { refreshInterval: 30000 },
  );

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  const handleClickNotification = async (notification) => {
    if (notification.leido) return;
    await markNotificationRead(notification.id, userId);
    mutate();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(userId);
    mutate();
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle"
        aria-label="Notificaciones"
      >
        <div className="indicator">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="badge badge-sm badge-primary indicator-item">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>

      <div
        tabIndex="-1"
        className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-80 max-h-96 overflow-y-auto p-2 gap-1 shadow"
      >
        <div className="flex items-center justify-between px-2 py-1">
          <span className="font-semibold text-sm">Notificaciones</span>
          {unreadCount > 0 && (
            <button
              type="button"
              className="text-xs text-primary"
              onClick={handleMarkAllRead}
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        {notifications.length === 0 && (
          <p className="text-xs opacity-60 p-3 text-center">
            Sin notificaciones
          </p>
        )}

        {notifications.map((notification) => (
          <Link
            key={notification.id}
            href={
              notification.proyecto_id
                ? `/protected/edit/${notification.proyecto_id}`
                : "#"
            }
            onClick={() => handleClickNotification(notification)}
            className={`flex flex-col gap-0.5 p-2 rounded-box text-sm ${
              notification.leido ? "opacity-60" : "bg-base-200"
            }`}
          >
            <span className="font-semibold">{notification.titulo}</span>
            {notification.mensaje && (
              <span className="text-xs opacity-80 line-clamp-2">
                {notification.mensaje}
              </span>
            )}
            <span className="text-[10px] opacity-50">
              {formatDate(notification.created_at)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
