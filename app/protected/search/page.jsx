import SearchFiltersMobile from "./SearchFiltersMobile";
import { cookies } from "next/headers";

const endpoint = process.env.BACKEND_URL + "/allProjects";

export default async function Search() {
  const response = await fetch(endpoint);
  const projects = await response.json()

  const cookieStore = await cookies();

  const userData = JSON.parse(cookieStore.get("userData").value);
  

  return (
    <div className="w-full h-full">
      <SearchFiltersMobile projects={projects} userData={userData} />
    </div>
  );
}
