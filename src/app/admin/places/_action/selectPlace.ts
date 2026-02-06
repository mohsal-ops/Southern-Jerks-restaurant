import { Loader } from "@googlemaps/js-api-loader";
import { toast } from "sonner"

let map: google.maps.Map;
let infoWindow: google.maps.InfoWindow;
let markers: Record<string, google.maps.marker.AdvancedMarkerElement> = {};

type Props = {
  mapRef: HTMLDivElement,
}

export default async function searchandGetPlaceAndAddToDataBase({ mapRef }: Props) {
  // 1. Load Google Maps
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
    version: "weekly"
  });

  await loader?.importLibrary("maps"); // ✅ this ensures `google` is defined
  const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

  const center = { lat: 37.4161493, lng: -122.0812166 };
  //setup the map

  map = new Map(mapRef as HTMLElement, {
    center: center,
    zoom: 11,
    mapTypeControl: false,
    mapId: 'DEMO_MAP_ID',
  });

  const textInput = document.getElementById('text-input') as HTMLInputElement;
  const textInputButton = document.getElementById('text-input-button') as HTMLButtonElement;
  const cardRef = document.getElementById('text-input-card') as HTMLElement;

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(cardRef);






  // add EventLister when he enters searchterm and when he click submit

  textInputButton.addEventListener('click', () => {
    findPlaces(textInput.value);

  });

  textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      findPlaces(textInput.value);
    }
  });

  infoWindow = new google.maps.InfoWindow();
}

const findPlaces = async (query: string | undefined) => {
  const { Place } = await google.maps.importLibrary("places") as google.maps.PlacesLibrary;
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;



  const request = {
    textQuery: query,
    fields: ['displayName', 'location', 'businessStatus'],
    includedType: '', // Restrict query to a specific type (leave blank for any).
    useStrictTypeFiltering: true,
    locationBias: map.getCenter(),
    isOpenNow: true,
    language: 'en-US',
    maxResultCount: 8,
    minRating: 1, // Specify a minimum rating.
    region: 'us',
  };

  const { places } = await Place.searchByText(request);
  function latLngToObject(latLng: google.maps.LatLng | null | undefined) {
  if (!latLng) return { lat: 0, lng: 0 }; // fallback
  return {
    lat: latLng.lat(), // full decimal
    lng: latLng.lng(), // full decimal
  };
}

  if (places.length) {
    const { LatLngBounds } = await google.maps.importLibrary("core") as google.maps.CoreLibrary;
    const bounds = new LatLngBounds();

    // First remove all existing markers.
    for (const id in markers) {
      markers[id].map = null;
    };
    markers = {};

    // Loop through and get all the results.
    places.forEach(place => {
      const marker = new AdvancedMarkerElement({
        map,
        position: place.location,
        title: place.displayName,
      });
      markers[place.id] = marker;

      marker.addListener('gmp-click', async () => {
        if (!place.location) return
        map.panTo(place.location);
        const position = latLngToObject(place.location);
        updateInfoWindow(place.displayName, place.id, marker);
        const res = await fetch('/api/addPlaceToDb', {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: place.displayName,
            ...position,
          }),
        })

        if(res.ok){
          toast("Place added succefuly")

        }else{
           toast('place already exists')

        }
      });

      

      if (place.location != null) {
        bounds.extend(place.location);
      }
    });

    map.fitBounds(bounds);

  } else {
    console.log('No results');
  }
}
// Helper function to create an info window.
const updateInfoWindow = async (title: string | null | undefined, content: string | undefined, anchor: google.maps.marker.AdvancedMarkerElement | undefined) => {
  infoWindow.setContent(content);
  infoWindow.setHeaderContent(title);
  infoWindow.open({
    map,
    anchor,
    shouldFocus: false,
  });

}