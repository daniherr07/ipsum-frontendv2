'use server'
export default async function getFamilyData(proyecto_id) {

  const endpoint = process.env.BACKEND_URL + `/projectData/${proyecto_id}`;
  const projectData = await fetch(endpoint);
  const result = await projectData.json();
  return result.familiesData;
}
