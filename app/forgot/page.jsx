import Form from "next/form";
import Image from "next/image";
import SubmitButton from "./SubmitButton";
import Link from "next/link";
import { submitAction } from "./submitAction";
import { CircleX, CircleCheck } from "lucide-react";

export default async function Forget({ searchParams }) {
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

        <p className="text-base-content/70">
          Se le enviará un email con una contraseña nueva
        </p>

        <Form className="flex flex-col gap-5 w-full" action={submitAction}>
          <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
            <legend className="fieldset-legend">Ingrese su email</legend>

            <label className="label">Usuario o Email</label>
            <input
              type="email"
              className="input"
              placeholder="example@email.com"
            />
          </fieldset>

          <SubmitButton />
        </Form>

        {query.success && (
          <>
            <input
              type="checkbox"
              id="successModal"
              defaultChecked={true}
              className="modal-toggle"
            />
            <div className="modal" role="dialog">
              <div className="modal-box border border-success flex flex-col items-center justify-center w-fit shadow-md shadow-success/30">
                <CircleCheck size={70} className="text-success" />
                <p className="py-4 text-2xl font-bold">
                  Email enviado correctamente
                </p>
                <div className="modal-action m-0">
                  <label htmlFor="successModal" className="btn btn-success">
                    <Link href={"/login"}>Ir a login</Link>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

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
                <p className="py-4 text-2xl font-bold">{query.msg}</p>
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
