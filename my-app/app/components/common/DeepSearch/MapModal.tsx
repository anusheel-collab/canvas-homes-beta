// components/MapModal.tsx
"use client";

import { Modal } from "./Modal";
import { GoogleMapContainer } from "./GoogleMapContainer";
import { useEffect, useState } from "react";

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
  const [hasDrawnArea, setHasDrawnArea] = useState(false);

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

  // Handle apply selection
  const handleApplySelection = () => {
    if (onMapSelect) {
      onMapSelect({
        type: "map_selection",
        area: "Custom Drawn Area",
        timestamp: new Date().toISOString(),
      });
    }
    onClose();
  };

  // Handle clear selection
  const handleClearSelection = () => {
    console.log("Clear selection requested");
  };

  // Handle use current view
  const handleUseCurrentView = () => {
    if (onMapSelect) {
      onMapSelect({
        type: "current_view",
        area: "Current Map View",
        timestamp: new Date().toISOString(),
      });
    }
    onClose();
  };

  if (!isClient) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search on Map" size="full">
      {/* Map Container - NO LoadScript wrapper */}
      <div className="h-[70vh] w-full relative">
        {isOpen && (
          <GoogleMapContainer
            isModal={true}
            initialCenter={initialLocation}
            onMapSelect={onMapSelect}
          />
        )}
      </div>

      {/* Instructions and Controls */}
      <div className="px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-1">How to use:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click "Draw" button to start drawing on the map</li>
              <li>• Click on the map to create polygon points</li>
              <li>• Double-click or click "Apply" to finish drawing</li>
              <li>• Use "Remove Boundary" to clear your selection</li>
            </ul>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleClearSelection}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={handleUseCurrentView}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Use Current View
            </button>
            <button
              onClick={handleApplySelection}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium transition-colors"
            >
              Apply Selection
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status:</p>
              <p className="font-medium text-gray-800">
                {hasDrawnArea ? "Area selected" : "Ready to draw"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tip:</p>
              <p className="font-medium text-gray-800">
                Draw precise boundaries for accurate results
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}