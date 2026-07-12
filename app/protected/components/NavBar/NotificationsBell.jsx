"use client";

import useSWR from "swr";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
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
  // Antes el panel se mostraba/ocultaba solo con CSS (:focus-within de
  // daisyUI, sin estado de React). Eso significa que "cerrado" era nada más
  // un cambio visual (opacity/scale) — el elemento seguía en el DOM y en el
  // mismo lugar, así que al agrandarlo para que se viera bien en móvil
  // (position:fixed cubriendo buena parte de la pantalla) esa zona
  // "invisible" pero todavía interactiva tapaba clics de lo que hubiera
  // debajo. Con estado explícito, cuando está cerrado el panel ni siquiera
  // se renderiza.
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const { data, mutate } = useSWR(
    userId ? ["notifications", userId] : null,
    () => getNotifications(userId),
    // refreshInterval: no hay websockets/SSE (el backend corre serverless en
    // Vercel, sin conexiones persistentes), así que un poll cada 30s es la
    // forma simple y confiable de mantener el conteo al día.
    { refreshInterval: 30000 },
  );

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleClickNotification = async (notification) => {
    setOpen(false);
    if (notification.leido) return;
    await markNotificationRead(notification.id, userId);
    mutate();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(userId);
    mutate();
  };

  // preventDefault + stopPropagation: el botón vive al lado del <Link> de la
  // notificación (no adentro — un <button> dentro de un <a> es HTML
  // inválido), pero comparten la misma fila, así que hay que evitar que el
  // clic también dispare la navegación/marcado-como-leída del Link.
  const handleDelete = async (e, notificationId) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteNotification(notificationId, userId);
    mutate();
  };

  const handleDeleteAll = async () => {
    await deleteAllNotifications(userId);
    mutate();
  };

  return (
    <div className="relative z-300" ref={containerRef}>
      <button
        type="button"
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((prev) => !prev)}
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
      </button>

      {open && (
        // El dropdown normal de daisyUI ancla su borde derecho al del botón
        // de la campana, no al de la pantalla — y ese botón no es lo último
        // a la derecha del navbar (el botón "+" de Nuevo Proyecto está más a
        // la derecha), así que el panel crecía hacia la izquierda desde un
        // punto ya corrido, saliéndose por el borde izquierdo en pantallas
        // angostas. En vez de calcular ese offset, en móvil se usa
        // position:fixed anclado a la propia pantalla (no al botón); en sm:
        // y para arriba vuelve a un dropdown normal anclado al ícono.
        <div className="fixed left-2 right-2 top-[4.5rem] sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-96 bg-base-100 border border-base-300 rounded-box shadow-2xl flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b border-base-300 gap-2 flex-wrap">
            <span className="font-semibold text-sm">Notificaciones</span>
            <div className="flex items-center gap-3 flex-wrap">
              {unreadCount > 0 && (
                <button
                  type="button"
                  className="text-xs text-primary"
                  onClick={handleMarkAllRead}
                >
                  Marcar todas como leídas
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  className="text-xs text-error"
                  onClick={handleDeleteAll}
                >
                  Borrar todas
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[65vh] sm:max-h-96 overflow-y-auto overflow-x-hidden p-2 flex flex-col gap-1">
            {notifications.length === 0 && (
              <p className="text-xs opacity-60 p-3 text-center">
                Sin notificaciones
              </p>
            )}

            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative rounded-box text-sm min-w-0 ${
                  notification.leido ? "opacity-60" : "bg-base-200"
                }`}
              >
                <Link
                  href={
                    notification.proyecto_id
                      ? `/protected/edit/${notification.proyecto_id}`
                      : "#"
                  }
                  onClick={() => handleClickNotification(notification)}
                  className="flex flex-col gap-0.5 p-2 pr-8 min-w-0 rounded-box transition-colors hover:bg-base-300"
                >
                  <span className="font-semibold truncate">
                    {notification.titulo}
                  </span>
                  {notification.mensaje && (
                    <span className="text-xs opacity-80 line-clamp-2">
                      {notification.mensaje}
                    </span>
                  )}
                  {(notification.proyecto_nombre || notification.remitente_nombre) && (
                    <span className="text-[11px] opacity-70 truncate">
                      {notification.proyecto_nombre && (
                        <>Proyecto: {notification.proyecto_nombre}</>
                      )}
                      {notification.proyecto_nombre && notification.remitente_nombre && " · "}
                      {notification.remitente_nombre && (
                        <>De: {notification.remitente_nombre}</>
                      )}
                    </span>
                  )}
                  <span className="text-[10px] opacity-50">
                    {formatDate(notification.created_at)}
                  </span>
                </Link>

                <button
                  type="button"
                  className="btn btn-ghost btn-xs btn-circle absolute top-1 right-1"
                  onClick={(e) => handleDelete(e, notification.id)}
                  aria-label="Borrar notificación"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
