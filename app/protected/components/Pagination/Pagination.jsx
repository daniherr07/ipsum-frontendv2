"use client";

import { Book, Users, MapPin, Building2 } from "lucide-react";
import { useState } from "react";

export default function Pagination({current, setCurrent}) {
  

  return (
    <div className="join">
      <button
        onClick={() => current != 0 && setCurrent(current - 1)}
        className="join-item btn btn-primary "
      >
        «
      </button>
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
        onClick={() => current != 3 && setCurrent(current + 1)}
        className="join-item btn btn-primary"
      >
        »
      </button>
    </div>
  );
}
