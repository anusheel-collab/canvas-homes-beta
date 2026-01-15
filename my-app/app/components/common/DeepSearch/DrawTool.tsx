// components/DrawTool.tsx
"use client";

import { useRef, useEffect } from "react";
import { useMapStore } from "./mapStore";
import { useFilterStore } from "./filtersStore";

export function DrawTool() {
  const {
    map,
    drawingMode,
    setDrawingMode,
    drawnPolygons,
    addDrawPolygon,
    resetDrawArea,
  } = useMapStore();

  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const startListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const mouseMoveRef = useRef<google.maps.MapsEventListener | null>(null);
  const mouseUpRef = useRef<google.maps.MapsEventListener | null>(null);

  /* -----------------------------------
   * ARM DRAW LISTENER (KEY FIX)
   * ----------------------------------- */
  const armDrawListener = () => {
    if (!map) return;

    startListenerRef.current = map.addListener(
      "mousedown",
      (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;

        map.setOptions({
          draggable: false,
          zoomControl: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          draggableCursor: "crosshair",
        });

        const polyline = new google.maps.Polyline({
          map,
          clickable: false,
          strokeColor: "#1a73e8",
          strokeWeight: 2,
        });

        polylineRef.current = polyline;
        polyline.getPath().push(e.latLng);

        mouseMoveRef.current = map.addListener(
          "mousemove",
          (ev: google.maps.MapMouseEvent) => {
            if (ev.latLng) polyline.getPath().push(ev.latLng);
          }
        );

        mouseUpRef.current = map.addListener("mouseup", finishDraw);

        if (startListenerRef.current) {
          google.maps.event.removeListener(startListenerRef.current);
          startListenerRef.current = null;
        }
      }
    );
  };

  /* -----------------------------------
   * BEGIN DRAW MODE
   * ----------------------------------- */
  const beginDraw = () => {
    if (!map || drawingMode) return;

    useFilterStore.getState().closeAllDropdowns?.();
    setDrawingMode(true);

    armDrawListener();
  };

  /* -----------------------------------
   * FINISH ONE POLYGON
   * ----------------------------------- */
  const finishDraw = () => {
    if (!map || !polylineRef.current) return;

    const path = polylineRef.current.getPath().getArray();
    polylineRef.current.setMap(null);
    polylineRef.current = null;

    if (path.length < 3) {
      cleanupListeners();
      restoreMapControls();
      armDrawListener(); // allow next draw
      return;
    }

    const polygon = new google.maps.Polygon({
      map,
      paths: path,
      fillColor: "#1a73e8",
      fillOpacity: 0.2,
      strokeColor: "#1a73e8",
      strokeWeight: 2,
    });

    const pathArray = path.map((pt) => ({
      lat: pt.lat(),
      lng: pt.lng(),
    }));

    // Store polygon ONLY
    addDrawPolygon(polygon, pathArray);

    cleanupListeners();
    restoreMapControls();

    // Re-arm draw so user can draw another polygon
    if (useMapStore.getState().drawingMode) {
      armDrawListener();
    }
  };

  /* -----------------------------------
   * CLEANUP HELPERS
   * ----------------------------------- */
  const cleanupListeners = () => {
    if (mouseMoveRef.current) {
      google.maps.event.removeListener(mouseMoveRef.current);
      mouseMoveRef.current = null;
    }

    if (mouseUpRef.current) {
      google.maps.event.removeListener(mouseUpRef.current);
      mouseUpRef.current = null;
    }
  };

  const restoreMapControls = () => {
    if (!map) return;

    map.setOptions({
      draggable: true,
      zoomControl: true,
      scrollwheel: true,
      disableDoubleClickZoom: false,
      draggableCursor: "grab",
    });
  };

  /* -----------------------------------
   * CLEANUP IF DRAW MODE EXITED
   * ----------------------------------- */
  useEffect(() => {
    if (!drawingMode && startListenerRef.current) {
      google.maps.event.removeListener(startListenerRef.current);
      startListenerRef.current = null;
    }
  }, [drawingMode]);

  /* -----------------------------------
   * UI
   * ----------------------------------- */
  return (
    <div className="absolute top-[10px] right-[10px] z-[100]">
      {!drawingMode && drawnPolygons.length === 0 && (
        <button
          onClick={beginDraw}
          className="px-3 py-1.5 bg-white text-black font-semibold border border-black rounded-[3px]"
        >
          Draw
        </button>
      )}

      {!drawingMode && drawnPolygons.length > 0 && (
        <button
          onClick={resetDrawArea}
          className="px-3 py-1.5 bg-white text-black font-semibold border border-black rounded-[3px]"
        >
          Remove Boundary
        </button>
      )}
    </div>
  );
}
