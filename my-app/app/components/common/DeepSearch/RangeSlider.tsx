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
    <div className="w-[480px] relative">
      <Slider
        className={cn(
          className,
          "[&>.rc-slider-rail]:!bg-[#E5E5E5]",
          "[&>.rc-slider-track]:!bg-[#171717]",
          "[&>.rc-slider-rail]:!h-2",
          "[&>.rc-slider-track]:!h-2",
          // Hide default handle visuals
          "[&>.rc-slider-handle]:!border-0",
          "[&>.rc-slider-handle]:!bg-transparent",
          "[&>.rc-slider-handle]:!shadow-none"
        )}
        handleStyle={[
          {
            width: "40.5px",
            height: "29px",
            marginTop: "-14.5px",
            border: "none",
            background: "url('/rangehead.svg') no-repeat center",
            backgroundSize: "contain",
            cursor: "pointer",
            opacity: 1,
            // Remove default handle border/shadow
            boxShadow: "none",
            borderColor: "transparent",
          },
          {
            width: "40.5px",
            height: "29px",
            marginTop: "-14.5px",
            border: "none",
            background: "url('/rangehead.svg') no-repeat center",
            backgroundSize: "contain",
            cursor: "pointer",
            opacity: 1,
            // Remove default handle border/shadow
            boxShadow: "none",
            borderColor: "transparent",
          },
        ]}
        activeDotStyle={{
          display: "none", // Hide active dot
        }}
        {...props}
      />
    </div>
  );
}
