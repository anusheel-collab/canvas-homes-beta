"use client";

import { useState } from "react";
import { MapPin, Edit2 } from "lucide-react";

interface MapPreviewProps {
  location: {
    lat: number;
    lng: number;
    address: string;
    type: "suggestion" | "current" | "map";
  };
  radius: number;
  onRadiusChange: (radius: number) => void;
  onOpenMap: () => void;
  width?: number;
  height?: number;
}

export function MapPreview({
  location,
  radius,
  onRadiusChange,
  onOpenMap,
  width = 480,
  height = 280,
}: MapPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  const getCirclePoints = (
    centerLat: number,
    centerLng: number,
    radiusKm: number,
  ) => {
    const points = [];
    const earthRadius = 6371;
    const detail = 40;

    for (let i = 0; i <= detail; i++) {
      const angle = (i * (360 / detail) * Math.PI) / 180;
      const dLat = (radiusKm / earthRadius) * (180 / Math.PI);
      const dLng =
        ((radiusKm / earthRadius) * (180 / Math.PI)) /
        Math.cos((centerLat * Math.PI) / 180);
      const pointLat = centerLat + dLat * Math.cos(angle);
      const pointLng = centerLng + dLng * Math.sin(angle);
      points.push(`${pointLat.toFixed(5)},${pointLng.toFixed(5)}`);
    }
    return points.join("|");
  };

  const getStaticMapUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const center = `${location.lat},${location.lng}`;
    const zoom = radius === 2 ? 14 : radius === 3 ? 13 : 12;
    const polyPoints = getCirclePoints(location.lat, location.lng, radius);
    const circlePath = `fillcolor:0x4285F440|color:0x4285F4FF|weight:2|${polyPoints}`;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${width}x${height}&scale=2&markers=color:red%7C${center}&path=${encodeURIComponent(
      circlePath,
    )}&key=${apiKey}`;
  };

  const radiusOptions = [2, 3, 5];

  return (
    <div className="bg-white rounded-2xl w-[480px] h-[280px] mt-[16px] rounded-[8px]  shadow-lg overflow-hidden border border-[#E5E5E5] mx-auto w-[480px]">
      {/* Header */}
      {/* <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="w-5 h-5 text-gray-600 shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">
            {location.address}
          </span>
        </div>
      </div> */}

      {/* Map Image Container */}
      <div className="relative w-[480px] h-[280px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        <img
          key={`${location.lat}-${location.lng}-${radius}`}
          src={getStaticMapUrl()}
          alt="Location Preview"
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        {/* --- OVERLAYS (Top Right) --- */}
        <div className="translate-y-[-280px] top-3 right-3 flex flex-col gap-2 items-end">
          {/* Conditional Rendering: Only show if type is NOT "current" */}
          {location.type !== "current" && (
            <button
              onClick={onOpenMap}
              className="translate-x-[-10px] w-[80px] h-[37px] rounded-[8px] border-none gap-2 px-3 py-2 bg-blue-600 text-[#FAFAFA] bg-[#262626] text-white text-[14px] font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              <Edit2 className="w-[13.34px] h-[13.34px] color-[#FAFAFA]" />
              Draw
            </button>
          )}

          {/* Radius Distance Label */}
          {/* <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-gray-100">
            <span className="text-xs font-semibold text-gray-800">
              {radius} km radius
            </span>
          </div> */}
        </div>
      </div>

      {/* Radius Selector */}
      <div className="translate-y-[-50px] left-0 right-0 h-[55px] px-4 bg-[rgba(255,255,255,0.60)] backdrop-blur-sm border-gray-200/50 rounded-lg z-30">
        <div className="flex items-center justify-between py-3">
          <span className="translate-y-[5px] translate-x-[15px] text-[16px] font-[600] text-[#262626]">
            Preferred Distance
          </span>
          <div className="flex gap-2">
            {radiusOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setIsLoading(true);
                  onRadiusChange(option);
                }}
                className={`text-sm w-[57px] h-[37px] rounded-[8px] font-medium transition-all ${
                  radius === option
                    ? "bg-blue-600 text-white shadow-lg mt-[7px] mr-[10px]"
                    : "bg-white/80 text-gray-800 border mt-[7px] mr-[10px] border-gray-300/70 border-[1px] border-[#D4D4D4] hover:bg-gray-100"
                }`}
              >
                {option} km
              </button>
            ))}
          </div>
        </div>
        {/* <div className="pb-2">
          <p className="text-xs text-gray-700 text-right">
            Select radius around your location
          </p>
        </div> */}
      </div>
    </div>
  );
}
