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

  const zoom = radius === 5 ? 12 : radius === 10 ? 11 : 10;
  const radiusOptions = [5, 10, 15];

  if (!isLoaded)
    return (
      <div className="w-full max-w-[362px] md:max-w-[448px] h-[320px] md:h-[280px] bg-gray-100 animate-pulse mx-auto mt-[16px] rounded-[8px] px-2 md:px-0">
        <div className="w-full h-full bg-gray-100 rounded-[8px]" />
      </div>
    );

  return (
    <div className="w-full px-2 md:px-0 mx-auto">
      <div className="bg-white rounded-2xl w-full max-w-[362px] md:max-w-[448px] h-[320px] md:h-[280px] mt-[16px] rounded-[8px] shadow-lg overflow-hidden border border-[#E5E5E5] mx-auto">
        {/* Map Container */}
        <div className="relative w-full h-full">
          <GoogleMap
            key={`${location.lat}-${radius}`}
            mapContainerStyle={containerStyle}
            center={location}
            zoom={zoom}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
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

          {/* Draw Button Overlay */}
          <div className="absolute translate-y-[-5px] translate-x-[15px] top-3 right-3 flex flex-col gap-2 items-end z-10">
            {location.type !== "current" && (
              <button
                onClick={onOpenMap}
                className="translate-x-[-10px] w-[70px] md:w-[80px] h-[34px] md:h-[37px] rounded-[8px] border-none gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 bg-[#262626] text-[#FAFAFA] text-[13px] md:text-[14px] font-bold hover:bg-[#262626] transition-all shadow-md active:scale-95 flex items-center justify-center"
              >
                <Edit2 className="w-[12px] h-[12px] md:w-[13.34px] md:h-[13.34px] color-[#FAFAFA]" />
                Draw
              </button>
            )}
          </div>
        </div>

        {/* Radius Selector */}
        <div className="translate-y-[-55px] left-0 right-0 h-[55px] px-3 md:px-4 bg-[rgba(255,255,255,0.60)] backdrop-blur-sm border-gray-200/50 rounded-lg z-30">
          <div className="flex items-center justify-between">
            <span className="translate-y-[5px] translate-x-[8px] md:translate-x-[15px] text-[14px] md:text-[16px] font-[600] text-[#262626]">
              Preferred Distance
            </span>
            <div className="flex gap-1.5 md:gap-2">
              {radiusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onRadiusChange(option);
                  }}
                  className={`text-xs md:text-sm w-[50px] md:w-[57px] h-[34px] md:h-[37px] rounded-[8px] font-medium transition-all ${
                    radius === option
                      ? "bg-[#262626] text-white shadow-lg mt-[7px] mr-[5px] md:mr-[10px]"
                      : "bg-white/80 text-gray-800 border mt-[7px] mr-[5px] md:mr-[10px] border-gray-300/70 border-[1px] border-[#D4D4D4] hover:bg-gray-100"
                  }`}
                >
                  {option} km
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
