"use client";

import {
  Book,
  Users,
  MapPin,
  Building2,
  Smile,
  SkipForward,
} from "lucide-react";

export default function Pagination({
  current,
  setCurrent,
}) {
  // join w-full + flex-1 en cada botón: los 6 pasos reparten el ancho
  // disponible en vez de mantener su ancho intrínseco, así no se
  // desbordan ni se recortan en pantallas angostas.
  return (
    <div className="join w-full">
      <button
        onClick={() => setCurrent(0)}
        aria-label="Información básica"
        className={`join-item btn flex-1 ${current == 0 && "btn-primary btn-soft"}`}
      >
        <Book></Book>
      </button>
      <button
        onClick={() => setCurrent(1)}
        aria-label="Familia"
        className={`join-item btn flex-1 ${current == 1 && "btn-primary btn-soft"}`}
      >
        <Users></Users>
      </button>
      <button
        onClick={() => setCurrent(2)}
        aria-label="Ubicación"
        className={`join-item btn flex-1 ${current == 2 && "btn-primary btn-soft"}`}
      >
        <MapPin></MapPin>
      </button>
      <button
        onClick={() => setCurrent(3)}
        aria-label="Datos administrativos"
        className={`join-item btn flex-1 ${current == 3 && "btn-primary btn-soft"}`}
      >
        <Building2></Building2>
      </button>

      <button
        onClick={() => setCurrent(4)}
        aria-label="Encargados del proyecto"
        className={`join-item btn flex-1 ${current == 4 && "btn-primary btn-soft"}`}
      >
        <Smile></Smile>
      </button>

      <button
        onClick={() => setCurrent(5)}
        aria-label="Cambiar etapa"
        className={`join-item btn flex-1 ${current == 5 && "btn-primary btn-soft"}`}
      >
        <SkipForward></SkipForward>
      </button>

    </div>
  );
}
