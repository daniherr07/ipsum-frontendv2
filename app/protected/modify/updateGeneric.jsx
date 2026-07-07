"use server";

export async function updateGenerics(formData) {
  const endpoint = process.env.BACKEND_URL + "/updateGenerics";

  const data = Object.fromEntries(formData.entries());

  console.log(formData)
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).catch((err) => {
    throw new Error("no se pudo actualizar la información genérica" + err);
  });
}
