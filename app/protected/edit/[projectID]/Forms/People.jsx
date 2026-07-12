"use client";

import { useState } from "react";
import { BellRing } from "lucide-react";
import QuickAddModal from "../QuickAddModal";
import StatusModal from "../../../components/StatusModal";
import { sendNotification } from "../SaveActions/sendNotification";

// Nombre completo + id de cada encargado que sí es un usuario del sistema
// (arquitecto/analista/ingeniero) y por tanto puede recibir una
// notificación in-app + correo. Constructor/promotor/fiscal son contactos
// externos sin cuenta, así que no califican como destinatarios.
function getNotifiableRecipients(peopleForm, formValues) {
  return [
    { role: "Analista", id: peopleForm.analista_id, list: formValues?.analistas },
    { role: "Arquitecto", id: peopleForm.arquitecto_id, list: formValues?.arquitectos },
    { role: "Ingeniero", id: peopleForm.ingeniero_id, list: formValues?.ingenieros },
  ]
    .filter((entry) => entry.id)
    .map((entry) => {
      const person = (entry.list || []).find(
        (p) => String(p.id) === String(entry.id),
      );
      if (!person) return null;
      return {
        id: entry.id,
        role: entry.role,
        nombre: `${person.nombre} ${person.apellido1 || ""}`.trim(),
      };
    })
    .filter(Boolean);
}

export default function People({
  peopleForm,
  setPeopleForm,
  formValues,
  projectID,
  currentUserId,
}) {
  // Entradas creadas desde el botón "Añadir" de este mismo formulario, para
  // que aparezcan de inmediato en el <select> sin recargar toda la página.
  // Arquitecto/Analista/Ingeniero no tienen botón "Añadir": son usuarios
  // del sistema (módulo "Usuarios"), no una tabla de "Modificar".
  const [extraOptions, setExtraOptions] = useState({
    constructores: [],
    promotores_ipsum: [],
    fiscales: [],
  });

  const addExtra = (table, row) => {
    setExtraOptions((prev) => ({
      ...prev,
      [table]: [...prev[table], row],
    }));
  };

  const [notifying, setNotifying] = useState(false);
  const [status, setStatus] = useState(null);
  const notifiableRecipients = getNotifiableRecipients(peopleForm, formValues);

  const constructores = [
    ...(formValues?.constructores || []),
    // modifyData usa "Nombre" (con mayúscula) como nombre de columna para
    // constructores; se reconcilia a "nombre" para que se muestre igual
    // que las opciones que vienen de la base de datos.
    ...extraOptions.constructores.map((row) => ({
      ...row,
      nombre: row.Nombre,
    })),
  ];
  const promotores = [
    ...(formValues?.promotores || []),
    ...extraOptions.promotores_ipsum,
  ];
  const fiscales = [...(formValues?.fiscales || []), ...extraOptions.fiscales];

  return (
    <div className="card bg-base-200 w-full shadow-sm">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title">Encargados del proyecto</h2>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            disabled={notifiableRecipients.length === 0}
            title={
              notifiableRecipients.length === 0
                ? "Asigná un analista, arquitecto o ingeniero para poder notificarle"
                : undefined
            }
            onClick={() => setNotifying(true)}
          >
            <BellRing size={16} />
            Notificar
          </button>
        </div>

        {notifying && (
          <NotifyModal
            projectID={projectID}
            currentUserId={currentUserId}
            recipients={notifiableRecipients}
            onClose={() => setNotifying(false)}
            onDone={(result) => {
              setStatus(result);
              if (result.ok) setNotifying(false);
            }}
          />
        )}

        <StatusModal status={status} onClose={() => setStatus(null)} />

        <fieldset className="fieldset gap-3">
          <label className="label flex items-center gap-2">
            Constructor
            <QuickAddModal
              table="constructores"
              onCreated={(row) => {
                addExtra("constructores", row);
                setPeopleForm((prev) => ({
                  ...prev,
                  constructor_id: row.id,
                }));
              }}
            />
          </label>
          <select
            value={peopleForm.constructor_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                constructor_id: e.target.value,
              }));
            }}
            className="select w-full"
          >
            <option disabled={true} value={""}>
              Seleccione el constructor
            </option>
            {constructores.map((constructor) => (
              <option value={constructor.id} key={constructor.id}>
                {constructor.nombre} {constructor.apellido1}
              </option>
            ))}
          </select>

          <label className="label">Arquitecto</label>
          <select
            value={peopleForm.arquitecto_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                arquitecto_id: e.target.value,
              }));
            }}
            className="select w-full"
          >
            <option value={""}>
              Seleccione el arquitecto
            </option>
            {formValues &&
              formValues.arquitectos.map((arquitecto) => (
                <option
                  value={arquitecto.id}
                  key={arquitecto.id}
                >
                  {arquitecto.nombre} {arquitecto.apellido1}
                </option>
              ))}
          </select>

          <label className="label flex items-center gap-2">
            Promotor Ipsum
            <QuickAddModal
              table="promotores_ipsum"
              onCreated={(row) => {
                addExtra("promotores_ipsum", row);
                setPeopleForm((prev) => ({ ...prev, promotor_id: row.id }));
              }}
            />
          </label>
          <select
            value={peopleForm.promotor_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                promotor_id: e.target.value,
              }));
            }}
            className="select w-full"
          >
            <option disabled={true} value={""}>
              Seleccione el promotor
            </option>
            {promotores.map((promotor) => (
              <option value={promotor.id} key={promotor.id}>
                {promotor.nombre} {promotor.apellido1}
              </option>
            ))}
          </select>

          <label className="label">Analista Ipsum</label>
          <select
            value={peopleForm.analista_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                analista_id: e.target.value,
              }));
            }}
            className="select w-full"
          >
            <option disabled={true} value={""}>
              Seleccione el analista
            </option>
            {formValues &&
              formValues.analistas.map((analista) => (
                <option value={analista.id} key={analista.id}>
                  {analista.nombre} {analista.apellido1}
                </option>
              ))}
          </select>

          <label className="label">Ingeniero</label>
          <select
            value={peopleForm.ingeniero_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                ingeniero_id: e.target.value,
              }));
            }}
            className="select w-full"
          >
            <option disabled={true} value={""}>
              Seleccione el ingeniero
            </option>
            {formValues &&
              formValues.ingenieros.map((ingeniero) => (
                <option value={ingeniero.id} key={ingeniero.id}>
                  {ingeniero.nombre} {ingeniero.apellido1}
                </option>
              ))}
          </select>

          <label className="label flex items-center gap-2">
            Fiscal
            <QuickAddModal
              table="fiscales"
              onCreated={(row) => {
                addExtra("fiscales", row);
                setPeopleForm((prev) => ({ ...prev, fiscal_id: row.id }));
              }}
            />
          </label>
          <select
            value={peopleForm.fiscal_id}
            onChange={(e) => {
              setPeopleForm((prev) => ({
                ...prev,
                fiscal_id: e.target.value,
              }));
            }}
            className="select w-full"
          >
            <option disabled={true} value={""}>
              Seleccione el fiscal
            </option>
            {fiscales.map((fiscal) => (
              <option value={fiscal.id} key={fiscal.id}>
                {fiscal.nombre} {fiscal.apellido1}
              </option>
            ))}
          </select>
        </fieldset>
      </div>
    </div>
  );
}

