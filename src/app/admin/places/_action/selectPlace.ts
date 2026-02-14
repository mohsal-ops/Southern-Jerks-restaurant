import { toast } from "sonner";

let map: H.Map;
let ui: H.ui.UI;
let markers: Record<string, H.map.Marker> = {};

type Props = {
  mapRef: HTMLDivElement;
};

export default function searchandGetPlaceAndAddToDataBase({ mapRef }: Props) {
  const platform = new H.service.Platform({
    apikey: process.env.NEXT_PUBLIC_HERE_API_KEY as string,
  });

  const defaultLayers = platform.createDefaultLayers();

  map = new H.Map(mapRef, defaultLayers.vector.normal.map, {
    center: { lat: 39.8283, lng: -98.5795 }, // USA center
    zoom: 4, // show whole USA
  });

  new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  ui = H.ui.UI.createDefault(map, defaultLayers);

  const textInput = document.getElementById("text-input") as HTMLInputElement;
  const textInputButton = document.getElementById(
    "text-input-button",
  ) as HTMLButtonElement;

  textInputButton.addEventListener("click", () => {
    findPlaces(textInput.value);
  });

  textInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") findPlaces(textInput.value);
  });
}

async function findPlaces(query: string) {
  if (!query) return;

  const center = map.getCenter();

  const url = `https://discover.search.hereapi.com/v1/discover?apikey=${
    process.env.NEXT_PUBLIC_HERE_API_KEY
  }&q=${encodeURIComponent(query)}&at=${center.lat},${center.lng}&limit=8`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items?.length) {
    toast("No results");
    return;
  }

  Object.values(markers).forEach((m) => map.removeObject(m));
  markers = {};

  let bounds: H.geo.Rect | null = null;

  data.items.forEach((place: any) => {
    const position = {
      lat: place.position.lat,
      lng: place.position.lng,
    };

    const marker = new H.map.Marker(position);
    map.addObject(marker);
    markers[place.id] = marker;

    if (!bounds) {
      bounds = new H.geo.Rect(
        position.lat,
        position.lng,
        position.lat,
        position.lng,
      );
    } else {
      bounds.mergePoint(position);
    }

    marker.addEventListener("tap", async () => {
      const bubble = new H.ui.InfoBubble(position, {
        content: `<strong>${place.title}</strong>`,
      });
      ui.addBubble(bubble);

      const res = await fetch("/api/addPlaceToDb", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: place.title,
          lat: position.lat,
          lng: position.lng,
        }),
      });

      if (res.ok) toast("Place added successfully");
      else toast("Place already exists");
    });
  });

  if (bounds) {
    map.getViewModel().setLookAtData({
      bounds,
      padding: { top: 200, bottom: 200, left: 200, right: 200 },
    });
  }
}
