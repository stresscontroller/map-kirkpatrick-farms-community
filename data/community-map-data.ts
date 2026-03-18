import type { CommunityMapData, MapLocation, Trail, CommunityBoundary } from "@/types/map";

// Center coordinates for Kirkpatrick Farms (fictional - using Ashburn, VA area)
const CENTER: [number, number] = [39.0438, -77.4874];

const locations: MapLocation[] = [
  // Tot Lots (9)
  {
    id: "tot-lot-a",
    name: "Tot Lot A - Maple Grove",
    category: "tot-lot",
    coordinates: [39.0445, -77.4885],
    description: "A colorful playground featuring climbing structures, swings, and a sandbox. Perfect for children ages 2-5.",
    address: "Near 100 Maple Grove Lane",
    images: [
      "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1564429238980-16e228c97683?w=800&auto=format&fit=crop",
    ],
    tags: ["playground", "swings", "sandbox", "ages 2-5"],
  },
  {
    id: "tot-lot-b",
    name: "Tot Lot B - Oak Park",
    category: "tot-lot",
    coordinates: [39.0452, -77.4868],
    description: "Shaded playground with modern equipment including slides and climbing walls.",
    address: "Near 200 Oak Park Drive",
    images: [
      "https://images.unsplash.com/photo-1566454825481-f0e7e9fd3dbc?w=800&auto=format&fit=crop",
    ],
    tags: ["playground", "slides", "shaded", "climbing"],
  },
  {
    id: "tot-lot-c",
    name: "Tot Lot C - Willow Way",
    category: "tot-lot",
    coordinates: [39.0428, -77.4892],
    description: "Nature-themed playground with wooden structures and sensory play areas.",
    address: "Near 150 Willow Way",
    images: [
      "https://images.unsplash.com/photo-1596461010909-53a19d0f8f0a?w=800&auto=format&fit=crop",
    ],
    tags: ["nature-themed", "wooden", "sensory play"],
  },
  {
    id: "tot-lot-d",
    name: "Tot Lot D - Birch Circle",
    category: "tot-lot",
    coordinates: [39.0465, -77.4855],
    description: "Compact playground perfect for toddlers with soft rubber surfacing.",
    address: "Near 75 Birch Circle",
    images: [
      "https://images.unsplash.com/photo-1576439663945-9e20a6c4b8f5?w=800&auto=format&fit=crop",
    ],
    tags: ["toddler-friendly", "rubber surfacing", "compact"],
  },
  {
    id: "tot-lot-e",
    name: "Tot Lot E - Cedar Court",
    category: "tot-lot",
    coordinates: [39.0418, -77.4878],
    description: "Large playground with separate areas for different age groups.",
    address: "Near 300 Cedar Court",
    images: [
      "https://images.unsplash.com/photo-1680458841800-f74b1e5f4e47?w=800&auto=format&fit=crop",
    ],
    tags: ["multi-age", "large", "separate areas"],
  },
  {
    id: "tot-lot-f",
    name: "Tot Lot F - Pine Ridge",
    category: "tot-lot",
    coordinates: [39.0472, -77.4888],
    description: "Hillside playground with unique tunnel and bridge features.",
    address: "Near 420 Pine Ridge Road",
    images: [
      "https://images.unsplash.com/photo-1587691592099-24045a3a9f29?w=800&auto=format&fit=crop",
    ],
    tags: ["tunnels", "bridges", "hillside"],
  },
  {
    id: "tot-lot-g",
    name: "Tot Lot G - Spruce Lane",
    category: "tot-lot",
    coordinates: [39.0408, -77.4862],
    description: "Musical playground featuring drums, chimes, and xylophones.",
    address: "Near 180 Spruce Lane",
    images: [
      "https://images.unsplash.com/photo-1577896851905-dc99e1f8b4b9?w=800&auto=format&fit=crop",
    ],
    tags: ["musical", "interactive", "instruments"],
  },
  {
    id: "tot-lot-h",
    name: "Tot Lot H - Elm Street",
    category: "tot-lot",
    coordinates: [39.0458, -77.4845],
    description: "Adventure playground with rope courses and balance beams.",
    address: "Near 250 Elm Street",
    images: [
      "https://images.unsplash.com/photo-1560015534-cee980c1d42a?w=800&auto=format&fit=crop",
    ],
    tags: ["adventure", "rope course", "balance"],
  },
  {
    id: "tot-lot-i",
    name: "Tot Lot I - Ash Avenue",
    category: "tot-lot",
    coordinates: [39.0432, -77.4850],
    description: "Classic playground design with merry-go-round and see-saws.",
    address: "Near 90 Ash Avenue",
    images: [
      "https://images.unsplash.com/photo-1571425046056-cfc17c664e7e?w=800&auto=format&fit=crop",
    ],
    tags: ["classic", "merry-go-round", "see-saw"],
  },
  // Ponds (3)
  {
    id: "north-pond",
    name: "North Pond",
    category: "pond",
    coordinates: [39.0478, -77.4870],
    description: "Scenic retention pond with a walking path around the perimeter. Home to various waterfowl and fish.",
    address: "North Community Area",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop",
    ],
    tags: ["walking path", "wildlife", "benches", "scenic"],
  },
  {
    id: "south-pond",
    name: "South Pond",
    category: "pond",
    coordinates: [39.0398, -77.4880],
    description: "Quiet pond area with native plantings and a small dock for observation.",
    address: "South Community Area",
    images: [
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop",
    ],
    tags: ["native plants", "dock", "quiet area"],
  },
  {
    id: "east-pond",
    name: "East Pond",
    category: "pond",
    coordinates: [39.0442, -77.4835],
    description: "The largest pond in the community featuring a fountain and surrounding picnic area.",
    address: "East Community Area",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop",
    ],
    tags: ["fountain", "picnic area", "largest"],
  },
  // Pools (2)
  {
    id: "community-pool",
    name: "Community Pool",
    category: "pool",
    coordinates: [39.0440, -77.4872],
    description: "Main community pool with lap lanes, diving board, and children's splash area. Open Memorial Day through Labor Day.",
    address: "500 Community Center Drive",
    images: [
      "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&auto=format&fit=crop",
    ],
    tags: ["lap lanes", "diving board", "splash area", "seasonal"],
  },
  {
    id: "west-pool",
    name: "West Pool",
    category: "pool",
    coordinates: [39.0435, -77.4905],
    description: "Family-friendly pool with zero-entry section and water slide.",
    address: "750 West Park Boulevard",
    images: [
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop",
    ],
    tags: ["zero-entry", "water slide", "family-friendly"],
  },
  // Clubhouse (1)
  {
    id: "main-clubhouse",
    name: "Main Clubhouse",
    category: "clubhouse",
    coordinates: [39.0438, -77.4874],
    description: "The heart of Kirkpatrick Farms featuring a grand hall, meeting rooms, fitness center, and outdoor patio. Available for private events.",
    address: "500 Community Center Drive",
    images: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop",
    ],
    tags: ["events", "fitness center", "meeting rooms", "rentals"],
  },
  // Cemetery (1)
  {
    id: "historic-cemetery",
    name: "Historic Cemetery",
    category: "cemetery",
    coordinates: [39.0415, -77.4845],
    description: "A preserved historic cemetery dating back to the 1800s. Please be respectful when visiting this peaceful memorial site.",
    address: "Historic District",
    images: [
      "https://images.unsplash.com/photo-1509128841709-6c13b25058a3?w=800&auto=format&fit=crop",
    ],
    tags: ["historic", "memorial", "preserved"],
  },
  // Pollinator Garden (1)
  {
    id: "pollinator-garden",
    name: "Pollinator Garden",
    category: "pollinator-garden",
    coordinates: [39.0455, -77.4898],
    description: "A beautiful native plant garden designed to attract butterflies, bees, and hummingbirds. Features educational signage about local pollinators.",
    address: "Near North Pond",
    images: [
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1462275646964-a0e3571f4f93?w=800&auto=format&fit=crop",
    ],
    tags: ["native plants", "butterflies", "educational", "bees"],
  },
];