// Modal para mandarle un mensaje puntual a uno de los encargados del
// proyecto (analista/arquitecto/ingeniero) — llega como notificación in-app
// (campanita) y por correo, con el proyecto y el remitente desglosados.
function NotifyModal({ projectID, currentUserId, recipients, onClose, onDone }) {
  const [destinatarioId, setDestinatarioId] = useState(recipients[0]?.id || "");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    setSending(true);
    const result = await sendNotification(
      projectID,
      currentUserId,
      destinatarioId,
      asunto,
      mensaje,
    );
    setSending(false);
    onDone(result);
  };

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box">
        <h3 className="text-lg font-bold mb-3">Notificar a un encargado</h3>

        <div className="flex flex-col gap-3">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Destinatario</legend>
            <select
              className="select w-full"
              value={destinatarioId}
              onChange={(e) => setDestinatarioId(e.target.value)}
            >
              {recipients.map((recipient) => (
                <option value={recipient.id} key={recipient.id}>
                  {recipient.nombre} ({recipient.role})
                </option>
              ))}
            </select>
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Asunto</legend>
            <input
              type="text"
              className="input w-full"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              placeholder="¿Sobre qué es esta notificación?"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Mensaje</legend>
            <textarea
              className="textarea w-full"
              rows={4}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Escriba el mensaje para el encargado..."
            ></textarea>
          </fieldset>

          <div className="modal-action flex justify-between">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={sending}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={sending || !destinatarioId || !asunto.trim() || !mensaje.trim()}
            >
              {sending ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
