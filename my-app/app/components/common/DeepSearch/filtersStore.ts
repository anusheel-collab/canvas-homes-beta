import { create } from "zustand";

interface FilterState {
  // PRICE
  priceMin: number | null;
  priceMax: number | null;
  strictBudget: boolean;
  flexibleBudget: boolean;
  isPriceDropdownOpen: boolean;

  setPriceRange: (min: number | null, max: number | null) => void;
  setStrictBudget: (v: boolean) => void;
  setFlexibleBudget: (v: boolean) => void;
  openPriceDropdown: () => void;
  closePriceDropdown: () => void;

  // CONFIGURATION
  configuration: string[];
  isConfigDropdownOpen: boolean;
  setConfiguration: (values: string[]) => void;
  toggleConfiguration: (value: string) => void;
  openConfigDropdown: () => void;
  closeConfigDropdown: () => void;

  // PROPERTY TYPE
  propertyType: string[];
  isPropertyTypeDropdownOpen: boolean;
  setPropertyType: (values: string[]) => void;
  togglePropertyType: (value: string) => void;
  openPropertyTypeDropdown: () => void;
  closePropertyTypeDropdown: () => void;

  // STATUS
  status: string[];
  isStatusDropdownOpen: boolean;
  setStatus: (values: string[]) => void;
  toggleStatus: (value: string) => void;
  openStatusDropdown: () => void;
  closeStatusDropdown: () => void;

  // Close all dropdowns
  closeAllDropdowns: () => void;

  // Recommended
  recommendedProperties: any[];
  setRecommendedProperties: (p: any[]) => void;

  // SEARCH
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  // PRICE
  priceMin: null,
  priceMax: null,
  strictBudget: false,
  flexibleBudget: false,
  isPriceDropdownOpen: false,

  setPriceRange: (min, max) => set({ priceMin: min, priceMax: max }),
  setStrictBudget: (v) => set({ strictBudget: v }),
  setFlexibleBudget: (v) => set({ flexibleBudget: v }),

  openPriceDropdown: () =>
    set({
      isPriceDropdownOpen: true,
      isConfigDropdownOpen: false,
      isPropertyTypeDropdownOpen: false,
      isStatusDropdownOpen: false,
    }),

  closePriceDropdown: () => set({ isPriceDropdownOpen: false }),

  // CONFIGURATION
  configuration: [],
  isConfigDropdownOpen: false,

  setConfiguration: (values) => set({ configuration: values }),
  toggleConfiguration: (value) =>
    set((state) => ({
      configuration: state.configuration.includes(value)
        ? state.configuration.filter((v) => v !== value)
        : [...state.configuration, value],
    })),

  openConfigDropdown: () =>
    set({
      isConfigDropdownOpen: true,
      isPriceDropdownOpen: false,
      isPropertyTypeDropdownOpen: false,
      isStatusDropdownOpen: false,
    }),

  closeConfigDropdown: () => set({ isConfigDropdownOpen: false }),

  // PROPERTY TYPE
  propertyType: [],
  isPropertyTypeDropdownOpen: false,

  setPropertyType: (values) => set({ propertyType: values }),
  togglePropertyType: (value) =>
    set((state) => ({
      propertyType: state.propertyType.includes(value)
        ? state.propertyType.filter((v) => v !== value)
        : [...state.propertyType, value],
    })),

  openPropertyTypeDropdown: () =>
    set({
      isPropertyTypeDropdownOpen: true,
      isConfigDropdownOpen: false,
      isPriceDropdownOpen: false,
      isStatusDropdownOpen: false,
    }),

  closePropertyTypeDropdown: () => set({ isPropertyTypeDropdownOpen: false }),

  // STATUS
  status: [],
  isStatusDropdownOpen: false,

  setStatus: (values) => set({ status: values }),

  toggleStatus: (value) =>
    set((state) => ({
      status: state.status.includes(value)
        ? state.status.filter((v) => v !== value)
        : [...state.status, value],
    })),

  openStatusDropdown: () =>
    set({
      isStatusDropdownOpen: true,
      isConfigDropdownOpen: false,
      isPriceDropdownOpen: false,
      isPropertyTypeDropdownOpen: false,
    }),

  closeStatusDropdown: () => set({ isStatusDropdownOpen: false }),

  closeAllDropdowns: () =>
    set({
      isStatusDropdownOpen: false,
      isConfigDropdownOpen: false,
      isPriceDropdownOpen: false,
      isPropertyTypeDropdownOpen: false,
    }),

  recommendedProperties: [],
  setRecommendedProperties: (p) => set({ recommendedProperties: p }),

  // SEARCH
  searchQuery: "",
  setSearchQuery: (v) => set({ searchQuery: v }),
}));
