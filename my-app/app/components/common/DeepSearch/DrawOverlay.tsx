"use client";

import { useMapStore } from "./mapStore";

export function DrawOverlay() {
  const { drawingMode, drawnPolygons, applyDrawArea, resetDrawArea } =
    useMapStore();

  if (!drawingMode) return null;

  return (
    <div
      className="
        absolute top-0 left-0 w-full
        bg-[rgba(255,255,255,0.6)]
        z-[9999] flex items-center
        px-[15px] text-[16px]
        h-[60px]
      "
    >
      {/* Right – Cancel & Apply */}
      <div className="ml-auto flex items-center gap-[14px]">
        <button
          onClick={resetDrawArea}
          className="bg-transparent text-black text-[16px] cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={applyDrawArea}
          disabled={drawnPolygons.length === 0}
          className="
            bg-transparent text-[16px] rounded-[4px]
            text-black px-[14px] py-[6px] font-normal
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          Apply
        </button>
      </div>
    </div>
  );
}
