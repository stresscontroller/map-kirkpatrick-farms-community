export type LocationCategory =
  | "tot-lot"
  | "pond"
  | "pool"
  | "clubhouse"
  | "cemetery"
  | "pollinator-garden"
  | "trail";

export interface MapLocation {
  id: string;
  name: string;
  category: LocationCategory;
  coordinates: [number, number]; // [lat, lng]
  description: string;
  address?: string;
  images: string[];
  tags: string[];
}

export interface Trail {
  id: string;
  name: string;
  category: "trail";
  coordinates: [number, number][]; // Array of [lat, lng] points
  description: string;
  tags: string[];
  length?: string;
}

export interface CommunityBoundary {
  id: string;
  name: string;
  coordinates: [number, number][]; // Polygon points
}

export interface CommunityMapData {
  locations: MapLocation[];
  trails: Trail[];
  boundary: CommunityBoundary;
  center: [number, number];
  zoom: number;
}

export interface CategoryInfo {
  id: LocationCategory;
  label: string;
  color: string;
  icon: string;
}

export const CATEGORY_INFO: Record<LocationCategory, CategoryInfo> = {
  "tot-lot": {
    id: "tot-lot",
    label: "Tot Lot",
    color: "#f59e0b",
    icon: "baby",
  },
  pond: {
    id: "pond",
    label: "Pond",
    color: "#3b82f6",
    icon: "waves",
  },
  pool: {
    id: "pool",
    label: "Pool",
    color: "#06b6d4",
    icon: "droplets",
  },
  clubhouse: {
    id: "clubhouse",
    label: "Clubhouse",
    color: "#8b5cf6",
    icon: "building",
  },
  cemetery: {
    id: "cemetery",
    label: "Cemetery",
    color: "#6b7280",
    icon: "landmark",
  },
  "pollinator-garden": {
    id: "pollinator-garden",
    label: "Pollinator Garden",
    color: "#10b981",
    icon: "flower2",
  },
  trail: {
    id: "trail",
    label: "Trail",
    color: "#22c55e",
    icon: "footprints",
  },
};
