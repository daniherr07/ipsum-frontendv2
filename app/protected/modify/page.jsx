import SelectClient from "./SelectClient";


export default async function Modify({ searchParams }) {
  const query = await searchParams;

  return (
    <div className="w-full h-fit flex flex-col items-center p-3">
      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">Mostrar:</legend>
        <SelectClient type={query.type} /> 
      </fieldset>
    </div>
  );
}
