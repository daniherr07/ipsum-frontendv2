"use server";

export default async function getLocationImages(proyecto_id) {
  const endpoint = process.env.BACKEND_URL + `/locationImages/${proyecto_id}`;
  console.log(`[getLocationImages] consultando imágenes de ubicación del proyecto ${proyecto_id}`);
  const res = await fetch(endpoint);
  return res.json();
}
