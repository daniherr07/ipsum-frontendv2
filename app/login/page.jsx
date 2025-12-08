import Form from "next/form";
import Link from "next/link";
import Image from "next/image";
import LoginButton from "./LoginButton";
import { loginAction } from "./loginAction";
import { CircleX } from "lucide-react";

export default async function Login({ searchParams }) {
  const query = await searchParams;

  return (
    <div className="w-full h-dvh flex items-center justify-center bg-linear-to-br from-primary-700 to-base-100">
      <main
        className="
            bg-base-300 w-full h-full p-3 text-center flex flex-col items-center justify-center gap-5 
            lg:w-fit lg:h-fit lg:p-8 lg:border lg:border-white/20 lg:shadow-2xl lg:rounded
        "
      >
        <Image
          src={"/logo.svg"}
          width={30}
          height={30}
          alt="Logo"
          className="w-75"
        />

        <Form className="flex flex-col gap-5 w-full" action={loginAction}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend">Ingrese sus datos</legend>

            <label className="label">Usuario o Email</label>
            <input
              type="text"
              className="input"
              placeholder="John Doe / example@email.com"
            />

            <label className="label">Contraseña</label>
            <input type="password" className="input" placeholder="..." />
          </fieldset>

          <LoginButton />
        </Form>

        <Link href={"/forgot"} className="text-info underline">
          ¿Olvidó su contraseña?
        </Link>

        {query.error && (
          <>
            <input
              type="checkbox"
              id="errorModal"
              defaultChecked={true}
              className="modal-toggle"
            />
            <div className="modal" role="dialog">
              <div className="modal-box border border-error flex flex-col items-center justify-center w-fit shadow-md shadow-error/30">
                <CircleX size={70} className="text-error" />
                <p className="py-4 text-2xl font-bold ">{query.msg}</p>
                <div className="modal-action m-0">
                  <label htmlFor="errorModal" className="btn btn-error">
                    Cerrar
                  </label>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
