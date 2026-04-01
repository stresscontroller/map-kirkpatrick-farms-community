"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FilterBar } from "@/components/filter-bar";
import { LocationCard, LocationCardSkeleton } from "@/components/location-card";
import { LocationGallery } from "@/components/location-gallery";
import { CommunitySummary } from "@/components/community-summary";
import { communityMapData, getGroupedTrail } from "@/data/community-map-data";
import type { MapLocation, Trail, LocationCategory } from "@/types/map";
import { Search, MapIcon } from "lucide-react";
import { Empty, EmptyDescription, EmptyMedia, EmptyTitle } from "@/components/ui/empty";

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

  const filteredItems = useMemo(() => {
    const groupedTrail = getGroupedTrail();
    let items: (MapLocation | Trail)[] = [
      ...communityMapData.locations,
      ...(groupedTrail ? [groupedTrail] : []),
    ];

    const categoryKeywords: Partial<Record<LocationCategory, string[]>> = {
      trail: ["trail", "trails", "walking trail", "walking path", "path"],
      "tot-lot": ["tot lot", "tot lots", "playground", "playgrounds"],
      "tennis-court": ["tennis", "court", "tennis court", "tennis courts"],
      "basketball-court": ["basketball", "court", "basketball court"],
      gazebo: ["gazebo", "gazebos", "pavilion", "shelter"],
      bridge: ["bridge", "bridges", "footbridge", "crossing"],
    };

    // Filter by active categories
    if (activeFilters.length > 0) {
      items = items.filter((item) => activeFilters.includes(item.category));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter((item) => {
        const keywords = categoryKeywords[item.category] ?? [];
        return (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          item.category.replace("-", " ").includes(query) ||
          keywords.some((k) => k.includes(query))
        );
      }
      );
    }

    return items;
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

      <div className="flex-1 overflow-y-auto">
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

          {/* Location List */}
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              All Places & Trails ({filteredItems.length})
            </h3>
            {filteredItems.length === 0 ? (
              <Empty className="py-8">
                <EmptyMedia variant="icon">
                  <MapIcon className="h-10 w-10" />
                </EmptyMedia>
                <EmptyTitle>No locations found</EmptyTitle>
                <EmptyDescription>
                  {searchQuery
                    ? "Try adjusting your search or filters"
                    : "Select some filters to see locations"}
                </EmptyDescription>
              </Empty>
            ) : (
              <div className="space-y-2">
                {filteredItems.map((location) => (
                  <button
                    key={location.id}
                    onClick={() => onLocationSelect(location)}
                    className={`w-full rounded-lg border py-0 px-4 text-left transition-colors bg-white hover:bg-black/10 ${
                      selectedLocation?.id === location.id
                        ? "border-primary "
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

          <Separator />

          {/* Community Summary */}
          <CommunitySummary
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
          />
        </div>
      </div>

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
