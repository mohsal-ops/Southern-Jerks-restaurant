"use client";
import { useEffect, useRef } from "react";

type Props = {
  lat: number;
  lng: number;
  className?: string;
};

export default function MapClient({ lat, lng, className }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !(window as any).H) return;

    const H = (window as any).H;

    const platform = new H.service.Platform({
      apikey: process.env.NEXT_PUBLIC_HERE_API_KEY,
    });

    const defaultLayers = platform.createDefaultLayers();

    const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      center: { lat, lng },
      zoom: 14,
      pixelRatio: window.devicePixelRatio || 1,
    });

    // Enable interactions
    const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Marker
    const marker = new H.map.Marker({ lat, lng });
    map.addObject(marker);

    marker.addEventListener("tap", async () => {
      const position = marker.getGeometry(); // <-- THIS line fixes your error

      map.setCenter(position, true);
      map.setZoom(16, true);

      const bubble = new H.ui.InfoBubble(position, {
        content: `
      <strong>Southern Jerks</strong><br/>
      Click map to open in Google Maps
    `,
      });
      ui.addBubble(bubble);
    });

    // 👉 Open Google Maps on click
    map.addEventListener("tap", () => {
      const url = `https://www.google.com/maps?q=${lat},${lng}`;
      window.open(url, "_blank");
    });

    return () => map.dispose();
  }, [lat, lng]);

  return <div ref={mapRef} className={className} />;
}
