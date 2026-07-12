"use server";

export default async function getLocationImages(proyecto_id) {
  const endpoint = process.env.BACKEND_URL + `/locationImages/${proyecto_id}`;
  const res = await fetch(endpoint);
  return res.json();
}
