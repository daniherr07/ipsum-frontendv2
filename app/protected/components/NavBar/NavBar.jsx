import Link from "next/link";
import { Search, Plus, CircleUserRound, UserPen, ArrowLeft, History } from "lucide-react";
import { modifyData } from "../../../const";
import NewProjectModal from "./NewProjectModal";
import NotificationsBell from "./NotificationsBell";
import { cookies } from "next/headers";
import BackButton from "./BackButton";
import UserMenu from "./UserMenu";
import ThemeToggle from "./ThemeToggle";
import MobileMenu from "./MobileMenu";
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
        <MobileMenu userId={userData.id} userName={userName} isUserAdmin={isUserAdmin} />

        {/* En escritorio: flecha para regresar + bloque de usuario (dale
            clic para cerrar sesión, con modal de confirmación de por medio) */}
        <div className="items-center justify-center bg-base-100 p-2 rounded shadow-sm hidden lg:flex gap-2">
          <BackButton className="btn btn-ghost btn-square btn-sm">
            <ArrowLeft size={16} />
          </BackButton>
          <UserMenu userId={userData.id} userName={userName} className="flex items-center gap-2">
            <CircleUserRound size={30} />
            <p>{userName}</p>
          </UserMenu>
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
        <ThemeToggle className="btn btn-ghost btn-circle" />

        <NotificationsBell userId={userData.id} />

        <label htmlFor="newProjectModal" className="btn btn-primary">
          <Plus size={20} />
          <p className="hidden sm:block">Nuevo Proyecto</p>
        </label>

        {/* Put this part before </body> tag */}
        <NewProjectModal currentUserId={userData.id} />
      </div>
    </div>
  );
}
