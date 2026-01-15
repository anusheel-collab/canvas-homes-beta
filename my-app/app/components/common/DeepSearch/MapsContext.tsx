// components/MapsContext.tsx
"use client";

import React, { createContext, useContext } from "react";
import { useLoadScript } from "@react-google-maps/api";

interface MapsContextType {
  isLoaded: boolean;
  loadError: Error | undefined;
}

const MapsContext = createContext<MapsContextType>({
  isLoaded: false,
  loadError: undefined,
});

const libraries: ("drawing" | "geometry" | "places" | "visualization")[] = [
  "drawing",  // Required for DrawTool
  "geometry",
  "places",
];

export function MapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  return (
    <MapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapsContext.Provider>
  );
}

export function useMapsApi() {
  return useContext(MapsContext);
}