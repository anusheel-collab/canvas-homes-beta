// components/DistanceSelector.tsx
"use client";

interface DistanceSelectorProps {
  selectedRadius: number;
  onRadiusChange: (radius: number) => void;
}

export function DistanceSelector({
  selectedRadius,
  onRadiusChange,
}: DistanceSelectorProps) {
  const radiusOptions = [2, 3, 5];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">
        Preferred Distance
      </span>
      <div className="flex gap-2">
        {radiusOptions.map((radius) => (
          <button
            key={radius}
            onClick={() => onRadiusChange(radius)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              selectedRadius === radius
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {radius} km
          </button>
        ))}
      </div>
    </div>
  );
}
