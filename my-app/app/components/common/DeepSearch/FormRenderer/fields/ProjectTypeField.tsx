import React from "react";

interface ProjectTypeFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
}

const ProjectTypeField: React.FC<ProjectTypeFieldProps> = ({
  field,
  formData,
  onFieldChange,
}) => {
  // Now selectedValue should be an array
  const selectedValues = formData[field.name] || [];

  const handleToggle = (optionValue: string) => {
    const currentValues = Array.isArray(selectedValues) ? selectedValues : [];

    if (currentValues.includes(optionValue)) {
      // Remove if already selected
      onFieldChange(
        field.name,
        currentValues.filter((v) => v !== optionValue),
      );
    } else {
      // Add if not selected
      onFieldChange(field.name, [...currentValues, optionValue]);
    }
  };

  return (
    <div className="space-y-6">
      {/* PROJECT TYPE SELECTION (VISUAL CARDS) */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-5 lg:gap-6">
        {field.options?.map((option: any) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => handleToggle(option.value)}
              className={`relative text-center transition-all bg-white px-[12px] md:px-[14px] lg:px-[16px] rounded-[12px] md:rounded-[14px] lg:rounded-[16px] w-[143px] md:w-[200px] lg:w-[250px] h-[171px] md:h-[217px] lg:h-[225px] ${
                isSelected
                  ? "border-2 border-black"
                  : "border-2 border-[#A3A3A3]"
              }`}
            >
              <div className="flex flex-col items-center gap-0 h-full justify-between py-[8px] md:py-[10px] lg:py-[12px]">
                {/* PROJECT TYPE ICON */}
                <div className="w-[115px] h-[95px] md:w-[160px] md:h-[130px] lg:w-[210px] lg:h-[140px] flex items-center justify-center">
                  <img
                    src={`/${
                      option.value === "preLaunch"
                        ? "PreLaunch"
                        : option.value === "underConstruction"
                        ? "UnderConstruction"
                        : "ReadyToMove"
                    }.svg`}
                    alt={option.label}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* PROJECT TYPE LABEL */}
                <div className="font-manrope text-[14px] md:text-[16px] lg:text-[18px] font-semibold text-gray-800 flex items-center justify-center px-1">
                  {option.label}
                </div>

                {/* SELECTION CHECKBOX */}
                <div className="flex items-center justify-center">
                  <div
                    className={`w-5 h-5 md:w-6 md:h-6 border-2 flex items-center justify-center ${
                      isSelected
                        ? "bg-black border-black"
                        : "border-gray-400 bg-white"
                    } rounded-[4px]`}
                  >
                    {isSelected && (
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTypeField;
