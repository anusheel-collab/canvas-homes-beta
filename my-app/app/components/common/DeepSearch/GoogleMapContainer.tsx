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
  onClose?: () => void;
}

const bangaloreCenter = { lat: 12.9716, lng: 77.5946 };

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
  onClose,
}: gMapProps) {
  const { isLoaded, loadError } = useMapsApi();

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

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const center = initialCenter || bangaloreCenter;

  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);
      if (isModal) {
        mapInstance.setOptions({
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
          },
          gestureHandling: "greedy",
        });
      }
    },
    [setMap, isModal]
  );

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

  if (!isLoaded)
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Loading Map...
      </div>
    );
  if (loadError)
    return (
      <div className="h-full w-full flex items-center justify-center">
        Error Loading Map
      </div>
    );

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        options={{
          disableDefaultUI: isModal,
          zoomControl: isModal,
          zoomControlOptions: {
            position: google.maps.ControlPosition.LEFT_CENTER,
          },
          mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            }}
          />
        )}

        {REFERENCE_MARKERS.map((marker) => (
          <Marker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            onMouseOver={() => setHoveredPropertyId(String(marker.id))}
            onMouseOut={() => setHoveredPropertyId(null)}
            onClick={() => handleMarkerClick(marker.id)}
          />
        ))}

        <DrawOverlay />
        <DrawTool onClose={onClose}/>
      </GoogleMap>
    </div>
  );
}

export default GoogleMapContainer;
