import {
  MapPin,
  Home,
  Maximize2,
  DollarSign,
  Building2,
  Users,
} from "lucide-react";

export interface FormField {
  name: string;
  type:
    | "autocomplete"
    | "multiselect"
    | "multiselect-search"
    | "singleselect"
    | "range";
  label: string;
  placeholder?: string;
  required: boolean;
  icon?: any;
  options?: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  minValue?: number;
  maxValue?: number;
  step?: number;
  unit?: string;
  searchPlaceholder?: string;
  condition?: (formData: any) => boolean;
  filterOptions?: (options: any[], formData: any) => any[];
  getSuggestions?: (query: string) => string[];
  formatValue?: (value: number) => string;
}

export interface FormStep {
  id: string;
  title: string | ((formData: any) => string);
  fields: FormField[];
  condition?: (formData: any) => boolean; // Optional condition for showing the step
}

export interface FormConfig {
  steps: FormStep[];
}

export const formConfig: FormConfig = {
  steps: [
    {
      id: "location",
      title: "Tell us your preferred location or area to start",
      fields: [
        {
          name: "location",
          type: "autocomplete",
          label: "Search for a locality",
          placeholder: "Search for a locality (e.g. Indiranagar)",
          required: true,
          icon: MapPin,
          getSuggestions: (query: string) => {
            const locations = [
              "Koramangala, Bengaluru",
              "Sector 2, Koramangala, Bengaluru",
              "Indiranagar, Bengaluru",
              "Whitefield, Bengaluru",
              "HSR Layout, Bengaluru",
              "Electronic City, Bengaluru",
              "Marathahalli, Bengaluru",
            ];
            return locations.filter((loc) =>
              loc.toLowerCase().includes(query.toLowerCase())
            );
          },
        },
      ],
    },

    {
      id: "propertyType",
      title: "Perfect! Now, let's narrow down the property type a bit more.",
      fields: [
        {
          name: "propertyType",
          type: "multiselect",
          label: "Property Type",
          required: true,
          icon: Home,
          options: [
            { value: "plot", label: "Plot", icon: "📐" },
            { value: "apartment", label: "Apartment", icon: "🏢" },
            { value: "villa", label: "Villa", icon: "🏡" },
            { value: "villament", label: "Villament", icon: "🏘️" },
            { value: "rowHouses", label: "Row Houses", icon: "🏘️" },
          ],
        },
      ],
    },

    // Plot size step (only shown if plot is selected)
    {
      id: "plotSize",
      title: "Understood. What range of plot size are you looking for?",
      fields: [
        {
          name: "plotSize",
          type: "range",
          label: "Plot Size Range",
          unit: "Sqft",
          required: true,
          icon: Maximize2,
          minValue: 0,
          maxValue: 50000,
          step: 1000,
        },
      ],
      condition: (formData: any) => {
        const selectedTypes = formData?.propertyType || [];
        return selectedTypes.includes("plot");
      },
    },

    // Configuration step (only shown if non-plot types are selected)
    {
      id: "configuration",
      title: "Perfect. Which specific configurations do you have in mind?",
      fields: [
        {
          name: "configuration",
          type: "multiselect",
          label: "Configuration",
          required: true,
          icon: Home,
          options: [
            { value: "studio", label: "Studio" },
            { value: "1bhk", label: "1 BHK" },
            { value: "1.5bhk", label: "1.5 BHK" },
            { value: "2bhk", label: "2 BHK" },
            { value: "2.5bhk", label: "2.5 BHK" },
            { value: "3bhk", label: "3 BHK" },
            { value: "3.5bhk", label: "3.5 BHK" },
            { value: "4bhk", label: "4 BHK" },
            { value: "5+bhk", label: "5+ BHK" },
          ],
          filterOptions: (options: any[], formData: any) => {
            const types = formData.propertyType || [];
            const hasApartment = types.includes("apartment");
            
            // Show studio only if apartment is selected
            if (!hasApartment) {
              options = options.filter((opt) => opt.value !== "studio");
            }
            
            // Remove 1bhk for villa, villament, rowHouses
            if (
              types.some((t: string) =>
                ["villa", "villament", "rowHouses"].includes(t)
              )
            ) {
              options = options.filter((opt) => opt.value !== "1bhk");
            }
            
            return options;
          },
        },
      ],
      condition: (formData: any) => {
        const selectedTypes = formData?.propertyType || [];
        // Show if any non-plot type is selected
        return selectedTypes.some((type: string) => 
          ["apartment", "villa", "villament", "rowHouses"].includes(type)
        );
      },
    },

    {
      id: "budget",
      title: "Almost done! What is your preferred budget range?",
      fields: [
        {
          name: "budget",
          type: "range",
          label: "Budget Range",
          unit: "₹",
          required: true,
          icon: DollarSign,
          minValue: 2500000,
          maxValue: 31000000,
          step: 100000,
          formatValue: (value: number) => {
            if (value >= 10000000) {
              return `₹${(value / 10000000).toFixed(2)} Cr`;
            }
            return `₹${(value / 100000).toFixed(2)} Lac`;
          },
        },
      ],
    },

    {
      id: "projectType",
      title: "Select your preferred project type",
      fields: [
        {
          name: "projectType",
          type: "multiselect",
          label: "Project Type",
          required: true,
          icon: Building2,
          options: [
            { value: "preLaunch", label: "Pre Launch", icon: "📋" },
            {
              value: "underConstruction",
              label: "Under Construction",
              icon: "🏗️",
            },
            {
              value: "readyToMove",
              label: "Ready to Move",
              icon: "🏠",
            },
          ],
        },
        {
          name: "possessionBy",
          type: "singleselect",
          label: "Possession By",
          required: true,
          options: [
            { value: "within1yr", label: "Within 1 Yr" },
            { value: "1yr-2yr", label: "1 Yr - 2 Yr" },
            { value: "2yr-3yr", label: "2 Yr - 3 Yr" },
            { value: "3yr-4yr", label: "3 Yr - 4 Yr" },
            { value: "4+yrs", label: "4+ Yrs" },
          ],
          condition: (formData: any) =>
            formData.projectType && formData.projectType.length > 0,
        },
      ],
    },

    {
      id: "developer",
      title: "Do you have a specific type of developer in mind?",
      fields: [
        {
          name: "developer",
          type: "multiselect-search",
          label: "Developers",
          required: false,
          icon: Users,
          searchPlaceholder: "Search developers",
          options: [
            { value: "assetz", label: "Assetz" },
            { value: "sattva", label: "Sattva" },
            { value: "embassy", label: "Embassy" },
            { value: "prestige", label: "Prestige" },
            { value: "brigade", label: "Brigade" },
            { value: "sobha", label: "Sobha" },
            { value: "godrej", label: "Godrej" },
          ],
        },
      ],
    },
  ],
};