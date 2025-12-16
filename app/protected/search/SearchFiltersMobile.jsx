import { SlidersHorizontal, Search, X } from "lucide-react";

export default function SearchFiltersMobile() {
  return (
    <div className="w-full h-fit flex items-center justify-between gap-1 p-4">
      <label htmlFor="filtersModal">
        <SlidersHorizontal
          size={40}
          className="bg-primary rounded p-2 h-full aspect-square text-primary-content"
        />
      </label>

      <input type="checkbox" id="filtersModal" className="modal-toggle" />
      <div className="modal modal-bottom" role="dialog">
        <div className="modal-box h-[70dvh] relative px-0 pt-13">
          {/** TODO: Conseguir los filtros usando la api para ponerlos aquí
           * Actualmente usando placeholders
           */}
          <div className="flex flex-col ">
            <details className="collapse collapse-arrow" name="filters-1" open>
              <summary className="collapse-title font-semibold">
                Tipo de Bono
              </summary>
              <div className="collapse-content text-sm">
                <fieldset className="fieldset ">
                  <label className="label">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox"
                    />
                    Art.59
                  </label>
                </fieldset>
              </div>
            </details>

            <div className="divider"></div>

            <details className="collapse collapse-arrow" name="filters-2">
              <summary className="collapse-title font-semibold">Etapa</summary>
              <div className="collapse-content text-sm">
                <fieldset className="fieldset ">
                  <label className="label">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="checkbox"
                    />
                    En Construcción
                  </label>
                </fieldset>
              </div>
            </details>
          </div>

          <div className="modal-action absolute top-3 right-3 m-0">
            <label htmlFor="filtersModal">
              <X size={30}></X>
            </label>
          </div>
        </div>
      </div>

      <div className="divider divider-horizontal"></div>

      <div className="join">
        <label className="input join-item">
          <input type="text" placeholder="Buscar por nombre" />
        </label>

        <button className="btn btn-primary join-item">
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}
