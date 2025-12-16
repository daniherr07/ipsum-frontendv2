import Link from "next/link";
import {
  Search,
  Pencil,
  Plus,
  CircleUserRound,
  Bell,
} from "lucide-react";
import { modifyData } from "../../../const";

export default function NavBar() {
  return (
    <div className="navbar bg-base-300 shadow-sm">
      {/** Menu Dropdown Mobiles */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="
            menu menu-sm dropdown-content bg-base-300 rounded-box z-1 mt-3 w-60 p-2 gap-2 shadow 
            **:text-[16px]
            "
          >
            <li className="bg-base-100 flex flex-row items-center justify-start">
              <CircleUserRound size={40} />
              <p>Steven</p>
            </li>
            <li>
              <div className="flex flex-row items-center justify-start">
                <Search size={20} />
                <Link href={"/protected/search"}>Buscar</Link>
              </div>
            </li>
            <li>
              <div className="flex flex-row items-center justify-start">
                <Pencil size={20} />
                <Link href={"/protected/modify"}>Modificar</Link>
              </div>
              <ul className="p-2">
                {modifyData.map((item, index) => (
                  <li key={index}>
                    <Link href={`/protected/modify?type=${item.slug}`} replace={true} shallow={true}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href={"#"} className="text-error">
                Cerrar Sesión
              </Link>
            </li>
          </ul>
        </div>

        <div className="gap-2 items-center justify-center bg-base-100 p-2 rounded shadow-sm hidden lg:flex">
          <CircleUserRound size={30} />
          <p>Steven</p>
        </div>
      </div>

      {/** Menu Centro Escritorio */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/protected/search"}>Buscar</Link>
          </li>
          <li>
            <details>
              <summary>Modificar</summary>
              <ul className="p-2 bg-base-300 w-40 z-1">
                {modifyData.map((item, index) => (
                  <li key={index}>
                    <Link prefetch={false} href={`/protected/modify?type=${item.slug}` }>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
          <li>
            <Link href={"#"} className="text-error">
              Cerrar Sesión
            </Link>
          </li>
        </ul>
      </div>

      {/** Botón a la derecha */}
      <div className="navbar-end flex gap-5 w-full">
        <Bell size={30} className="text-primary" />
        <Link href={"/protected/new"} className="btn btn-primary">
          <Plus size={20} />
          <p>Nuevo Proyecto</p>
        </Link>
      </div>
    </div>
  );
}
