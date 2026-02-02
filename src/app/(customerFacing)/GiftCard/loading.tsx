// app/gift-card/loading.tsx
"use client";

import { Spinner } from "@/components/ui/spinner"; 
import Image from "next/image";
import logo from "public/logo.png";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      {/* Logo Animation */}
      <div className="animate-pulse">
        <Image src={logo} alt="Southern Jerks" className="h-20 w-auto" />
      </div>

      {/* Loading Text */}
      <p className="text-gray-400 text-lg animate-pulse">
        Loading gift card payment…
      </p>

      {/* Optional Spinner */}
      <div className="flex justify-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-black rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
