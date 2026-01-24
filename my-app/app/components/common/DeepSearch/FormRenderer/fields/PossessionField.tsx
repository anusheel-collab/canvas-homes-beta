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

  return (
    <div className="flex justify-center px-4 sm:px-0">
      {/* POSSESSION BY SELECTION (BUTTONS) */}
      <div className="flex flex-col gap-[10px] rounded-[12px] bg-[#FAFAFA] border border-[#E5E5E5] w-full max-w-[555px] min-h-[133px] px-[12px] sm:px-[20px] pt-[10px] pb-[10px]">
        <div className="font-manrope text-[16px] font-medium text-[#737373]">
          Possession By
        </div>
        <div className="flex gap-[8px] sm:gap-[12px] flex-wrap sm:flex-nowrap overflow-x-auto">
          {field.options?.map((option: any) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                onClick={() => onFieldChange(field.name, option.value)}
                className={`${
                  manrope.className
                } text-[14px] sm:text-[16px] font-semibold text-[#404040] transition-all min-w-[100px] sm:w-[120px] h-[48px] rounded-[8px] bg-white border flex items-center justify-center flex-shrink-0 ${
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
