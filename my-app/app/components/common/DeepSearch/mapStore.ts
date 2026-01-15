import { create } from "zustand";

interface DrawPolygon {
  polygon: google.maps.Polygon;
  path: { lat: number; lng: number }[];
}

interface MapState {
  center: { lat: number; lng: number };
  zoom: number;
  bounds: google.maps.LatLngBounds | null;

  map: google.maps.Map | null;
  setMap: (map: google.maps.Map | null) => void;

  setCenter: (center: { lat: number; lng: number }) => void;
  setZoom: (zoom: number) => void;
  setBounds: (bounds: google.maps.LatLngBounds | null) => void;

  selectedPropertyId: string | null;
  setSelectedPropertyId: (id: string | null) => void;

  hoveredPropertyId: string | null;
  setHoveredPropertyId: (id: string | null) => void;

  // DRAW
  drawingMode: boolean;
  setDrawingMode: (v: boolean) => void;

  drawnPolygons: DrawPolygon[];

  addDrawPolygon: (
    polygon: google.maps.Polygon,
    path: { lat: number; lng: number }[]
  ) => void;

  applyDrawArea: () => void;
  resetDrawArea: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  center: { lat: 12.9716, lng: 77.5946 },
  zoom: 11,
  bounds: null,

  map: null,
  setMap: (map) => set({ map }),

  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setBounds: (bounds) => set({ bounds }),

  selectedPropertyId: null,
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),

  hoveredPropertyId: null,
  setHoveredPropertyId: (id) => set({ hoveredPropertyId: id }),

  // DRAW
  drawingMode: false,
  setDrawingMode: (v) => set({ drawingMode: v }),

  drawnPolygons: [],

  addDrawPolygon: (polygon, path) =>
    set((state) => ({
      drawnPolygons: [...state.drawnPolygons, { polygon, path }],
    })),

  applyDrawArea: () => {
    const { drawnPolygons } = get();
    if (drawnPolygons.length === 0) return;

    // Here you can add your custom logic when applying draw area
    // For example, you might want to trigger some API call or update other state
    console.log("Draw area applied with polygons:", drawnPolygons.length);

    set({
      drawingMode: false,
    });
  },

  resetDrawArea: () => {
    const { drawnPolygons } = get();

    // Remove polygons from map
    drawnPolygons.forEach(({ polygon }) => polygon.setMap(null));

    set({
      drawnPolygons: [],
      drawingMode: false,
    });
  },
}));
