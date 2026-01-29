"use client";

import { Book, Users, MapPin, Building2, Smile, SkipForward } from "lucide-react";

export default function Pagination({current, setCurrent, saveFunction}) {
  

  return (
    <div className="join">
      <button
        onClick={() => setCurrent(0)}
        className={`join-item btn ${current == 0 && "btn-primary btn-soft"}`}
      >
        <Book></Book>
      </button>
      <button
        onClick={() => setCurrent(1)}
        className={`join-item btn ${current == 1 && "btn-primary btn-soft"}`}
      >
        <Users></Users>
      </button>
      <button
        onClick={() => setCurrent(2)}
        className={`join-item btn ${current == 2 && "btn-primary btn-soft"}`}
      >
        <MapPin></MapPin>
      </button>
      <button
        onClick={() => setCurrent(3)}
        className={`join-item btn ${current == 3 && "btn-primary btn-soft"}`}
      >
        <Building2></Building2>
      </button>

      <button
        onClick={() => setCurrent(4)}
        className={`join-item btn ${current == 4 && "btn-primary btn-soft"}`}
      >
        <Smile></Smile>
      </button>

      <button
        onClick={saveFunction}
        className={`join-item btn btn-secondary`}
      >
        <SkipForward></SkipForward>
      </button>
    </div>
  );
}
