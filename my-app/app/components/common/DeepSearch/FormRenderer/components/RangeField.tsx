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
    <div className="max-w-2xl mx-auto space-y-8">
      {/* RANGE SLIDER */}
      <div className="px-4">
        <RangeSlider
          range
          min={field.minValue}
          max={field.maxValue}
          value={[rangeValue.min, rangeValue.max]}
          onChange={(value: any) => handleRangeChange(value)}
          className={cn("[&>.rc-slider-step]:hidden")}
        />
      </div>
      {/* MIN AND MAX VALUE INPUTS */}
      <div className="flex items-center justify-center gap-6">
        {/* MIN VALUE INPUT */}
        <div className="flex-1 max-w-xs">
          <div className="overflow-hidden w-[212px] px-[16px] py-[4px] translate-x-[598px] translate-y-[40px] rounded-[6px] h-[60px] border-2 border-[#D4D4D4] rounded-2xl bg-white shadow-sm">
            <div className="w-6 h-6 relative ">
              <Image
                src={minIcon}
                alt={unit === "Sqft" ? "Min area" : "₹"}
                width={38}
                height={38}
                className="text-[#525252] translate-y-[11px]"
                // style={{
                //   filter:
                //     "invert(31%) sepia(0%) saturate(1688%) hue-rotate(196deg) brightness(98%) contrast(90%)",
                // }}
              />
            </div>
            <div className=" ml-[9px] translate-x-[40px]  translate-y-[-30px]">
              <div
                className="
    px-5 pt-3
    translate-y-[-10px]
    font-manrope
    text-[14px]
    font-medium
    leading-[150%]
    text-[#737373]
  "
              >
                From
              </div>
              <input
                type="text"
                value={formatIndianNumber(rangeValue.min)}
                onChange={(e) => handleMinChange(parseInt(e.target.value))}
                className="
    w-full
    border-none
    bg-transparent
    translate-y-[-7px]
    px-5
    pb-3
    font-manrope
    text-[19px]
    font-semibold
    leading-[150%]
    text-[#262626]
    outline-none
    focus:outline-none
    focus:ring-0
    focus:shadow-none
  "
                min={field.minValue}
                max={rangeValue.max}
                readOnly
              />
            </div>
          </div>
          <div className="font-manrope text-[14px] translate-x-[600px] translate-y-[44px] font-medium leading-[150%] text-[#737373]">
            {formatMinValue
              ? formatMinValue(rangeValue.min)
              : `${rangeValue.min}${unit}`}
          </div>
        </div>

        {/* MAX VALUE INPUT */}
        <div className="flex-1 max-w-xs">
          <div className="overflow-hidden w-[212px] h-[60px] px-[16px] py-[4px] translate-x-[10px] translate-y-[40px] border-2 border-[#D4D4D4] rounded-[6px] bg-white shadow-sm">
            <div className="flex items-center px-5 pt-3">
              <div className="w-6 h-6 relative">
                <Image
                  src={maxIcon}
                  alt={unit === "Sqft" ? "Max area" : "₹"}
                  width={38}
                  height={38}
                  className="text-[#525252] translate-y-[11px]"
                  // style={{
                  //   filter:
                  //     "invert(31%) sepia(0%) saturate(1688%) hue-rotate(196deg) brightness(98%) contrast(90%)",
                  // }}
                />
              </div>
            </div>
            <div className=" ml-[9px] translate-x-[40px]  translate-y-[-30px]">
              <div
                className="
    px-5 pt-3
    translate-y-[-10px]
    font-manrope
    text-[14px]
    font-medium
    leading-[150%]
    text-[#737373]
  "
              >
                To
              </div>
              <input
                type="text"
                value={formatIndianNumber(rangeValue.max)}
                onChange={(e) => handleMaxChange(parseInt(e.target.value))}
                className="
    w-full
    border-none
    bg-transparent
    translate-y-[-7px]
    px-5
    pb-3
    font-manrope
    text-[19px]
    font-semibold
    leading-[150%]
    text-[#262626]
    outline-none
    focus:outline-none
    focus:ring-0
    focus:shadow-none
  "
                min={rangeValue.min}
                readOnly
              />
            </div>
          </div>
          <div className="font-manrope text-[14px] translate-x-[10px] translate-y-[44px] font-medium leading-[150%] text-[#737373]">
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
