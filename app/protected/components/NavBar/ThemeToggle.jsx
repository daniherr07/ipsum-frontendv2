"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const THEME_KEY = "theme";

// Arranca en null (no en "light"/"dark") para no asumir nada del lado del
// servidor: el tema real se sabe recién en el navegador (localStorage o
// preferencia del sistema), y forzar un valor acá causaría un desajuste de
// hidratación si no coincide. El ícono se actualiza solo, apenas monta.
export default function ThemeToggle({ className, showLabel = false }) {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // localStorage/document no existen durante el render en el servidor:
    // leerlos fuera de un efecto (ej. en el inicializador de useState)
    // rompería la hidratación. Excepción legítima a la regla de abajo,
    // igual que la restauración de filtros en SearchFilters.jsx.
    /* eslint-disable react-hooks/set-state-in-effect */
    let current;
    try {
      current = localStorage.getItem(THEME_KEY);
    } catch {
      current = null;
    }

    if (!current) {
      current = document.documentElement.getAttribute("data-theme") || "light";
    }

    setTheme(current);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Si el navegador bloquea localStorage, el tema simplemente no
      // persiste entre visitas — no debe romper el toggle en la sesión actual.
    }
  };

  return (
    <button
      type="button"
      className={className}
      onClick={toggleTheme}
      aria-label="Cambiar tema claro/oscuro"
      title="Cambiar tema claro/oscuro"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      {showLabel && <p>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</p>}
    </button>
  );
}
