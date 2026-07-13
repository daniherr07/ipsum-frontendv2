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
      // Sin preferencia guardada, el tema "dark" tiene prefersdark:true en
      // daisyUI: la página se ve oscura por CSS (@media prefers-color-scheme)
      // sin que <html> tenga nunca un atributo data-theme explícito. Antes
      // esto se detectaba leyendo document.documentElement.getAttribute
      // ("data-theme"), que en este caso SIEMPRE da null y caía al "light"
      // por defecto — el estado interno decía "claro" mientras la página se
      // veía oscura. El primer clic solo corregía ese desajuste (sin cambiar
      // nada visualmente); recién el segundo clic aplicaba el cambio real.
      current = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Deja el atributo explícito desde el arranque para que el estado de
    // React y el del DOM nunca se desincronicen, sin depender de que el
    // usuario haga clic primero.
    document.documentElement.setAttribute("data-theme", current);
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
