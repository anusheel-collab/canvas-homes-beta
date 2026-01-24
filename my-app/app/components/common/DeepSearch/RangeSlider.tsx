import React from "react";
import { cn } from "./utils/cn";
import Slider from "rc-slider";
import type { SliderProps } from "rc-slider";
import "rc-slider/assets/index.css";

export interface RangeSliderProps extends SliderProps {
  size?: "sm" | "md" | "lg";
}

export default function RangeSlider({
  size = "md",
  className,
  ...props
}: RangeSliderProps) {
  return (
    <div className="relative flex justify-center w-full">
      <style jsx global>{`
        /* Completely override rc-slider handle styles */
        .rc-slider-handle {
          width: 40.5px !important;
          height: 29px !important;
          margin-top: -6.5px !important;
          border: none !important;
          background: url("/rangehead.svg") no-repeat center !important;
          background-size: contain !important;
          cursor: pointer !important;
          opacity: 1 !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }

        .rc-slider-handle:focus,
        .rc-slider-handle:active,
        .rc-slider-handle-click-focused:focus,
        .rc-slider-handle-dragging {
          border: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
        }

        /* Hide the inner dot of rc-slider handle */
        .rc-slider-handle::after {
          display: none !important;
        }

        /* Change bar height to 16px */
        .rc-slider-rail {
          height: 16px !important;
          background-color: #e5e5e5 !important;
          border-radius: 8px !important;
        }

        .rc-slider-track {
          height: 16px !important;
          background-color: #171717 !important;
          border-radius: 8px !important;
        }
      `}</style>

      <div className="w-[480px]">
        <Slider className={cn(className)} {...props} />
      </div>
    </div>
  );
}
