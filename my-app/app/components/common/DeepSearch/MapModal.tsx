// components/MapModal.tsx
"use client";

import { Modal } from "./Modal";
import { GoogleMapContainer } from "./GoogleMapContainer";
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMapSelect?: (selectedArea: any) => void;
  initialLocation?: {
    lat: number;
    lng: number;
  };
}

export function MapModal({
  isOpen,
  onClose,
  onMapSelect,
  initialLocation,
}: MapModalProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isClient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Draw Your Preferred Area"
      size="full"
    >
      {/* Map Container */}
      <div className="h-[calc(100vh-120px)] w-full">
        {isOpen && (
          <GoogleMapContainer
            isModal={true}
            initialCenter={initialLocation}
            onMapSelect={onMapSelect}
          />
        )}
      </div>

      {/* Simple Footer with only Save and Cancel */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-200">
        <div className="flex items-center justify-end gap-3 px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={() => {
              // This will be handled by GoogleMapContainer's apply button
              console.log("Save clicked - handled by map component");
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Area
          </button>
        </div>
      </div>
    </Modal>
  );
}
