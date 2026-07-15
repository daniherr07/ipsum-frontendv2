"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, CircleUserRound, UserPen, ArrowLeft, Pencil, History } from "lucide-react";
import BackButton from "./BackButton";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";

// Antes este menú se abría/cerraba solo con CSS (:focus-within de daisyUI,
// sin estado de React) — al elegir una opción, el <Link> navegaba pero el
// menú se quedaba visualmente abierto hasta que el usuario tocara afuera,
// porque el layout persiste entre navegaciones dentro de /protected/* y el
// foco nunca se perdía solo. Con estado explícito se puede cerrar apenas se
// elige algo.
export default function MobileMenu({ userId, userName, isUserAdmin }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="dropdown z-300" ref={menuRef}>
      <button
        type="button"
        className="btn btn-ghost lg:hidden"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Menú"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </button>

      {open && (
        <ul
          tabIndex="-1"
          className="
          menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-60 p-2 gap-2 shadow
          **:text-[16px]
          "
        >
          <li className="bg-base-100">
            <UserMenu
              userId={userId}
              userName={userName}
              className="flex flex-row items-center justify-start w-full"
            >
              <CircleUserRound size={40} />
              <p>{userName}</p>
            </UserMenu>
          </li>

          {/* onClick={close} en el <li> (no en el Link): el clic burbujea
              desde el Link/BackButton de adentro sin necesidad de tocar esos
              componentes compartidos. */}
          <li onClick={close}>
            <Link
              href={"/protected/search"}
              className="flex flex-row items-center justify-start"
            >
              <Search size={20} />
              <p>Buscar</p>
            </Link>
          </li>

          {isUserAdmin && (
            <>
              <li onClick={close}>
                <Link
                  href={"/protected/modify"}
                  className="flex flex-row items-center justify-start"
                >
                  <Pencil size={20} />
                  <p>Modificar</p>
                </Link>
              </li>

              <li onClick={close}>
                <Link
                  href={"/protected/users"}
                  className="flex flex-row items-center justify-start"
                >
                  <UserPen size={20} />
                  <p>Usuarios</p>
                </Link>
              </li>

              <li onClick={close}>
                <Link
                  href={"/protected/bitacora"}
                  className="flex flex-row items-center justify-start"
                >
                  <History size={20} />
                  <p>Bitácora</p>
                </Link>
              </li>
            </>
          )}

          <li onClick={close}>
            <BackButton className="flex flex-row items-center justify-start">
              <ArrowLeft size={20} />
              <p>Regresar</p>
            </BackButton>
          </li>

          <li>
            <ThemeToggle
              className="flex flex-row items-center justify-start w-full"
              showLabel
            />
          </li>
        </ul>
      )}
    </div>
  );
}
