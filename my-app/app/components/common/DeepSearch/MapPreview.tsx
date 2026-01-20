"use client";

import { useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Circle,
  Marker,
} from "@react-google-maps/api";
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

const containerStyle = {
  width: "100%",
  height: "100%",
};

export function MapPreview({
  location,
  radius,
  onRadiusChange,
  onOpenMap,
  width = 480,
  height = 280,
}: MapPreviewProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // map radius change here - Updated zoom levels for 5, 10, 15km
  const zoom = radius === 5 ? 12 : radius === 10 ? 11 : 10;
  const radiusOptions = [5, 10, 15];

  if (!isLoaded)
    return (
      <div className="w-[480px] h-[280px] bg-gray-100 animate-pulse mx-auto mt-[16px] rounded-[8px]" />
    );

  return (
    <div className="bg-white rounded-2xl w-[480px] h-[280px] mt-[16px] rounded-[8px] shadow-lg overflow-hidden border border-[#E5E5E5] mx-auto w-[480px]">
      {/* Map Container */}
      <div className="relative w-[480px] h-[280px]">
        <GoogleMap
          // The key ensures only the current selection's circle/zoom is rendered
          key={`${location.lat}-${radius}`}
          mapContainerStyle={containerStyle}
          center={location}
          zoom={zoom}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            // Position 1 is TOP_RIGHT
            zoomControlOptions: {
              position: 1,
            },
            gestureHandling: "cooperative",
          }}
        >
          <Marker position={location} />
          <Circle
            center={location}
            radius={radius * 1000}
            options={{
              fillColor: "#DBDBDB",
              fillOpacity: 0.48,
              strokeColor: "#0A0A0A",
              strokeOpacity: 1,
              strokeWeight: 2,
              clickable: false,
            }}
          />
        </GoogleMap>

        {/* --- OVERLAYS (Top Right) --- */}
        {/* Restored exact original button UI and positioning */}
        <div className="absolute translate-y-[-270px] translate-x-[400px] top-3 right-3 flex flex-col gap-2 items-end z-10">
          {location.type !== "current" && (
            <button
              onClick={onOpenMap}
              className="translate-x-[-10px] w-[80px] h-[37px] rounded-[8px] border-none gap-2 px-3 py-2 bg-blue-600 text-[#FAFAFA] bg-[#262626] text-white text-[14px] font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95 flex items-center justify-center"
            >
              <Edit2 className="w-[13.34px] h-[13.34px] color-[#FAFAFA]" />
              Draw
            </button>
          )}
        </div>
      </div>

      {/* Radius Selector - Kept exactly as your original code */}
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
      </div>
    </div>
  );
}
