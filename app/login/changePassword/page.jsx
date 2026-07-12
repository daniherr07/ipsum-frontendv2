import Image from "next/image";
import { redirect } from "next/navigation";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function ChangePassword({ searchParams }) {
  const query = await searchParams;
  const userId = query.id;

  // Sin id no hay a quién cambiarle la contraseña (ej. alguien entra directo
  // a esta URL sin pasar por /login primero).
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-linear-to-br from-primary-700 to-base-100">
      <main
        className="
            bg-base-300 w-full h-full p-3 text-center flex flex-col items-center justify-center gap-5
            lg:w-full lg:max-w-md lg:h-fit lg:p-8 lg:border lg:border-white/20 lg:shadow-2xl lg:rounded
        "
      >
        <Image
          src={"/logo.svg"}
          width={350}
          height={101}
          alt="Logo"
          className="w-48 sm:w-64 h-auto"
          loading="eager"
        />

        <p className="text-base-content/70">
          Es tu primer inicio de sesión (o acabás de restablecer tu
          contraseña). Debés cambiarla antes de continuar.
        </p>

        <ChangePasswordForm userId={userId} />
      </main>
    </div>
  );
}
