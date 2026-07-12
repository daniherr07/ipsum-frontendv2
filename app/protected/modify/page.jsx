import { redirect } from "next/navigation";
import SelectClient from "./SelectClient";
import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";


export default async function Modify({ searchParams }) {
  const query = await searchParams;

  // Igual que en /protected/users: antes solo estaba oculta del menú, no
  // protegida — cualquiera con la URL podía entrar.
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    redirect("/protected/search");
  }

  return (
    <div className="w-full h-fit flex flex-col items-center p-3">
      {/* max-w-2xl: evita que el panel se estire a todo el ancho en monitores grandes */}
      <fieldset className="fieldset w-full max-w-2xl">
        <legend className="fieldset-legend">Mostrar:</legend>
        <SelectClient type={query.type} />
      </fieldset>
    </div>
  );
}
