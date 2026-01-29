export default async function TestDB() {
  const endpoint = process.env.BACKEND_URL + "/test";

  const response = await fetch(endpoint);
  const result = await response.json();

  return <>{response && <p>Si hay respuesta {JSON.stringify(result)}</p>}</>;
}
