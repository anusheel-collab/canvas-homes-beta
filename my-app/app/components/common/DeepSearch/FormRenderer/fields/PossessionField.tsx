import React from "react";
import { Manrope } from "next/font/google";

interface PossessionFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
}

const manrope = Manrope({ subsets: ["latin"] });

const PossessionField: React.FC<PossessionFieldProps> = ({
  field,
  formData,
  onFieldChange,
}) => {
  const selectedValue = formData[field.name];
  const optionsCount = field.options?.length || 0;

  // Calculate button width for desktop (all in one line)
  const getDesktopButtonWidth = () => {
    const containerWidth = 515; // 555 - 40 (left/right padding)
    const totalGap = (optionsCount - 1) * 12; // gaps between buttons
    const availableWidth = containerWidth - totalGap;
    const buttonWidth = Math.floor(availableWidth / optionsCount);
    return buttonWidth;
  };

  const desktopButtonWidth = getDesktopButtonWidth();

  return (
    <div className="flex justify-center px-4 sm:px-0">
      {/* POSSESSION BY SELECTION (BUTTONS) */}
      <div className="flex flex-col gap-[10px] rounded-[12px] bg-[#FAFAFA] border border-[#E5E5E5] w-full max-w-[555px] min-h-[133px] px-[12px] sm:px-[20px] pt-[10px] pb-[10px]">
        <div className="font-manrope text-[16px] font-medium text-[#737373]">
          Possession By
        </div>

        {/* Desktop: Single row with calculated widths */}
        <div className="hidden sm:flex gap-[12px]">
          {field.options?.map((option: any) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onFieldChange(field.name, option.value)}
                className={`${
                  manrope.className
                } text-[14px] sm:text-[16px] font-semibold text-[#404040] transition-all h-[48px] rounded-[8px] bg-white border flex items-center justify-center ${
                  isSelected ? "border-black" : "border-[#D4D4D4]"
                }`}
                style={{
                  width: `${desktopButtonWidth}px`,
                  minWidth: "auto",
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Mobile: Grid layout - 3 columns, wraps to 2 on second row (left-aligned) */}
        <div className="grid sm:hidden grid-cols-3 gap-[12px]">
          {field.options?.map((option: any) => {
            const isSelected = selectedValue === option.value;

            return (
              <button
                key={option.value}
                onClick={() => onFieldChange(field.name, option.value)}
                className={`${
                  manrope.className
                } text-[14px] font-semibold text-[#404040] transition-all h-[48px] rounded-[8px] bg-white border flex items-center justify-center ${
                  isSelected ? "border-black" : "border-[#D4D4D4]"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PossessionField;
