"use server";

export default async function getFamilies(proyecto_id) {
  const endpoint = process.env.BACKEND_URL + `/projectFamilies/${proyecto_id}`;
  const projectData = await fetch(endpoint);
  const result = await projectData.json();
  return result;
}
