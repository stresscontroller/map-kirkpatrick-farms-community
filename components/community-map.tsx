"use client";

import { useEffect, useRef, useState } from "react";
import { communityMapData } from "@/data/community-map-data";
import { CATEGORY_INFO, type MapLocation, type Trail, type LocationCategory } from "@/types/map";
import { Button } from "@/components/ui/button";
import { RotateCcw, ZoomIn, ZoomOut, Layers } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with webpack/vite
const createCustomIcon = (color: string) => {
  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
    className: "custom-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

interface CommunityMapProps {
  selectedLocation: MapLocation | Trail | null;
  onLocationSelect: (location: MapLocation | Trail) => void;
  activeFilters: LocationCategory[];
  onResetView: () => void;
}

type MapStyle = "street" | "satellite";
const MAX_MAP_ZOOM = 20;
const MOBILE_MIN_ZOOM = 14;
const DESKTOP_MIN_ZOOM = 16;
const DESKTOP_BREAKPOINT_PX = 1024;
const OUTSIDE_MASK_COLOR = "#111827";

const createBaseTileLayer = (style: MapStyle) => {
  if (style === "satellite") {
    return L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "",
        maxNativeZoom: 19,
        maxZoom: MAX_MAP_ZOOM,
        noWrap: true,
        keepBuffer: 6,
      }
    );
  }

  return L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxNativeZoom: 19,
    maxZoom: MAX_MAP_ZOOM,
    noWrap: true,
    keepBuffer: 6,
  });
};

const createSatelliteLabelsLayer = () =>
  L.tileLayer(
    "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ",
      maxNativeZoom: 19,
      maxZoom: MAX_MAP_ZOOM,
      noWrap: true,
      keepBuffer: 6,
      // Keep labels inside the same clipped pane as the base tiles.
      pane: "tilePane",
      opacity: 1,
      className: "street-labels-layer",
    }
  );

