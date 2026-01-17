"use server";

export async function loginAction(formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const endpoint = process.env.BACKEND_URL + "/login";

  const userData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username, password: password }),
  });

  

  await new Promise((resolve) => setTimeout(resolve, 3000));
}
