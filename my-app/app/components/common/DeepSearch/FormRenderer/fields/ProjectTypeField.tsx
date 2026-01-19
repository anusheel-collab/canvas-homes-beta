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
  const selectedValue = formData[field.name];

  return (
    <div className="space-y-6">
      {/* PROJECT TYPE SELECTION (VISUAL CARDS) */}
      <div className="flex flex-wrap justify-center gap-6">
        {field.options?.map((option: any) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onFieldChange(field.name, option.value)}
              className={`relative text-center transition-all bg-white py-[12px_20px] px-[16px] rounded-[16px] ${
                isSelected
                  ? "border-2 border-black"
                  : "border-2 border-[#A3A3A3]"
              }`}
              style={{
                width: "168px",
              }}
            >
              <div className="flex flex-col items-center gap-3">
                {/* PROJECT TYPE ICON */}
                <div className="w-full h-32 flex items-center justify-center">
                  <img
                    src={`/${
                      option.value === "prelaunch"
                        ? "PreLaunch"
                        : option.value === "underconstruction"
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
                <div className="font-manrope text-[18px] font-semibold text-gray-800">
                  {option.label}
                </div>

                {/* SELECTION RADIO BUTTON */}
                <div
                  className={`w-6 h-6 border-2 flex items-center justify-center ${
                    isSelected
                      ? "bg-black border-black"
                      : "border-gray-400 bg-white"
                  } rounded-[4px]`}
                >
                  {isSelected && (
                    <svg
                      className="w-4 h-4 text-white"
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTypeField;