export function CommunityMap({
  selectedLocation,
  onLocationSelect,
  activeFilters,
  onResetView,
}: CommunityMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const polylinesRef = useRef<L.Polyline[]>([]);
  const boundaryRef = useRef<L.Polygon | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>("satellite");

  const getResponsiveMinZoom = () =>
    window.innerWidth >= DESKTOP_BREAKPOINT_PX
      ? DESKTOP_MIN_ZOOM
      : MOBILE_MIN_ZOOM;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const boundaryCoords = communityMapData.boundary.coordinates.map(
      ([lat, lng]) => [lat, lng] as [number, number]
    );
    const boundaryBounds = L.latLngBounds(boundaryCoords);
    let clipRafId: number | null = null;
    let settleTimerId: number | null = null;
    const syncTileClip = () => {
      const tilePane = map.getPane("tilePane");
      if (!tilePane) return;
      const clipPath = `polygon(${boundaryCoords
        .map(([lat, lng]) => {
          const point = map.latLngToLayerPoint([lat, lng]);
          return `${point.x}px ${point.y}px`;
        })
        .join(", ")})`;
      tilePane.style.clipPath = clipPath;
      tilePane.style.setProperty("-webkit-clip-path", clipPath);
    };
    const setTilePaneOpacity = (opacity: number) => {
      const tilePane = map.getPane("tilePane");
      if (!tilePane) return;
      tilePane.style.opacity = `${opacity}`;
    };
    const beginMotionFade = () => {
      if (settleTimerId !== null) {
        window.clearTimeout(settleTimerId);
        settleTimerId = null;
      }
      setTilePaneOpacity(0.94);
    };
    const endMotionFade = () => {
      if (settleTimerId !== null) {
        window.clearTimeout(settleTimerId);
      }
      settleTimerId = window.setTimeout(() => {
        setTilePaneOpacity(1);
        settleTimerId = null;
      }, 70);
    };
    const scheduleTileClipSync = () => {
      if (clipRafId !== null) return;
      clipRafId = window.requestAnimationFrame(() => {
        clipRafId = null;
        syncTileClip();
      });
    };

    const map = L.map(mapContainerRef.current, {
      center: communityMapData.center,
      zoom: communityMapData.zoom,
      zoomControl: false,
      maxBounds: boundaryBounds.pad(0.05),
      maxBoundsViscosity: 1,
      minZoom: getResponsiveMinZoom(),
      maxZoom: MAX_MAP_ZOOM,
    });

    const baseLayer = createBaseTileLayer("satellite");
    baseLayer.addTo(map);
    baseTileLayerRef.current = baseLayer;
    const labelsLayer = createSatelliteLabelsLayer();
    labelsLayer.addTo(map);
    labelsLayerRef.current = labelsLayer;
    syncTileClip();
    setTilePaneOpacity(1);
    map.on("movestart", beginMotionFade);
    map.on("zoomstart", beginMotionFade);
    map.on("move", scheduleTileClipSync);
    map.on("zoom", scheduleTileClipSync);
    map.on("zoomanim", scheduleTileClipSync);
    map.on("viewreset", scheduleTileClipSync);
    map.on("resize", scheduleTileClipSync);
    map.on("moveend", syncTileClip);
    map.on("zoomend", syncTileClip);
    map.on("moveend", endMotionFade);
    map.on("zoomend", endMotionFade);

    // Add community boundary
    const boundary = L.polygon(
      boundaryCoords,
      {
        color: "#ffffff",
        weight: 2.5,
        fillOpacity: 0,
      }
    ).addTo(map);
    boundaryRef.current = boundary;

    mapRef.current = map;
    map.whenReady(() => {
      syncTileClip();
      setIsMapReady(true);
    });

    return () => {
      map.off("move", scheduleTileClipSync);
      map.off("zoom", scheduleTileClipSync);
      map.off("zoomanim", scheduleTileClipSync);
      map.off("viewreset", scheduleTileClipSync);
      map.off("resize", scheduleTileClipSync);
      map.off("movestart", beginMotionFade);
      map.off("zoomstart", beginMotionFade);
      map.off("moveend", syncTileClip);
      map.off("zoomend", syncTileClip);
      map.off("moveend", endMotionFade);
      map.off("zoomend", endMotionFade);
      if (clipRafId !== null) {
        window.cancelAnimationFrame(clipRafId);
      }
      if (settleTimerId !== null) {
        window.clearTimeout(settleTimerId);
      }
      const tilePane = map.getPane("tilePane");
      if (tilePane) {
        tilePane.style.clipPath = "";
        tilePane.style.removeProperty("-webkit-clip-path");
        tilePane.style.opacity = "1";
      }
      map.remove();
      mapRef.current = null;
      baseTileLayerRef.current = null;
      labelsLayerRef.current = null;
    };
  }, []);

  // Keep min zoom responsive between desktop and mobile breakpoints.
  useEffect(() => {
    if (!mapRef.current) return;

    const syncMinZoom = () => {
      if (!mapRef.current) return;
      const nextMinZoom = getResponsiveMinZoom();
      mapRef.current.setMinZoom(nextMinZoom);

      if (mapRef.current.getZoom() < nextMinZoom) {
        mapRef.current.setZoom(nextMinZoom);
      }
    };

    syncMinZoom();
    window.addEventListener("resize", syncMinZoom);

    return () => {
      window.removeEventListener("resize", syncMinZoom);
    };
  }, []);

  // Switch between street and satellite base layers
  useEffect(() => {
    if (!mapRef.current) return;

    if (baseTileLayerRef.current) {
      baseTileLayerRef.current.remove();
    }
    if (labelsLayerRef.current) {
      labelsLayerRef.current.remove();
      labelsLayerRef.current = null;
    }

    const nextLayer = createBaseTileLayer(mapStyle);
    nextLayer.addTo(mapRef.current);
    baseTileLayerRef.current = nextLayer;

    if (mapStyle === "satellite") {
      const labelsLayer = createSatelliteLabelsLayer();
      labelsLayer.addTo(mapRef.current);
      labelsLayerRef.current = labelsLayer;
    }
  }, [mapStyle]);

  // Update markers based on filters
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add filtered location markers
    const filteredLocations = communityMapData.locations.filter((loc) =>
      activeFilters.length === 0 || activeFilters.includes(loc.category)
    );

    filteredLocations.forEach((location) => {
      const categoryInfo = CATEGORY_INFO[location.category];
      const icon = createCustomIcon(categoryInfo.color);

      const marker = L.marker(location.coordinates, { icon })
        .addTo(mapRef.current!)
        .bindPopup(location.name, {
          closeButton: false,
          autoPan: true,
          autoClose: true,
          closeOnClick: true,
          className: "custom-label-popup",
        });

      marker.on("click", () => {
        marker.openPopup();
        onLocationSelect(location);
      });

      markersRef.current.push(marker);
    });
  }, [activeFilters, isMapReady, onLocationSelect]);

  // Update trails based on filters
  useEffect(() => {
    if (!mapRef.current || !isMapReady) return;

    // Clear existing polylines
    polylinesRef.current.forEach((polyline) => polyline.remove());
    polylinesRef.current = [];

    // Add trails if filter includes trails or no filter is applied
    if (activeFilters.length === 0 || activeFilters.includes("trail")) {
      communityMapData.trails.forEach((trail) => {
        const polyline = L.polyline(
          trail.coordinates.map(([lat, lng]) => [lat, lng]),
          {
            color: CATEGORY_INFO.trail.color,
            weight: 2,
            opacity: 0.8,
          }
        ).addTo(mapRef.current!);

        polyline.bindPopup(trail.name, {
          closeButton: false,
          autoPan: true,
          autoClose: true,
          closeOnClick: true,
          className: "custom-label-popup",
        });

        polyline.on("click", () => {
          polyline.openPopup();
          onLocationSelect(trail);
        });

        polylinesRef.current.push(polyline);
      });
    }
  }, [activeFilters, isMapReady, onLocationSelect]);

  // Pan to selected location
  useEffect(() => {
    if (!mapRef.current || !selectedLocation || !isMapReady) return;

    if ("coordinates" in selectedLocation) {
      if (Array.isArray(selectedLocation.coordinates[0])) {
        // It's a trail - fit bounds
        const coords = selectedLocation.coordinates as [number, number][];
        mapRef.current.fitBounds(coords.map(([lat, lng]) => [lat, lng]));
      } else {
        // It's a location - pan to it
        const coords = selectedLocation.coordinates as [number, number];
        mapRef.current.setView(coords, 17, { animate: true });
      }
    }
  }, [selectedLocation, isMapReady]);

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView(communityMapData.center, communityMapData.zoom, {
        animate: true,
      });
    }
    onResetView();
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => (prev === "street" ? "satellite" : "street"));
  };

  return (
    <div className="relative h-full w-full print-map-container">
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={{ backgroundColor: OUTSIDE_MASK_COLOR }}
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 print:hidden">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleMapStyle}
          className="h-9 gap-1.5 bg-background px-3 text-xs shadow-md"
        >
          <Layers className="h-3.5 w-3.5" />
          {mapStyle === "street" ? "Satellite" : "Street"}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomIn}
          className="h-9 w-9 bg-background shadow-md"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleZoomOut}
          className="h-9 w-9 bg-background shadow-md"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleResetView}
          className="h-9 w-9 bg-background shadow-md"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Loading overlay */}
      {!isMapReady && (
        <div className="absolute inset-0 z-[1001] flex items-center justify-center bg-muted/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}

      {/* Custom styles for Leaflet */}
      <style jsx global>{`
        .custom-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-label-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
          padding: 0;
        }
        .custom-label-popup .leaflet-popup-content {
          margin: 0;
          padding: 8px 12px;
          font-size: 15px;
          line-height: 1.3;
          font-weight: 600;
          color: #111827;
        }
        .custom-label-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-container {
          font-family: inherit;
          background: ${OUTSIDE_MASK_COLOR};
        }
        .leaflet-tile.street-labels-layer {
          filter: contrast(1.25) saturate(1.1);
        }
        .leaflet-control-attribution {
          display: none;
        }
      `}</style>
    </div>
  );
}
