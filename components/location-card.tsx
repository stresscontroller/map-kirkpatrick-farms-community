"use client";

import { CATEGORY_INFO, type MapLocation, type Trail } from "@/types/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Printer,
  Images,
  Baby,
  Waves,
  Droplets,
  Building,
  Landmark,
  Flower2,
  Footprints,
  X,
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

interface LocationCardProps {
  location: MapLocation | Trail;
  onViewOnMap?: () => void;
  onOpenGallery?: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

export function LocationCard({
  location,
  onViewOnMap,
  onOpenGallery,
  onClose,
  showCloseButton = false,
}: LocationCardProps) {
  const categoryInfo = CATEGORY_INFO[location.category];
  const Icon = iconMap[categoryInfo.icon as keyof typeof iconMap];
  const isTrail = "length" in location;
  const hasImages = "images" in location && location.images.length > 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="print-location-card relative overflow-hidden border-0 shadow-sm">
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-background/80 p-1 backdrop-blur-sm transition-colors hover:bg-accent"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      
      {hasImages && (
        <div className="relative h-40 w-full overflow-hidden">
          <img
            src={(location as MapLocation).images[0]}
            alt={location.name}
            className="h-full w-full object-cover"
          />
          {(location as MapLocation).images.length > 1 && (
            <button
              onClick={onOpenGallery}
              className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs backdrop-blur-sm transition-colors hover:bg-background"
            >
              <Images className="h-3 w-3" />
              +{(location as MapLocation).images.length - 1}
            </button>
          )}
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: categoryInfo.color }}
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-base leading-tight">
                {location.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {categoryInfo.label}
                {isTrail && (location as Trail).length && (
                  <span> · {(location as Trail).length}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <p className="text-sm text-muted-foreground">{location.description}</p>

        {"address" in location && location.address && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location.address}</span>
          </div>
        )}

        {location.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {location.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2 print:hidden">
          {onViewOnMap && (
            <Button size="sm" variant="outline" onClick={onViewOnMap} className="flex-1">
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              View on Map
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="mr-1.5 h-3.5 w-3.5" />
            Print
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function LocationCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-40 w-full animate-pulse bg-muted" />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-1">
            <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        <div className="space-y-1">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
        </div>
        <div className="flex gap-1">
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
        </div>
      </CardContent>
    </Card>
  );
}
