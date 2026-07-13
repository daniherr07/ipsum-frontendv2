"use client";

import Link from "next/link";
import { ChevronDown, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ModifyDesktopMenu({ items }) {
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // pointerdown (no mousedown + touchstart por separado): en dispositivos
    // híbridos (laptop con pantalla táctil) un mismo toque puede o no
    // sintetizar un mousedown de forma confiable, y tener dos listeners
    // separados escuchando el mismo gesto es justo el tipo de cosa que
    // produce comportamiento intermitente ("a veces sí, a veces no").
    // pointerdown unifica mouse/touch/lápiz en un solo evento.
    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="btn btn-ghost bg-base-100 inline-flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prevIsOpen) => !prevIsOpen)}
      >
        <Pencil size={18} />
        Modificar
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <ul className="menu absolute top-full left-0 p-2 bg-base-300 rounded-box w-56 z-[80] shadow-lg mt-2">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                prefetch={false}
                href={`/protected/modify?type=${item.slug}`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
