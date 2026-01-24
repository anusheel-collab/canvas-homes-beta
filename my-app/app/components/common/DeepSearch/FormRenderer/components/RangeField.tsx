import React from "react";
import RangeSlider from "../../RangeSlider";
import { cn } from "../../utils/cn";
import Image from "next/image";

interface RangeFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
  formatMinValue?: (value: number) => string;
  formatMaxValue?: (value: number) => string;
  unit?: string;
}

const formatIndianNumber = (value: number) => {
  if (value == null) return "";
  return value.toLocaleString("en-IN");
};

const RangeField: React.FC<RangeFieldProps> = ({
  field,
  formData,
  onFieldChange,
  formatMinValue,
  formatMaxValue,
  unit = "",
}) => {
  // 1. Get the unit from the field object (as defined in your formConfig)
  const currentUnit = field.unit || "";

  // 2. Normalize for case sensitivity ("Sqft" vs "sqft")
  const isSqft = currentUnit.toLowerCase() === "sqft";

  const minIcon = isSqft ? "/minimize.svg" : "/Rupee.svg";
  const maxIcon = isSqft ? "/maximize.svg" : "/Rupee.svg";

  const rangeValue = formData[field.name] || {
    min: field.minValue,
    max: field.maxValue,
  };

  const handleRangeChange = (value: any) => {
    onFieldChange(field.name, {
      min: value[0],
      max: value[1],
    });
  };

  const handleMaxChange = (max: number) => {
    onFieldChange(field.name, {
      ...rangeValue,
      max: max || rangeValue.min,
    });
  };

  const handleMinChange = (min: number) => {
    onFieldChange(field.name, {
      ...rangeValue,
      min: min || field.minValue || 0,
    });
  };

  return (
    <div className="w-full space-y-8">
      {/* RANGE SLIDER - 480px width, centered */}
      <div>
        <RangeSlider
          range
          min={field.minValue}
          max={field.maxValue}
          value={[rangeValue.min, rangeValue.max]}
          onChange={(value: any) => handleRangeChange(value)}
          className={cn("[&>.rc-slider-step]:hidden")}
        />
      </div>

      {/* MIN AND MAX VALUE INPUTS - Below slider */}
      <div className="flex items-start justify-center gap-14 px-4">
        {/* MIN VALUE INPUT - Left side */}
        <div className="w-[212px]">
          <div className="h-[60px] px-4 py-2 border-2 border-[#D4D4D4] rounded-[6px] bg-white shadow-sm">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 pt-1">
                <Image
                  src={minIcon}
                  alt={isSqft ? "Min area" : "₹"}
                  width={32}
                  height={32}
                  className="text-[#525252]"
                />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="font-manrope text-[14px] font-medium leading-[150%] text-[#737373]">
                  From
                </div>
                <input
                  type="text"
                  value={formatIndianNumber(rangeValue.min)}
                  onChange={(e) => handleMinChange(parseInt(e.target.value))}
                  className="w-full border-none bg-transparent font-manrope text-[19px] font-semibold leading-[150%] text-[#262626] outline-none focus:outline-none focus:ring-0 p-0"
                  min={field.minValue}
                  max={rangeValue.max}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="mt-2 font-manrope text-[14px] font-medium leading-[150%] text-[#737373]">
            {formatMinValue
              ? formatMinValue(rangeValue.min)
              : `${rangeValue.min}${unit}`}
          </div>
        </div>

        {/* MAX VALUE INPUT - Right side */}
        <div className="w-[212px]">
          <div className="h-[60px] px-4 py-2 border-2 border-[#D4D4D4] rounded-[6px] bg-white shadow-sm">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 pt-1">
                <Image
                  src={maxIcon}
                  alt={isSqft ? "Max area" : "₹"}
                  width={32}
                  height={32}
                  className="text-[#525252]"
                />
              </div>

              {/* Text content */}
              <div className="flex-1 min-w-0">
                <div className="font-manrope text-[14px] font-medium leading-[150%] text-[#737373]">
                  To
                </div>
                <input
                  type="text"
                  value={formatIndianNumber(rangeValue.max)}
                  onChange={(e) => handleMaxChange(parseInt(e.target.value))}
                  className="w-full border-none bg-transparent font-manrope text-[19px] font-semibold leading-[150%] text-[#262626] outline-none focus:outline-none focus:ring-0 p-0"
                  min={rangeValue.min}
                  readOnly
                />
              </div>
            </div>
          </div>
          <div className="mt-2 font-manrope text-[14px] font-medium leading-[150%] text-[#737373]">
            {formatMaxValue
              ? formatMaxValue(rangeValue.max)
              : `${rangeValue.max}${unit}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeField;
