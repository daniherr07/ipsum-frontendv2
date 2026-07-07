'use server'
export default async function getGenericsData(table) {

  const endpoint = process.env.BACKEND_URL + `/generics/${table}`;
  const projectData = await fetch(endpoint);
  const result = await projectData.json();
  return result;
}
