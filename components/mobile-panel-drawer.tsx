"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { MapPanel } from "@/components/map-panel";
import type { MapLocation, Trail, LocationCategory } from "@/types/map";
import { Filter, X } from "lucide-react";

interface MobilePanelDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLocation: MapLocation | Trail | null;
  onLocationSelect: (location: MapLocation | Trail | null) => void;
  onViewOnMap: (location: MapLocation | Trail) => void;
  activeFilters: LocationCategory[];
  onFilterChange: (filters: LocationCategory[]) => void;
}

export function MobilePanelDrawer({
  open,
  onOpenChange,
  selectedLocation,
  onLocationSelect,
  onViewOnMap,
  activeFilters,
  onFilterChange,
}: MobilePanelDrawerProps) {
  const handleViewOnMap = (location: MapLocation | Trail) => {
    onViewOnMap(location);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="fixed bottom-4 left-1/2 z-[1000] -translate-x-1/2 gap-2 shadow-lg md:hidden"
        >
          <Filter className="h-4 w-4" />
          Filters & Search
          {activeFilters.length > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {activeFilters.length}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh]">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h2 className="font-semibold">Explore Map</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-hidden">
            <MapPanel
              selectedLocation={selectedLocation}
              onLocationSelect={onLocationSelect}
              onViewOnMap={handleViewOnMap}
              activeFilters={activeFilters}
              onFilterChange={onFilterChange}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
