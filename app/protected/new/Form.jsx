"use client";

import ProjectTemplate from "../components/ProjectTemplate/ProjectTemplate";
import Pagination from "../components/Pagination/Pagination";

import Basic from "./Forms/Basic";
import Family from "./Forms/Family";

import { useState } from "react";

export default function Form() {
  const [current, setCurrent] = useState(0);

  return (
    <>
      <ProjectTemplate />

      <main className="w-full h-full flex flex-col items-center justify-center p-3 gap-3">
        <Pagination current={current} setCurrent={setCurrent}></Pagination>

        {current == 0 && <Basic></Basic>}
        {current == 1 && <Family></Family>}
      </main>
    </>
  );
}
