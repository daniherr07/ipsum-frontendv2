"use client";

import { useRouter } from "next/navigation";
import { modifyData } from "../../const";
import { useEffect, useState } from "react";

export default function SelectClient({ type }) {
  const router = useRouter();
  const [table, setTable] = useState(type);
  const [genericData, setGenericData] = useState();
  const [loading, setLoading] = useState();


  return (
    <>
      <select
        className="select w-full"
        value={table}
        onChange={(e) => {
          setTable(e.target.value);
          router.push(`/protected/modify?type=${table}`);
        }}
      >
        <option disabled value="">
          Seleccione una opción
        </option>

        {modifyData.map((item) => (
          <option key={item.slug} value={item.table}>
            {item.label}
          </option>
        ))}
      </select>

      <GenericUpdate
        genericData={genericData}
        loading={loading}
      ></GenericUpdate>
    </>
  );
}

function GenericUpdate({ genericData, loading }) {
  return (
    <div className="flex mt-3">
      {loading ? (
        <span className="loading loading-dots loading-xl"></span>
      ) : (
        <>
          {genericData &&
            genericData.map((item) => {
              <details
                className="collapse bg-base-100 border border-base-300"
                name={item.id}
              >
                <summary className="collapse-title font-semibold">
                  How do I create an account?
                </summary>
                <div className="collapse-content text-sm">
                  Click the "Sign Up" button in the top right corner and follow
                  the registration process.
                </div>
              </details>;
            })}
        </>
      )}
    </div>
  );
}
