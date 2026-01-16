// components/MapPreview.tsx
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

  // --- HELPER: Generate points for a circle polygon ---
  const getCirclePoints = (
    centerLat: number,
    centerLng: number,
    radiusKm: number
  ) => {
    const points = [];
    const earthRadius = 6371; // Earth's radius in km
    const detail = 40; // Number of points to make the circle (higher = smoother)

    for (let i = 0; i <= detail; i++) {
      const angle = (i * (360 / detail) * Math.PI) / 180;

      // Calculate offset
      const dLat = (radiusKm / earthRadius) * (180 / Math.PI);
      const dLng =
        ((radiusKm / earthRadius) * (180 / Math.PI)) /
        Math.cos((centerLat * Math.PI) / 180);

      const pointLat = centerLat + dLat * Math.cos(angle);
      const pointLng = centerLng + dLng * Math.sin(angle);

      // Format as "lat,lng"
      points.push(`${pointLat.toFixed(5)},${pointLng.toFixed(5)}`);
    }

    return points.join("|");
  };

  const getStaticMapUrl = () => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const center = `${location.lat},${location.lng}`;

    // Adjust zoom based on radius so the circle fits nicely
    const zoom = radius === 2 ? 14 : radius === 3 ? 13 : 12;

    // Generate the polygon points for the circle
    const polyPoints = getCirclePoints(location.lat, location.lng, radius);

    // Construct the path string
    // Format: fillcolor:color|color:borderColor|weight:thickness|point1|point2|...
    const circlePath = `fillcolor:0x4285F440|color:0x4285F4FF|weight:2|${polyPoints}`;

    // Note: We use encodeURIComponent for the path to ensure special chars like pipes (|) are handled correctly
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${width}x${height}&scale=2&markers=color:red%7C${center}&path=${encodeURIComponent(
      circlePath
    )}&key=${apiKey}`;
  };

  const radiusOptions = [2, 3, 5];

  return (
    <div
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 mx-auto"
      style={{ width: `${width}px` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <MapPin className="w-5 h-5 text-gray-600 shrink-0" />
          <span className="text-sm font-medium text-gray-700 truncate">
            {location.address}
          </span>
        </div>

        <button
          onClick={onOpenMap}
          className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0 ml-3"
        >
          <Edit2 className="w-4 h-4" />
          Draw
        </button>
      </div>

      {/* Map Image */}
      <div className="relative" style={{ height: `${height - 120}px` }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Note: Added key to img to force reload when radius changes */}
        <img
          key={`${location.lat}-${location.lng}-${radius}`}
          src={getStaticMapUrl()}
          alt="Location Preview"
          className="w-full h-full object-cover"
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
          <span className="text-sm font-medium text-gray-800">
            {radius} km radius
          </span>
        </div>
      </div>

      {/* Radius Selector */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            Preferred Distance
          </span>
          <div className="flex gap-2">
            {radiusOptions.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setIsLoading(true); // Reset loading state on change
                  onRadiusChange(option);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  radius === option
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {option} km
              </button>
            ))}
          </div>
        </div>
        <div className="mt-1">
          <p className="text-xs text-gray-500 text-right">
            Select radius around your location
          </p>
        </div>
      </div>
    </div>
  );
}
