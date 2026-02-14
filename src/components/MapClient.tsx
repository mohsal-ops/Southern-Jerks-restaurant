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

    const map = new H.Map(
      mapRef.current,
      defaultLayers.vector.normal.map,
      {
        center: { lat, lng },
        zoom: 14, // city-level zoom
        pixelRatio: window.devicePixelRatio || 1,
      }
    );

    // Enable interactions
    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const ui = H.ui.UI.createDefault(map, defaultLayers);

    // Marker
    const marker = new H.map.Marker({ lat, lng });
    map.addObject(marker);

    // Info bubble
    const bubble = new H.ui.InfoBubble({ lat, lng }, {
      content: "<b>Southern Jerks</b><br/>Houston, TX",
    });
    ui.addBubble(bubble);

    // Cleanup
    return () => map.dispose();
  }, [lat, lng]);

  return <div ref={mapRef} className={className} />;
}
