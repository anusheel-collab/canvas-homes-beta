import React from "react";
import RangeField from "../components/RangeField";

interface BudgetFieldProps {
  field: any;
  formData: any;
  onFieldChange: (fieldName: string, value: any) => void;
}

const BudgetField: React.FC<BudgetFieldProps> = ({
  field,
  formData,
  onFieldChange,
}) => {
  const formatBudgetValue = (value: number) => {
    return value >= 10000000
      ? `₹${(value / 10000000).toFixed(2)} Cr`
      : `₹${(value / 100000).toFixed(2)} Lac`;
  };

  return (
    <RangeField
      field={field}
      formData={formData}
      onFieldChange={onFieldChange}
      formatMinValue={formatBudgetValue}
      formatMaxValue={formatBudgetValue}
    />
  );
};

export default BudgetField;
