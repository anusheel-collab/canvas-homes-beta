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
    <div className="space-y-6">
      {/* POSSESSION BY SELECTION (BUTTONS) */}
      <div className="flex flex-col gap-4 items-center justify-center gap-[5px]">
        <div className="flex flex-col gap-[10px] rounded-[12px] bg-[#FAFAFA] border border-[#E5E5E5] w-[555px] h-[133px] px-[20px] pt-[10px] items-start">
          <div className="">Possesion By</div>
          <div className="">
            {field.options?.map((option: any) => {
              const isSelected = selectedValue === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => onFieldChange(field.name, option.value)}
                  className={`${
                    manrope.className
                  } text-[16px] font-semibold text-[#404040] bg-[#FAFAFA] transition-all w-[111px] h-[48px] py-[12px] px-[0px] rounded-[8px] bg-white ${
                    isSelected
                      ? "border-1 border-black"
                      : "border-1 border-[#D4D4D4]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PossessionField;
