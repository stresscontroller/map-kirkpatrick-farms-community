"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FilterBar } from "@/components/filter-bar";
import { MapLegend } from "@/components/map-legend";
import { LocationCard, LocationCardSkeleton } from "@/components/location-card";
import { LocationGallery } from "@/components/location-gallery";
import { CommunitySummary } from "@/components/community-summary";
import { communityMapData } from "@/data/community-map-data";
import type { MapLocation, Trail, LocationCategory } from "@/types/map";
import { Search, MapIcon } from "lucide-react";
import { Empty } from "@/components/ui/empty";

interface MapPanelProps {
  selectedLocation: MapLocation | Trail | null;
  onLocationSelect: (location: MapLocation | Trail | null) => void;
  onViewOnMap: (location: MapLocation | Trail) => void;
  activeFilters: LocationCategory[];
  onFilterChange: (filters: LocationCategory[]) => void;
  isLoading?: boolean;
}

export function MapPanel({
  selectedLocation,
  onLocationSelect,
  onViewOnMap,
  activeFilters,
  onFilterChange,
  isLoading = false,
}: MapPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);

  const filteredLocations = useMemo(() => {
    let locations = communityMapData.locations;

    // Filter by active categories
    if (activeFilters.length > 0) {
      locations = locations.filter((loc) =>
        activeFilters.includes(loc.category)
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      locations = locations.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.description.toLowerCase().includes(query) ||
          loc.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return locations;
  }, [activeFilters, searchQuery]);

  const handleOpenGallery = () => {
    if (selectedLocation && "images" in selectedLocation) {
      setGalleryOpen(true);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b p-4">
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {/* Selected Location Detail */}
          {selectedLocation && (
            <>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">
                  Selected Location
                </h3>
                {isLoading ? (
                  <LocationCardSkeleton />
                ) : (
                  <LocationCard
                    location={selectedLocation}
                    onViewOnMap={() => onViewOnMap(selectedLocation)}
                    onOpenGallery={handleOpenGallery}
                    onClose={() => onLocationSelect(null)}
                    showCloseButton
                  />
                )}
              </div>
              <Separator />
            </>
          )}

          {/* Filters */}
          <FilterBar
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
          />

          <Separator />

          {/* Legend */}
          <MapLegend />

          <Separator />

          {/* Community Summary */}
          <CommunitySummary />

          <Separator />

          {/* Location List */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              All Locations ({filteredLocations.length})
            </h3>
            {filteredLocations.length === 0 ? (
              <Empty className="py-8">
                <Empty.Icon>
                  <MapIcon className="h-10 w-10" />
                </Empty.Icon>
                <Empty.Title>No locations found</Empty.Title>
                <Empty.Description>
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Select some filters to see locations"}
                </Empty.Description>
              </Empty>
            ) : (
              <div className="space-y-2">
                {filteredLocations.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => onLocationSelect(location)}
                    className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                      selectedLocation?.id === location.id
                        ? "border-primary bg-accent"
                        : "border-transparent"
                    }`}
                  >
                    <p className="text-sm font-medium">{location.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {location.category.replace("-", " ")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Gallery Modal */}
      {selectedLocation && "images" in selectedLocation && (
        <LocationGallery
          images={selectedLocation.images}
          locationName={selectedLocation.name}
          open={galleryOpen}
          onOpenChange={setGalleryOpen}
        />
      )}
    </div>
  );
}
