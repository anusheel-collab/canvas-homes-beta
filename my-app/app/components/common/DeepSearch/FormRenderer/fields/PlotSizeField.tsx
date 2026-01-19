import React from "react";
import RangeField from "../components/RangeField";

interface PlotSizeFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
}

const PlotSizeField: React.FC<PlotSizeFieldProps> = ({
  field,
  formData,
  onFieldChange,
}) => {
  return (
    <RangeField
      field={field}
      formData={formData}
      onFieldChange={onFieldChange}
      unit=" Sqft"
    />
  );
};

export default PlotSizeField;
