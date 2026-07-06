"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MdKeyboardArrowRight } from "react-icons/md";
import MapClient from "@/components/MapClient";
import HereMapsScripts from "@/components/HereMapsScripts";
import { Location } from "generated/prisma";

const HOURS = [
  { day: "Sunday", open: "11:00 AM", close: "4:00 PM" },
  { day: "Monday", open: "Closed", close: "" },
  { day: "Tuesday", open: "11:00 AM", close: "9:00 PM" },
  { day: "Wednesday", open: "11:00 AM", close: "9:00 PM" },
  { day: "Thursday", open: "11:00 AM", close: "9:00 PM" },
  { day: "Friday", open: "11:00 AM", close: "9:00 PM" },
  { day: "Saturday", open: "12:00 PM", close: "8:00 PM" },
];

export function OurLocation({
  places,
  lat,
  lng,
}: {
  places: Location[];
  lat: number;
  lng: number;
}) {
  const [showHours, setShowHours] = useState(false);
  const todayIdx =  new Date(new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })).getDay();
  const today = HOURS[todayIdx];
  const todayLabel =
    today.open === "Closed"
      ? "Closed today"
      : `Today: ${today.open} – ${today.close}`;

  const mapsUrl =
    "https://www.google.com/maps/place/Southern+Jerks/@29.9461573,-95.4667466,17z/data=!4m15!1m8!3m7!1s0x8640c95bb7adafc3:0xddfe3901268f1b3!2s2950+Gears+Rd,+Houston,+TX+77067,+USA!3b1!8m2!3d29.9461206!4d-95.4641839!16s%2Fg%2F11bw3ym21k!3m5!1s0x8640c93ae409f1e5:0x89628db687ee16b3!8m2!3d29.9463373!4d-95.4643887!16s%2Fg%2F11xclc7vhb?entry=ttu";

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-stone-200 rounded-4xl w-full sm:w-[75%] font-bold ">
      <HereMapsScripts />
      {/* Map */}
      <div className="sm:w-[45%] w-full h-56 sm:h-auto min-h-50 rounded-3xl overflow-hidden shrink-0">
        <MapClient lat={lat} lng={lng} className="h-full w-full" />
      </div>

      {/* Info panel */}
      <div className="flex flex-col justify-between gap-4 flex-1 py-1">
        {/* Top: name + address */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-500">Southern Jerks</p>
            <p className="text-xl font-semibold text-gray-900">Houston, TX</p>
          </div>

          <div className="flex gap-8 mt-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Address</span>
              <p className="text-sm leading-relaxed">
                2950 Gears Rd
                <br />
                Houston, TX 77067
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">Contact</span>
              <p className="text-sm leading-relaxed">
                (346) 242-0328
                <br />
                contact@southernjerks.com
              </p>
            </div>
          </div>
        </div>

        {/* Animated hours panel */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showHours ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-gray-300 pt-3">
            <table className="w-full text-sm">
              <tbody>
                {HOURS.map((h, i) => {
                  const isToday = i === todayIdx;
                  const label =
                    h.open === "Closed" ? "Closed" : `${h.open} – ${h.close}`;
                  return (
                    <tr
                      key={h.day}
                      className={`border-b border-gray-200 last:border-0 transition-all duration-300 ${
                        showHours
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-2"
                      }`}
                      style={{
                        transitionDelay: showHours ? `${i * 45}ms` : "0ms",
                      }}
                    >
                      <td
                        className={`py-1.5 w-28 ${
                          isToday
                            ? "font-semibold text-gray-900"
                            : "text-gray-500"
                        }`}
                      >
                        {h.day}
                      </td>
                      <td
                        className={`py-1.5 ${
                          isToday
                            ? "font-semibold text-gray-900"
                            : "text-gray-700"
                        }`}
                      >
                        {label}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-300 pt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            {todayLabel}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowHours((v) => !v)}
            >
              {showHours ? "See info" : "See hours"}
            </Button>

            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">
                Get directions
              </Button>
            </a>

            <Link href="/catering">
              <Button size="sm" variant="mainButton">
                Catering
                <MdKeyboardArrowRight />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
