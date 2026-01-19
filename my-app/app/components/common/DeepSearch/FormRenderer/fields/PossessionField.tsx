import React from "react";

interface PossessionFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
}

const PossessionField: React.FC<PossessionFieldProps> = ({
  field,
  formData,
  onFieldChange,
}) => {
  const selectedValue = formData[field.name];

  return (
    <div className="space-y-6">
      {/* POSSESSION BY SELECTION (BUTTONS) */}
      <div className="flex flex-wrap justify-center gap-6">
        {field.options?.map((option: any) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onFieldChange(field.name, option.value)}
              className={`font-manrope text-[16px] font-semibold text-[#404040] transition-all w-[173px] h-[48px] py-[12px] px-[24px] rounded-[16px] bg-white ${
                isSelected
                  ? "border-2 border-black"
                  : "border-2 border-[#A3A3A3]"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PossessionField;
