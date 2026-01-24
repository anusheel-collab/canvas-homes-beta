"use client";

import { Modal } from "./Modal";
import { GoogleMapContainer } from "./GoogleMapContainer";
import { useEffect, useState, useRef } from "react";

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
  const [isReady, setIsReady] = useState(false);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    setIsClient(true);
    // Set ready state after a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    console.log("Hare Krishna", isOpen);
  }, [isOpen]);

  // Reset ready state when modal opens
  useEffect(() => {
    if (isOpen && !hasOpenedRef.current) {
      setIsReady(true);
      hasOpenedRef.current = true;
    }
  }, [isOpen]);

  // Handle escape key and body scroll - FIXED VERSION
  useEffect(() => {
    if (!isOpen) return;

    // Save original styles
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Lock body scroll
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      // Restore original styles
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen, onClose]);

  // Don't render anything if not client-side
  if (!isClient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="map"
      className="" // Remove custom positioning classes
    >
      {/* Always render GoogleMapContainer when modal is open and ready */}
      {isOpen && isReady && (
        <div className="w-full h-full relative">
          <GoogleMapContainer
            isModal={true}
            initialCenter={initialLocation}
            onMapSelect={onMapSelect}
            onClose={onClose}
          />
        </div>
      )}
    </Modal>
  );
}
