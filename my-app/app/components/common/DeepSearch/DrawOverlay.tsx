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
          className="
  appearance-none
  bg-[#FAFAFA]
  border border-[#E5E5E5]
  shadow-none
  outline-none
  focus:outline-none
  focus:ring-0
  active:outline-none
  mr-[3px]
  py-[4px]
  px-[8px]
  rounded-[8px]
  text-black
  text-[16px]
  cursor-pointer
"
        >
          Cancel
        </button>

        <button
          onClick={applyDrawArea}
          disabled={drawnPolygons.length === 0}
          className="
            bg-[#262626] text-[16px] rounded-[4px]
            px-[14px] py-[6px] font-normal
            disabled:cursor-not-allowed
            disabled:opacity-50
            text-[#FAFAFA]
            mr-[27px]
            border-none
            rounded-[8px]
          "
        >
          Save
        </button>
      </div>
    </div>
  );
}
