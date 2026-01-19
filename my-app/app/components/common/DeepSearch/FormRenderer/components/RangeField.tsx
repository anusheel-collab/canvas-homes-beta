import React from "react";
import RangeSlider from "../../RangeSlider";
import { cn } from "../../utils/cn";

interface RangeFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
  formatMinValue?: (value: number) => string;
  formatMaxValue?: (value: number) => string;
  unit?: string;
}

const RangeField: React.FC<RangeFieldProps> = ({
  field,
  formData,
  onFieldChange,
  formatMinValue,
  formatMaxValue,
  unit = "",
}) => {
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
          <div className="overflow-hidden border-2 border-[#D4D4D4] rounded-2xl bg-white shadow-sm">
            <div className="px-5 pt-3 text-sm text-gray-500 font-manrope text-[14px]">
              From
            </div>
            <input
              type="number"
              value={rangeValue.min}
              onChange={(e) => handleMinChange(parseInt(e.target.value))}
              className="w-full border-none bg-white px-5 pb-3 text-2xl font-bold text-gray-800 outline-none focus:shadow-none focus:ring-0 font-manrope text-[24px]"
              style={{
                fontWeight: 700,
              }}
              min={field.minValue}
              max={rangeValue.max}
              readOnly
            />
            <div className="px-5 pb-3 text-xs text-gray-400 font-manrope text-[12px]">
              {formatMinValue
                ? formatMinValue(rangeValue.min)
                : `${rangeValue.min}${unit}`}
            </div>
          </div>
        </div>

        {/* MAX VALUE INPUT */}
        <div className="flex-1 max-w-xs">
          <div className="overflow-hidden border-2 border-[#D4D4D4] rounded-2xl bg-white shadow-sm">
            <div className="px-5 pt-3 text-sm text-gray-500 font-manrope text-[14px]">
              To
            </div>
            <input
              type="number"
              value={rangeValue.max}
              onChange={(e) => handleMaxChange(parseInt(e.target.value))}
              className="w-full border-none bg-white px-5 pb-3 text-2xl font-bold text-gray-800 outline-none focus:shadow-none focus:ring-0 font-manrope text-[24px]"
              style={{
                fontWeight: 700,
              }}
              min={rangeValue.min}
              readOnly
            />
            <div className="px-5 pb-3 text-xs text-gray-400 font-manrope text-[12px]">
              {formatMaxValue
                ? formatMaxValue(rangeValue.max)
                : `${rangeValue.max}${unit}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeField;
