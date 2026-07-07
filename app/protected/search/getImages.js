"use server";
export default async function getImages(proyecto_id) {
  const endpoint = process.env.BACKEND_URL + `/projectImages/${proyecto_id}`;
  const projectData = await fetch(endpoint);
  const result = await projectData.json();
  console.log(result)
  return result;
}
