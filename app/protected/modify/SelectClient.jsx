"use client";

import { useRouter } from "next/navigation";
import { modifyData } from "../../const";

export default function SelectClient({ type }) {
  const router = useRouter();

  return (
    <select
      className="select w-full"
      value={type ?? ""}
      onChange={(e) => {
        const v = e.target.value;
        router.push(`/protected/modify?type=${v}`);
      }}
    >
      <option disabled value="">
        Seleccione una opción
      </option>

      {modifyData.map((item) => (
        <option key={item.slug} value={item.slug}>
          {item.label}
        </option>
      ))}
    </select>
  );
}
