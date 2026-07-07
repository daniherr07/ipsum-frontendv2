"use server";

export async function stageAction(projectID, etapa_id) {


  const endpoint = process.env.BACKEND_URL + "/changeStage";

  const userData = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectID, etapa_id }),
  });
}
