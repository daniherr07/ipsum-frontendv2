'use client'
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
  const status = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary" disabled={status.pending}>
      {status.pending ? "Enviando correo..." : "Enviar correo"}
    </button>
  );
}
