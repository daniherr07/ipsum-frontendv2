"use server";

export async function updateAction(formData) {
  const endpoint = process.env.BACKEND_URL + "/updateUsers";

  const data = Object.fromEntries(formData.entries());

  const userUpdate = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((err) => {
    throw new Error("no se pudo actualizar el usuario" + err);
  });
}
