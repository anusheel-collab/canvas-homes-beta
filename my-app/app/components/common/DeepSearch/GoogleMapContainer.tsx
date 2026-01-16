// components/GoogleMapContainer.tsx
"use client";

import { GoogleMap, Marker } from "@react-google-maps/api";
import { useCallback, useState, useEffect } from "react";
import { useMapStore } from "./mapStore";
import { useMapsApi } from "./MapsContext";
import { DrawTool } from "./DrawTool";
import { DrawOverlay } from "./DrawOverlay";

const containerStyle = {
  width: "100%",
  height: "100%",
};

interface gMapProps {
  isMobile?: boolean;
  isModal?: boolean;
  initialCenter?: {
    lat: number;
    lng: number;
  };
  onMapSelect?: (selectedArea: any) => void;
}

const bangaloreCenter = { lat: 12.9716, lng: 77.5946 };

// Simple marker for reference
const REFERENCE_MARKERS = [
  { id: 1, lat: 12.9716, lng: 77.5946, title: "Bangalore Center" },
  { id: 2, lat: 12.9279, lng: 77.6271, title: "Koramangala" },
  { id: 3, lat: 13.0356, lng: 77.597, title: "Yelahanka" },
];

export function GoogleMapContainer({
  isMobile,
  isModal = false,
  initialCenter,
  onMapSelect,
}: gMapProps) {
  const { isLoaded, loadError } = useMapsApi();

  // LOADING CHECK AT THE BEGINNING
  if (!isLoaded) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Map...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <div className="text-red-500 text-xl mb-2">⚠️ Error Loading Map</div>
          <p className="text-gray-600">
            Please check your internet connection.
          </p>
        </div>
      </div>
    );
  }

  const {
    map,
    setMap,
    selectedPropertyId,
    setSelectedPropertyId,
    hoveredPropertyId,
    setHoveredPropertyId,
    drawnPolygons,
    applyDrawArea,
    resetDrawArea,
  } = useMapStore();

  // ============================================
  // CURRENT LOCATION STATES
  // ============================================
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Use initial center or default to bangalore
  const center = initialCenter || bangaloreCenter;

  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);

      // If modal, set specific options
      if (isModal) {
        mapInstance.setOptions({
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
          },
          fullscreenControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          gestureHandling: "greedy",
        });
      }
    },
    [setMap, isModal]
  );

  // Handle apply selection from modal
  const handleApplySelection = useCallback(() => {
    if (drawnPolygons.length > 0 && onMapSelect) {
      const selectedArea = {
        type: "polygon",
        coordinates: drawnPolygons.map((poly) => poly.path),
        area: "Custom Drawn Area",
        count: drawnPolygons.length,
        timestamp: new Date().toISOString(),
      };
      onMapSelect(selectedArea);
    }
    applyDrawArea();
  }, [drawnPolygons, onMapSelect, applyDrawArea]);

  // Handle clear selection
  const handleClearSelection = useCallback(() => {
    resetDrawArea();
    console.log("Selection cleared");
  }, [resetDrawArea]);

  // Handle marker click
  const handleMarkerClick = useCallback(
    (markerId: string | number) => {
      setSelectedPropertyId(String(markerId));
      const marker = REFERENCE_MARKERS.find((m) => m.id === markerId);
      if (marker && map) {
        map.panTo({ lat: marker.lat, lng: marker.lng });
      }
    },
    [map, setSelectedPropertyId]
  );

  const handleMarkerMouseOver = useCallback(
    (markerId: string | number) => {
      setHoveredPropertyId(String(markerId));
    },
    [setHoveredPropertyId]
  );

  const handleMarkerMouseOut = useCallback(() => {
    setHoveredPropertyId(null);
  }, [setHoveredPropertyId]);

  // ============================================
  // CURRENT LOCATION HANDLER
  // ============================================
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };

        setUserLocation(newLocation);

        // Center map on user's location
        if (map) {
          map.panTo(newLocation);
          map.setZoom(15);
        }

        setIsLocating(false);
        console.log("User location found:", newLocation);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              "Location access denied. Please enable location services."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [map]);

  // Auto-clear location errors after 5 seconds
  useEffect(() => {
    if (locationError) {
      const timer = setTimeout(() => {
        setLocationError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [locationError]);

  // Map options based on modal mode
  const mapOptions = {
    disableDefaultUI: isModal,
    zoomControl: true,
    zoomControlOptions: isModal
      ? {
          position: google.maps.ControlPosition.LEFT_CENTER,
        }
      : undefined,
    fullscreenControl: !isModal,
    mapTypeControl: false,
    streetViewControl: false,
    gestureHandling: "greedy",
    mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      onLoad={onLoad}
      options={mapOptions}
    >
      {/* USER LOCATION MARKER */}
      {userLocation && (
        <Marker
          position={userLocation}
          title="Your Current Location"
          icon={{
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z",
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
            scale: 1.5,
          }}
          zIndex={1000}
        />
      )}

      {/* REFERENCE MARKERS */}
      {REFERENCE_MARKERS.map((marker) => {
        const isActive = selectedPropertyId === String(marker.id);
        const isHover = hoveredPropertyId === String(marker.id);

        return (
          <Marker
            key={`marker-${marker.id}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            title={marker.title}
            onMouseOver={() => handleMarkerMouseOver(marker.id)}
            onMouseOut={handleMarkerMouseOut}
            onClick={() => handleMarkerClick(marker.id)}
            // icon={{
            //   url:
            //     isActive || isHover
            //       ? "/marker-active.png" // Update with your actual icon paths
            //       : "/marker-default.png",
            //   scaledSize: new google.maps.Size(
            //     isActive || isHover ? 40 : 30,
            //     isActive || isHover ? 40 : 30
            //   ),
            // }}
          />
        );
      })}

      {/* Draw Overlay */}
      <DrawOverlay />

      {/* Draw Tool */}
      <DrawTool />

      {/* Modal-specific Apply Button */}
      {isModal && drawnPolygons.length > 0 && (
        <div className="absolute bottom-24 right-4 z-[1000]">
          <button
            onClick={handleApplySelection}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Apply Selection
          </button>
        </div>
      )}

      {/* Modal Clear Button */}
      {isModal && drawnPolygons.length > 0 && (
        <div className="absolute bottom-24 right-48 z-[1000]">
          <button
            onClick={handleClearSelection}
            className="px-6 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Clear
          </button>
        </div>
      )}

      {/* My Location Button - Show in modal mode */}
      {isModal && (
        <div className="absolute top-4 left-4 z-[1000]">
          <button
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="px-4 py-3 bg-white text-gray-800 font-semibold rounded-lg shadow-lg hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Use my current location"
          >
            {isLocating ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                <span>Locating...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>My Location</span>
              </>
            )}
          </button>

          {/* Location Error Toast */}
          {locationError && (
            <div className="mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">{locationError}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Instructions */}
      {isModal && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-[1000]">
          <div className="bg-black bg-opacity-75 text-white px-6 py-3 rounded-lg shadow-lg max-w-md">
            <p className="text-sm text-center">
              Click <span className="font-bold">"Draw"</span> button to start
              selecting your area
            </p>
          </div>
        </div>
      )}
    </GoogleMap>
  );
}

export default GoogleMapContainer;
