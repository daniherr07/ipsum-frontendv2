"use server";

export async function saveInfo(
  basicsForm,
  locationForm,
  adminForm,
  peopleForm,
  projectID,
) {
  

  const basicsEndpoint = process.env.BACKEND_URL + "/insertBasics";

  await fetch(basicsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ basicsForm, proyecto_id: projectID }),
  });

  
  const locationsEndpoint = process.env.BACKEND_URL + "/insertLocations";

  await fetch(locationsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ locationForm, proyecto_id: projectID }),
  });

  const adminsEndpoint = process.env.BACKEND_URL + "/insertAdmins";

  await fetch(adminsEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminForm, proyecto_id: projectID }),
  });

  const peopleEndpoint = process.env.BACKEND_URL + "/insertPeople";

  await fetch(peopleEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ peopleForm, proyecto_id: projectID }),
  });
}
