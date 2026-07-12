import { redirect } from "next/navigation";
import { getSessionUser } from "../getSessionUser";
import isAdmin from "../isAdmin";
import BitacoraClient from "./BitacoraClient";

export default async function Bitacora() {
  const user = await getSessionUser();
  if (!user || !isAdmin(user.rol_id)) {
    redirect("/protected/search");
  }

  const endpoint = process.env.BACKEND_URL + "/allNotifications";
  const response = await fetch(endpoint, { cache: "no-store" });
  const notifications = await response.json();

  return <BitacoraClient notifications={notifications} />;
}
