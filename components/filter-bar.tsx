"use client";

import { CATEGORY_INFO, type LocationCategory } from "@/types/map";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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

interface FilterBarProps {
  activeFilters: LocationCategory[];
  onFilterChange: (filters: LocationCategory[]) => void;
}

export function FilterBar({ activeFilters, onFilterChange }: FilterBarProps) {
  const categories = Object.values(CATEGORY_INFO);

  const toggleFilter = (categoryId: LocationCategory) => {
    if (activeFilters.includes(categoryId)) {
      onFilterChange(activeFilters.filter((f) => f !== categoryId));
    } else {
      onFilterChange([...activeFilters, categoryId]);
    }
  };

  const selectAll = () => {
    onFilterChange(categories.map((c) => c.id));
  };

  const clearAll = () => {
    onFilterChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            All
          </button>
          <span className="text-xs text-muted-foreground">|</span>
          <button
            onClick={clearAll}
            className="text-xs text-primary hover:underline"
          >
            None
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon as keyof typeof iconMap];
          const isChecked = activeFilters.includes(cat.id);
          return (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`filter-${cat.id}`}
                checked={isChecked}
                onCheckedChange={() => toggleFilter(cat.id)}
              />
              <Label
                htmlFor={`filter-${cat.id}`}
                className="flex cursor-pointer items-center gap-2 text-sm font-normal"
              >
                <div
                  className="flex h-5 w-5 items-center justify-center rounded-full"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <span>{cat.label}</span>
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
