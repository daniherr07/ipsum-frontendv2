'use client'
import { useFormStatus } from "react-dom";

export default function LoginButton() {
  const status = useFormStatus();

  return (
    <button type="submit" className="btn btn-primary" disabled={status.pending}>
      {status.pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}
