"use server";
export default async function getNotes(proyecto_id) {
  const endpoint = process.env.BACKEND_URL + `/getBitacora/${proyecto_id}`;
  console.log(`[getNotes] consultando entradas de bitácora del proyecto ${proyecto_id}`);
  const projectData = await fetch(endpoint);
  const result = await projectData.json();
  return result[0];
}
