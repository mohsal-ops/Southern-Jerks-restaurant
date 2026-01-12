"use client";

import dynamic from "next/dynamic";

const ThirdSectionComponent = dynamic(
  () =>
    import("./AnimatedImages").then(
      (m) => m.ThirdSectionComponent
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-[85%] h-[400px] bg-gray-200 rounded-3xl animate-pulse" />
    ),
  }
);

export default function ThirdSectionClient() {
  return <ThirdSectionComponent />;
}
