import { redirect } from "next/navigation";
import UsersClient from "./UsersClient";
import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";


export default async function users(){
    // Antes esta página solo estaba "escondida" del menú para no-admins,
    // pero cualquiera que conociera la URL podía entrar y administrar
    // usuarios igual. Se valida el rol acá, del lado del servidor.
    const user = await getSessionUser();
    if (!user || !isAdmin(user.rol_id)) {
      redirect("/protected/search");
    }

    const endpoint = process.env.BACKEND_URL + "/selectUsers";
    const response = await fetch(endpoint)
    const usersData = await response.json()

    return(<UsersClient usersData={usersData} />)
}