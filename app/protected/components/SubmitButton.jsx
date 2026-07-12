"use client";

import { useFormStatus } from "react-dom";

// useFormStatus solo refleja el estado del <form> más cercano si se llama
// desde un componente hijo de ese form (no desde el mismo componente que lo
// renderiza) — por eso este botón vive aparte en vez de estar inline.
export default function SubmitButton({
  children,
  pendingLabel = "Guardando...",
  className = "btn btn-primary w-full mt-1",
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? pendingLabel : children}
    </button>
  );
}