const trails: Trail[] = [
  {
    id: "trail-loop-1",
    name: "Trail Loop 1 - Main Loop",
    category: "trail",
    coordinates: [
      [39.0478, -77.4900],
      [39.0475, -77.4885],
      [39.0468, -77.4875],
      [39.0455, -77.4865],
      [39.0440, -77.4855],
      [39.0425, -77.4850],
      [39.0410, -77.4855],
      [39.0398, -77.4870],
      [39.0400, -77.4890],
      [39.0415, -77.4905],
      [39.0435, -77.4915],
      [39.0455, -77.4912],
      [39.0470, -77.4905],
      [39.0478, -77.4900],
    ],
    description: "The main perimeter trail circling the entire community. Approximately 2.5 miles with gentle terrain.",
    tags: ["paved", "loop", "2.5 miles", "easy"],
    length: "2.5 miles",
  },
  {
    id: "trail-connector-1",
    name: "Trail Connector - North Section",
    category: "trail",
    coordinates: [
      [39.0468, -77.4875],
      [39.0460, -77.4878],
      [39.0450, -77.4882],
      [39.0440, -77.4880],
    ],
    description: "A connector trail linking the north side to the clubhouse area.",
    tags: ["connector", "paved", "short"],
    length: "0.3 miles",
  },
  {
    id: "trail-connector-2",
    name: "Trail Connector - South Section",
    category: "trail",
    coordinates: [
      [39.0415, -77.4870],
      [39.0420, -77.4865],
      [39.0428, -77.4858],
      [39.0435, -77.4855],
    ],
    description: "A scenic connector through the south community area.",
    tags: ["connector", "paved", "scenic"],
    length: "0.25 miles",
  },
  {
    id: "trail-pond-loop",
    name: "Pond Trail Loop",
    category: "trail",
    coordinates: [
      [39.0445, -77.4840],
      [39.0448, -77.4832],
      [39.0442, -77.4825],
      [39.0435, -77.4830],
      [39.0438, -77.4840],
      [39.0445, -77.4840],
    ],
    description: "A peaceful loop around East Pond with benches and wildlife viewing areas.",
    tags: ["loop", "gravel", "wildlife", "benches"],
    length: "0.5 miles",
  },
];

const boundary: CommunityBoundary = {
  id: "kirkpatrick-farms-boundary",
  name: "Kirkpatrick Farms Community Boundary",
  coordinates: [
    [39.0485, -77.4920],
    [39.0485, -77.4825],
    [39.0390, -77.4825],
    [39.0390, -77.4920],
    [39.0485, -77.4920],
  ],
};

export const communityMapData: CommunityMapData = {
  locations,
  trails,
  boundary,
  center: CENTER,
  zoom: 15,
};

export const getLocationById = (id: string): MapLocation | undefined => {
  return communityMapData.locations.find((loc) => loc.id === id);
};

export const getTrailById = (id: string): Trail | undefined => {
  return communityMapData.trails.find((trail) => trail.id === id);
};

export const getLocationsByCategory = (category: string): MapLocation[] => {
  return communityMapData.locations.filter((loc) => loc.category === category);
};

export const getCategoryCounts = () => {
  const counts: Record<string, number> = {};
  communityMapData.locations.forEach((loc) => {
    counts[loc.category] = (counts[loc.category] || 0) + 1;
  });
  counts["trail"] = communityMapData.trails.length;
  return counts;
};
