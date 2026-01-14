import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "./utils/cn";
import Slider from "rc-slider";
import type { SliderProps } from "rc-slider";
import "rc-slider/assets/index.css";

const rangeSlider = tv({
  slots: {
    container:
      "[&>.rc-slider-rail]:!bg-gray-200 [&>.rc-slider-handle]:!opacity-100 [&>.rc-slider-handle-dragging]:!shadow-none [&>.rc-slider-handle-dragging]:!ring-4 [&>.rc-slider-track]:!bg-black [&>.rc-slider-handle]:!border-black [&>.rc-slider-handle]:hover:!border-black [&>.rc-slider-handle-dragging]:!border-black [&>.rc-slider-handle-dragging]:!ring-black/20 [&>.rc-slider-step>.rc-slider-dot-active]:!border-black",
  },
  variants: {
    size: {
      sm: {
        container:
          "[&>.rc-slider-rail]:!h-0.5 [&>.rc-slider-track]:!h-0.5 [&>.rc-slider-handle]:!h-3 [&>.rc-slider-handle]:!w-3 [&>.rc-slider-handle]:!border-[3px]",
      },
      md: {
        container:
          "[&>.rc-slider-rail]:!h-1 [&>.rc-slider-track]:!h-1 [&>.rc-slider-handle]:!h-4 [&>.rc-slider-handle]:!w-4 [&>.rc-slider-handle]:!border-4 [&>.rc-slider-handle]:!-mt-1.5",
      },
      lg: {
        container:
          "[&>.rc-slider-rail]:!h-2 [&>.rc-slider-track]:!h-2 [&>.rc-slider-handle]:!h-5 [&>.rc-slider-handle]:!w-5 [&>.rc-slider-handle]:!border-[5px] [&>.rc-slider-handle]:!-mt-1.5",
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface RangeSliderProps extends SliderProps {
  size?: VariantProps<typeof rangeSlider>["size"];
}

export default function RangeSlider({
  size = "md",
  className,
  ...props
}: RangeSliderProps) {
  const { container: containerClass } = rangeSlider({ size });
  return <Slider className={cn(containerClass(), className)} {...props} />;
}
