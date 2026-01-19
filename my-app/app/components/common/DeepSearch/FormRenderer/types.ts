// ============================================
// INTERFACE DEFINITIONS
// ============================================

export interface FormRendererProps {
  onStepChange: (currentStep: number) => void;
  currentStep: number;
  onValidationChange?: (isValid: boolean) => void;
  onFormDataUpdate?: (formData: any) => void;
}

export interface FormData {
  [key: string]: any;
}

export interface SearchQuery {
  [key: string]: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  type: "suggestion" | "current" | "map";
}

export interface MapModalData {
  showMapModal: boolean;
  activeField: string | null;
}

export interface LocationState {
  userLocation: { lat: number; lng: number } | null;
  isLocating: boolean;
  locationError: string | null;
}

export interface MapPreviewState {
  selectedLocation: LocationData | null;
  selectedRadius: number;
  showMapPreview: boolean;
}

export interface SuggestionState {
  suggestions: string[];
  showSuggestions: boolean;
}

export interface FormLogicState {
  formData: FormData;
  searchQuery: SearchQuery;
  suggestions: string[];
  showSuggestions: boolean;
  showMapModal: boolean;
  activeField: string | null;
  userLocation: { lat: number; lng: number } | null;
  isLocating: boolean;
  locationError: string | null;
  selectedLocation: LocationData | null;
  selectedRadius: number;
  showMapPreview: boolean;
}

export type FormLogicUpdate = {
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  setShowSuggestions: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMapModal: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveField: React.Dispatch<React.SetStateAction<string | null>>;
  setUserLocation: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
  setIsLocating: React.Dispatch<React.SetStateAction<boolean>>;
  setLocationError: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedLocation: React.Dispatch<
    React.SetStateAction<LocationData | null>
  >;
  setSelectedRadius: React.Dispatch<React.SetStateAction<number>>;
  setShowMapPreview: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface FormLogicReturn extends FormLogicState, FormLogicUpdate {
  handleFieldChange: (fieldName: string, value: any) => void;
  handleAutocomplete: (
    fieldName: string,
    query: string,
    field: any,
  ) => Promise<void>;
  selectSuggestion: (fieldName: string, value: string) => void;
  getCurrentLocation: () => void;
  handleMapSelection: (selectedArea: any) => void;
  handleInputFocus: () => void;
  isStepValid: boolean;
  currentVisibleStep: any;
  currentStepConfig: any;
  totalVisibleSteps: number;
  visibleFields: any[];
  currentTitle: string;
  inventoryCount: string;
}
