"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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
  const [isMapReady, setIsMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: communityMapData.center,
      zoom: communityMapData.zoom,
      zoomControl: false,
      maxBounds: L.latLngBounds(
        [communityMapData.center[0] - 0.02, communityMapData.center[1] - 0.02],
        [communityMapData.center[0] + 0.02, communityMapData.center[1] + 0.02]
      ),
      maxBoundsViscosity: 0.8,
      minZoom: 14,
      maxZoom: 18,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add community boundary
    const boundary = L.polygon(
      communityMapData.boundary.coordinates.map(([lat, lng]) => [lat, lng]),
      {
        color: "#22c55e",
        weight: 3,
        fillColor: "#22c55e",
        fillOpacity: 0.05,
        dashArray: "5, 10",
      }
    ).addTo(map);
    boundaryRef.current = boundary;

    mapRef.current = map;
    setIsMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
        .bindTooltip(location.name, {
          permanent: false,
          direction: "top",
          className: "custom-tooltip",
        });

      marker.on("click", () => {
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
            weight: 4,
            opacity: 0.8,
            dashArray: trail.id.includes("connector") ? "10, 10" : undefined,
          }
        ).addTo(mapRef.current!);

        polyline.bindTooltip(trail.name, {
          permanent: false,
          direction: "top",
          className: "custom-tooltip",
        });

        polyline.on("click", () => {
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

  return (
    <div className="relative h-full w-full print-map-container">
      <div ref={mapContainerRef} className="h-full w-full" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2 print:hidden">
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
        .custom-tooltip {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
