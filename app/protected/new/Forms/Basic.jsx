export default function Basic() {
  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Información Básica</h2>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Tipo de Bono</legend>
          <select defaultValue="Seleccione tipo de bono" className="select">
            <option disabled={true}>Seleccione tipo de bono</option>
            <option>Artículo 59</option>
            <option>A</option>
            <option>B</option>
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Agrupación</legend>
          <select defaultValue="Seleccione tipo de bono" className="select">
            <option disabled={true}>Seleccione un tipo de agrupación</option>
            <option>Sin agrupar</option>
            <option>Grupo A</option>
            <option>Grupo B</option>
          </select>
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend">Descripción Corta</legend>
          <textarea className="textarea" placeholder="..."></textarea>
        </fieldset>

        <fieldset className="fieldset">
          <label className="label">
            <input type="checkbox" defaultChecked className="checkbox" />
            <p className="font-bold text-base-content">Tiene FIS</p>
          </label>
        </fieldset>
      </div>
    </div>
  );
}
