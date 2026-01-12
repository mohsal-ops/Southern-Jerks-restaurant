"use client"
import React, { useEffect, useRef } from 'react'
import searchandGetPlaceAndAddToDataBase from './_action/selectPlace';



export default function PlacesComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const textInput = useRef<HTMLInputElement>(null);
  const textInputButton = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    searchandGetPlaceAndAddToDataBase({mapRef: mapRef.current as HTMLDivElement});
  }, [])

  return (
    <div className="w-full h-full  flex flex-col justify-center items-center">
      <div className='flex sm:w-[50rem] w-full p-3  gap-2 bg-accent border border-slate-300 '>
        <input
          ref={textInput}
          id="text-input"
          type="text"
          placeholder="Search for a place"
          className="border p-1 rounded flex-2 w-full"
        />
        <button
          ref={textInputButton}
          id="text-input-button"
          className="bg-blue-500 text-white px-3 rounded"
        >
          Search
        </button>
      </div>
      
      <div
        id="text-input-card"
        ref={cardRef}
        className="absolute top-2 left-2 z-10 bg-white  rounded shadow flex gap-2"
      >
      </div>
      <div ref={mapRef}  className="h-[400px]  border border-slate-300 w-full rounded shadow" />
    </div>
  )
}
