"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const TIPO_LABELS = {
  proyecto_creado: "Proyecto creado",
  cambio_etapa: "Cambio de etapa",
  manual: "Notificación manual",
};

function formatDate(value) {
  // timeZone explícito: esta lista se llena con datos reales desde el
  // servidor (no después de montar), así que sin esto el HTML del servidor
  // (Vercel, otra zona horaria) y el primer render del navegador (Costa
  // Rica) formatean la misma fecha distinto — mismatch de hidratación
  // (React error #418).
  return new Date(value).toLocaleString("es-CR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Costa_Rica",
  });
}

// Bitácora de solo lectura: reutiliza la misma tabla "notificaciones" que
// alimenta la campanita, pero mostrando TODO el sistema (no solo lo del
// usuario actual). No hay ninguna acción de editar/borrar a propósito —
// es un registro histórico, no un panel de administración de datos.
export default function BitacoraClient({ notifications }) {
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (tipoFilter !== "todos" && n.tipo !== tipoFilter) return false;

      if (search) {
        const haystack = [
          n.titulo,
          n.mensaje,
          n.proyecto_nombre,
          n.destinatario_nombre,
          n.remitente_nombre,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(search.toLowerCase())) return false;
      }

      return true;
    });
  }, [notifications, tipoFilter, search]);

  return (
    <main className="flex p-3 flex-col gap-3 items-center w-full max-w-3xl mx-auto">
      <h1 className="font-bold text-lg mt-3">Bitácora de Movimientos del Sistema</h1>
      <p className="text-xs opacity-60 text-center">
        Registro de solo lectura: proyectos creados, cambios de etapa y
        notificaciones manuales enviadas entre usuarios.
      </p>

      <div className="w-full flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          className="input w-full"
          placeholder="Buscar por proyecto, persona o mensaje..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select w-full sm:w-64"
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
        >
          <option value="todos">Todos los tipos</option>
          <option value="proyecto_creado">Proyecto creado</option>
          <option value="cambio_etapa">Cambio de etapa</option>
          <option value="manual">Notificación manual</option>
        </select>
      </div>

      <div className="w-full flex flex-col gap-2">
        {filtered.length === 0 && (
          <p className="text-center opacity-60 py-10">
            No hay movimientos que coincidan con el filtro.
          </p>
        )}

        {filtered.map((n) => (
          <div
            key={n.id}
            className="bg-base-200 border border-base-300 rounded-box p-3 flex flex-col gap-1"
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="badge badge-sm badge-outline">
                {TIPO_LABELS[n.tipo] || n.tipo}
              </span>
              <span className="text-[11px] opacity-50">
                {formatDate(n.created_at)}
              </span>
            </div>

            <p className="font-semibold text-sm">{n.titulo}</p>
            {n.mensaje && <p className="text-xs opacity-80">{n.mensaje}</p>}

            <div className="text-[11px] opacity-70 flex flex-wrap gap-x-3">
              {n.proyecto_nombre && (
                <span>
                  Proyecto:{" "}
                  {n.proyecto_id ? (
                    <Link
                      href={`/protected/edit/${n.proyecto_id}`}
                      className="link"
                    >
                      {n.proyecto_nombre}
                    </Link>
                  ) : (
                    n.proyecto_nombre
                  )}
                </span>
              )}
              {n.destinatario_nombre && <span>Para: {n.destinatario_nombre}</span>}
              {n.remitente_nombre && <span>De: {n.remitente_nombre}</span>}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
