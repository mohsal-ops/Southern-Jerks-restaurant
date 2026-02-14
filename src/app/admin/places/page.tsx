"use client";
import React, { useEffect, useRef } from "react";
import searchandGetPlaceAndAddToDataBase from "./_action/selectPlace";

export default function PlacesComponent() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    searchandGetPlaceAndAddToDataBase({
      mapRef: mapRef.current as HTMLDivElement,
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="flex sm:w-200 w-full p-3 gap-2 bg-accent border border-slate-300">
        <input
          id="text-input"
          type="text"
          placeholder="Search for a place"
          className="border p-1 rounded flex-2 w-full"
        />
        <button
          id="text-input-button"
          className="bg-blue-500 text-white px-3 rounded"
        >
          Search
        </button>
      </div>

      <div
        ref={mapRef}
        className="h-100 border border-slate-300 w-full rounded shadow"
      />
    </div>
  );
}
