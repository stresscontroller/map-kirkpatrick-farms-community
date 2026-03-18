"use client";

import { getCategoryCounts } from "@/data/community-map-data";
import { CATEGORY_INFO } from "@/types/map";
import {
  Baby,
  Waves,
  Droplets,
  Building,
  Landmark,
  Flower2,
  Footprints,
} from "lucide-react";

const iconMap = {
  baby: Baby,
  waves: Waves,
  droplets: Droplets,
  building: Building,
  landmark: Landmark,
  flower2: Flower2,
  footprints: Footprints,
};

export function CommunitySummary() {
  const counts = getCategoryCounts();

  const summaryItems = [
    { category: "pond", label: "Ponds" },
    { category: "tot-lot", label: "Tot Lots" },
    { category: "pool", label: "Pools" },
    { category: "clubhouse", label: "Clubhouse" },
    { category: "cemetery", label: "Cemetery" },
    { category: "pollinator-garden", label: "Garden" },
    { category: "trail", label: "Trail Segments" },
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
            <div
              key={item.category}
              className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
