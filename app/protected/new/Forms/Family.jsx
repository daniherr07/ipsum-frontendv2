import { Search, Plus } from "lucide-react";

export default function Family() {
  return (
    <>
      <div className="btn btn-primary shadow-sm flex w-full">
        <p>Agregar Miembro de la Familia</p>
        <Plus></Plus>
      </div>

      <div className="collapse bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title font-semibold">Daniel Gutiérrez</div>
        <div className="collapse-content text-sm"></div>
      </div>

      <div className="collapse bg-base-100 border border-base-300">
        <input type="radio" name="my-accordion-1" />
        <div className="collapse-title font-semibold">
          I forgot my password. What should I do?
        </div>
        <div className="collapse-content text-sm">
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="card bg-base-200 w-full shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <div className="">
              <h1 className="card-title">Daniel Gutérrez Herrera</h1>
              <h2 className="card-title text-sm text-base-content/80">
                402760530 (Nacional)
              </h2>
            </div>

            <div className="flex gap-3">
              <div className="badge badge-soft badge-primary">Adulto Mayor</div>
              <div className="badge badge-soft badge-secondary">
                Discapacidad
              </div>
            </div>

            <fieldset className="fieldset border-base-content/40 rounded-box border p-4">
              <legend className="fieldset-legend">Información</legend>
              <p>Jefe de Familia</p>
              <p>Teléfono: 8590-7276</p>
              <p>Email: dherrera2195@gmail.com</p>
            </fieldset>

            <fieldset className="fieldset border-base-content/40 rounded-box border p-4">
              <legend className="fieldset-legend">Ingresos</legend>
              <p>$5.400</p>
              <p>Tipo de Ingreso: Trabajo Formal</p>
            </fieldset>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">Editar</button>
            </div>
          </div>
        </div>

        <div className="card bg-base-200 w-full shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <div className="">
              <h1 className="card-title">Daniel Gutérrez Herrera</h1>
              <h2 className="card-title text-sm text-base-content/80">
                402760530 (Nacional)
              </h2>
            </div>

            <div className="flex gap-3">
              <div className="badge badge-soft badge-primary">Adulto Mayor</div>
              <div className="badge badge-soft badge-secondary">
                Discapacidad
              </div>
            </div>

            <fieldset className="fieldset border-base-content/40 rounded-box border p-4">
              <legend className="fieldset-legend">Información</legend>
              <p>Jefe de Familia</p>
              <p>Teléfono: 8590-7276</p>
              <p>Email: dherrera2195@gmail.com</p>
            </fieldset>

            <fieldset className="fieldset border-base-content/40 rounded-box border p-4">
              <legend className="fieldset-legend">Ingresos</legend>
              <p>$5.400</p>
              <p>Tipo de Ingreso: Trabajo Formal</p>
            </fieldset>

            <div className="card-actions justify-end">
              <button className="btn btn-primary">Editar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function FamilyAdd() {
  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Información Familiar</h2>

        <fieldset className="fieldset border-base-content/40 rounded-box w-xs border p-4 gap-3">
          <legend className="fieldset-legend">Información Personal</legend>

          <label className="label">Tipo de Identificación</label>
          <select
            defaultValue="Seleccione el tipo de identificación"
            className="select"
          >
            <option disabled={true}>
              Seleccione el tipo de identificación
            </option>
            <option>Nacional</option>
            <option>DIMEX</option>
            <option>B</option>
          </select>

          <label className="label">Identificación</label>
          <div className="join">
            <input
              type="text"
              className="input join-item"
              placeholder="0-0000-0000"
            />
            <div className="join-item bg-primary btn">
              <Search className=""></Search>
            </div>
          </div>
        </fieldset>
      </div>
    </div>
  );
}
