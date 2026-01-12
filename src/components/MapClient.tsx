"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 rounded-4xl animate-pulse" />
  ),
});

export default function MapClient({
  lat,
  lng,
  className,
}: {
  lat: number;
  lng: number;
  className?: string;
}) {
  return <Map lat={lat} lng={lng} className={className} />;
}
