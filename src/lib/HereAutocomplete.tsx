"use client";
import { useState } from "react";

type HerePlace = {
  id: string;
  title: string;
  address: { label: string };
  position: { lat: number; lng: number };
};

export default function HereAutocomplete({
  onSelect,
}: {
  onSelect: (place: HerePlace) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<HerePlace[]>([]);

  const search = async (q: string) => {
    setQuery(q);
    if (q.length < 3) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://autocomplete.search.hereapi.com/v1/autocomplete?q=${encodeURIComponent(
        q
      )}&apiKey=${process.env.NEXT_PUBLIC_HERE_API_KEY}`
    );

    const data = await res.json();

    // Filter items to only real "places" with lat/lng
    const filtered: HerePlace[] = (data.items || [])
      .filter(
        (item: any) =>
          item.resultType === "place" &&
          item.position &&
          item.address &&
          item.address.label
      )
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        address: { label: item.address.label },
        position: { lat: item.position.lat, lng: item.position.lng },
      }));

    setResults(filtered);
  };

  return (
    <div className="w-full">
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        placeholder="Enter delivery address"
        className="w-full border rounded-xl p-3"
      />

      {results.length > 0 && (
        <div className="mt-2 border rounded-xl overflow-hidden">
          {results.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onSelect(item);
                setResults([]);
                setQuery(item.address.label);
              }}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              <div className="font-medium">{item.title}</div>
              <div className="text-sm text-gray-500">{item.address.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
