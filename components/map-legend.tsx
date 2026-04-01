"use client";

import { CATEGORY_INFO } from "@/types/map";
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

interface MapLegendProps {
  compact?: boolean;
}

export function MapLegend({ compact = false }: MapLegendProps) {
  const categories = Object.values(CATEGORY_INFO);

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          return (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-foreground">Legend</h3>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon as keyof typeof iconMap];
          return (
            <div key={cat.id} className="flex items-center gap-2">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full"
                style={{ backgroundColor: cat.color }}
              >
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">{cat.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
