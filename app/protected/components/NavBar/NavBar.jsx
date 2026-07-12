import Link from "next/link";
import { Search, Plus, CircleUserRound, UserPen, X, Pencil, History } from "lucide-react";
import Form from "next/form";
import { modifyData } from "../../../const";
import NewProjectModal from "./NewProjectModal";
import NotificationsBell from "./NotificationsBell";
import { cookies } from "next/headers";
import { logOffAction } from "./logOffAction";
import isAdmin from "../../isAdmin";
import ModifyDesktopMenu from "./ModifyDesktopMenu";

export default async function NavBar() {
  const cookieStore = await cookies();

  const cookieData = cookieStore.get("userData");
  const userData = JSON.parse(cookieData.value);
  const userName = userData.nombre;
  const isUserAdmin = isAdmin(userData.rol_id);
  const modifyMenuItems = modifyData.map(({ slug, label }) => ({ slug, label }));

  return (
    <div className="navbar bg-base-300 shadow-sm px-2 xl:px-4 gap-2 lg:gap-4 overflow-visible">
      {/** Menu Dropdown Mobiles */}
      <div className="navbar-start lg:flex-1">
        <div className="dropdown z-300">
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
              <p>{userName}</p>
            </li>
            <li>
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
                <li>
                  <Link
                    href={"/protected/modify"}
                    className="flex flex-row items-center justify-start"
                  >
                    <Pencil size={20} />
                    <p>Modificar</p>
                  </Link>
                </li>

                <li>
                  <Link
                    href={"/protected/users"}
                    className="flex flex-row items-center justify-start"
                  >
                    <UserPen size={20} />
                    <p>Usuarios</p>
                  </Link>
                </li>

                <li>
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

            <li>
              <Form action={logOffAction} className="text-error">
                <button type="submit" className="btn btn-error btn-soft">
                  Cerrar Sesión
                </button>
              </Form>
            </li>
          </ul>
        </div>

        {/* En escritorio el cierre de sesión queda junto al bloque de usuario para acceso rápido */}
        <div className="items-center justify-center bg-base-100 p-2 rounded shadow-sm hidden lg:flex gap-2">
          <Form action={logOffAction}>
            <button
              type="submit"
              className="btn btn-error btn-square btn-sm text-white"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              <X size={16} color="white" />
            </button>
          </Form>
          <div className="flex items-center gap-2">
            <CircleUserRound size={30} />
            <p>{userName}</p>
          </div>
        </div>
      </div>

      {/** Menu Centro Escritorio */}
      <div className="navbar-center hidden lg:flex flex-none justify-center">
        <ul className="flex items-center gap-2 xl:gap-3">
          <li className="list-none">
            <Link
              href={"/protected/search"}
              className="btn btn-ghost bg-base-100 inline-flex items-center gap-2"
            >
              <Search size={18} />
              Buscar
            </Link>
          </li>

          {isUserAdmin && (
            <>
              <li className="list-none">
                <ModifyDesktopMenu items={modifyMenuItems} />
              </li>
              <li className="list-none">
                <Link
                  href={"/protected/users"}
                  className="btn btn-ghost bg-base-100 inline-flex items-center gap-2"
                >
                  <UserPen size={18} />
                  Usuarios
                </Link>
              </li>
              <li className="list-none">
                <Link
                  href={"/protected/bitacora"}
                  className="btn btn-ghost bg-base-100 inline-flex items-center gap-2"
                >
                  <History size={18} />
                  Bitácora
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      {/** Botón a la derecha */}
      <div className="navbar-end flex-none ml-auto flex items-center gap-2 lg:gap-3 lg:flex-1 lg:justify-end">
        <NotificationsBell userId={userData.id} />

        <label htmlFor="newProjectModal" className="btn btn-primary">
          <Plus size={20} />
          <p className="hidden sm:block">Nuevo Proyecto</p>
        </label>

        {/* Put this part before </body> tag */}
        <NewProjectModal />
      </div>
    </div>
  );
}
