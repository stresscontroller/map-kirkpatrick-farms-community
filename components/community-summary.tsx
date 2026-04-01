"use client";

import { getCategoryCounts } from "@/data/community-map-data";
import { CATEGORY_INFO, type LocationCategory } from "@/types/map";
import {
  Baby,
  Waves,
  Droplets,
  Target,
  Dribbble,
  Building,
  Landmark,
  Flower2,
  Umbrella,
  Waypoints,
  Footprints,
} from "lucide-react";

const iconMap = {
  baby: Baby,
  waves: Waves,
  droplets: Droplets,
  target: Target,
  dribbble: Dribbble,
  building: Building,
  landmark: Landmark,
  flower2: Flower2,
  umbrella: Umbrella,
  waypoints: Waypoints,
  footprints: Footprints,
};

interface CommunitySummaryProps {
  activeFilters: LocationCategory[];
  onFilterChange: (filters: LocationCategory[]) => void;
}

export function CommunitySummary({
  activeFilters,
  onFilterChange,
}: CommunitySummaryProps) {
  const counts = getCategoryCounts();

  const summaryItems = [
    { category: "pond", label: "Ponds" },
    { category: "tot-lot", label: "Tot Lots" },
    { category: "pool", label: "Pools" },
    { category: "tennis-court", label: "Tennis Courts" },
    { category: "basketball-court", label: "Basketball Courts" },
    { category: "clubhouse", label: "Clubhouse" },
    { category: "cemetery", label: "Cemetery" },
    { category: "pollinator-garden", label: "Garden" },
    { category: "gazebo", label: "Gazebos" },
    { category: "bridge", label: "Bridges" },
    { category: "trail", label: "Walking Trail" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-foreground">
        Community Amenities
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {summaryItems.map((item) => {
          const categoryInfo =
            CATEGORY_INFO[item.category as keyof typeof CATEGORY_INFO];
          const Icon = iconMap[categoryInfo.icon as keyof typeof iconMap];
          const count = counts[item.category] || 0;

          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onFilterChange([item.category as LocationCategory])}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition-colors ${
                activeFilters.length === 1 &&
                activeFilters.includes(item.category as LocationCategory)
                  ? "bg-accent ring-1 ring-primary/40"
                  : "bg-muted/50 hover:bg-muted"
              }`}
            >
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: categoryInfo.color }}
              >
                <Icon className="h-3 w-3 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium">{count}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {item.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
