"use client";

import ubicaciones from "./ubicaciones";

import { useState } from "react";

export default function Location({ locationForm, setLocationForm }) {
  const [section, setSection] = useState(0);
  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <div role="tablist" className="tabs tabs-box">
          <a
            role="tab"
            className={`tab ${section == 0 && "tab-active"}`}
            onClick={() => setSection(0)}
          >
            Información
          </a>

          <a
            role="tab"
            className={`tab ${section == 1 && "tab-active"}`}
            onClick={() => setSection(1)}
          >
            Imágenes
          </a>
        </div>

        {section == 0 && (
          <LocInfo
            locationForm={locationForm}
            setLocationForm={setLocationForm}
          ></LocInfo>
        )}
      </div>
    </div>
  );
}

function LocInfo({ locationForm, setLocationForm }) {
  // Provincias
  const provincias = Object.values(ubicaciones.provincias);

  // Buscar provincia seleccionada
  const provinciaSeleccionada = provincias.find(
    (p) => p.nombre === locationForm.provincia,
  );

  // Cantones de la provincia
  const cantones = provinciaSeleccionada
    ? Object.values(provinciaSeleccionada.cantones)
    : [];

  // Buscar cantón seleccionado
  const cantonSeleccionado = cantones.find(
    (c) => c.nombre === locationForm.canton,
  );

  // Distritos del cantón
  const distritos = cantonSeleccionado
    ? Object.values(cantonSeleccionado.distritos)
    : [];

  return (
    <>
      <h2 className="card-title">Datos del Terreno</h2>

      <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
        <legend className="fieldset-legend">Ubicación</legend>

        {/* PROVINCIA */}
        <label className="label">Provincia</label>
        <select
          className="select"
          value={locationForm.provincia}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              provincia: e.target.value,
              canton: "",
              distrito: "",
            }));
          }}
        >
          <option value="" disabled>
            Seleccione la provincia
          </option>
          {provincias.map((p) => (
            <option key={p.nombre} value={p.nombre}>
              {p.nombre}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>

        {/* CANTÓN */}
        <label className="label">Cantón</label>
        <select
          className="select"
          value={locationForm.canton}
          disabled={!locationForm.provincia}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              canton: e.target.value,
              distrito: "",
            }));
          }}
        >
          <option value="" disabled>
            Seleccione el cantón
          </option>
          {cantones.map((c) => (
            <option key={c.nombre} value={c.nombre}>
              {c.nombre}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>

        {/* DISTRITO */}
        <label className="label">Distrito</label>
        <select
          className="select"
          value={locationForm.distrito}
          disabled={!locationForm.canton}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              distrito: e.target.value,
            }));
          }}
        >
          <option value="" disabled>
            Seleccione el distrito
          </option>
          {distritos.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
          <option value="Otro">Otro</option>
        </select>

        <label className="label">Otras señas</label>
        <textarea
          className="textarea"
          placeholder="..."
          value={locationForm.otro}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              otro: e.target.value,
            }));
          }}
        ></textarea>
      </fieldset>

      <fieldset className="fieldset border-base-content/40 rounded-box border p-4 gap-3">
        <legend className="fieldset-legend">Administrativos</legend>

        <label className="label">Tipo de identificación del propietario</label>
        <select
          className="select"
          value={locationForm.tipo_propietario}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              tipo_propietario: e.target.value,
            }));
          }}
        >
          <option disabled={true} value={""}>
            Seleccione el tipo
          </option>
          <option value={"Persona Juridica"}>Persona Jurídica</option>
          <option value={"Persona Fisica"}>Persona Física</option>
          <option value="Otro">Otro</option>
        </select>

        <label className="label">Identificación del Propietario</label>
        <input
          type="text"
          className="input join-item"
          placeholder="0-0000-0000"
          value={locationForm.propietario}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              propietario: e.target.value,
            }));
          }}
        />

        <label className="label">Número de Plano Catástro</label>
        <input
          type="text"
          className="input join-item"
          placeholder="0-0000-0000"
          value={locationForm.plano_catastro}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              plano_catastro: e.target.value,
            }));
          }}
        />

        <label className="label">Número de Finca</label>
        <input
          type="text"
          className="input join-item"
          placeholder="0-0000-0000"
          value={locationForm.finca}
          onChange={(e) => {
            setLocationForm((prev) => ({
              ...prev,
              finca: e.target.value,
            }));
          }}
        />
      </fieldset>
    </>
  );
}
