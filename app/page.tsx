"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapPanel } from "@/components/map-panel";
import { MobilePanelDrawer } from "@/components/mobile-panel-drawer";
import { MapLegend } from "@/components/map-legend";
import { PrintButton } from "@/components/print-button";
import { DataReadinessBanner } from "@/components/data-readiness-banner";
import type { MapLocation, Trail, LocationCategory } from "@/types/map";
import { CATEGORY_INFO } from "@/types/map";
import { MapPin, Share2, Menu } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import the map component to avoid SSR issues with Leaflet
const CommunityMap = dynamic(
  () => import("@/components/community-map").then((mod) => mod.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-muted">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<
    MapLocation | Trail | null
  >(null);
  const [activeFilters, setActiveFilters] = useState<LocationCategory[]>(
    Object.keys(CATEGORY_INFO) as LocationCategory[]
  );
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleLocationSelect = useCallback(
    (location: MapLocation | Trail | null) => {
      setSelectedLocation(location);
    },
    []
  );

  const handleViewOnMap = useCallback((location: MapLocation | Trail) => {
    setSelectedLocation(location);
    setShowMap(true);
  }, []);

  const handleResetView = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kirkpatrick Farms Community Map",
          text: "Explore trails, ponds, tot lots, and more in our community!",
          url: window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Landing view
  if (!showMap) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-800">
              <MapPin className="h-4 w-4" />
              Interactive Community Map
            </div>
            <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Kirkpatrick Farms
              <span className="block text-emerald-600">Community Map</span>
            </h1>
            <p className="mx-auto mb-8 max-w-xl text-pretty text-lg text-muted-foreground">
              Explore our beautiful community amenities including walking
              trails, ponds, tot lots, pools, and more. Your guide to everything
              Kirkpatrick Farms has to offer.
            </p>
            {/* <DataReadinessBanner className="mx-auto mb-6 max-w-2xl text-left" /> */}
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => setShowMap(true)}
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 sm:w-auto"
              >
                <MapPin className="h-4 w-4" />
                Open Map
              </Button>
              <PrintButton
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              />
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="w-full gap-2 sm:w-auto"
              >
                <Share2 className="h-4 w-4" />
                Share Link
              </Button>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="container mx-auto px-4 pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-center text-2xl font-semibold">
              What You&apos;ll Find
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon="🏊"
                title="2 Pools"
                description="Community and West Pool with splash areas"
              />
              <FeatureCard
                icon="🛝"
                title="9 Tot Lots"
                description="Playgrounds throughout the community"
              />
              <FeatureCard
                icon="🌊"
                title="3 Ponds"
                description="Scenic ponds with walking paths"
              />
              <FeatureCard
                icon="🚶"
                title="Walking Trails"
                description="Miles of connected trails"
              />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <FeatureCard
                icon="🏛️"
                title="Clubhouse"
                description="Event space and fitness center"
              />
              <FeatureCard
                icon="🦋"
                title="Pollinator Garden"
                description="Native plants and butterflies"
              />
              <FeatureCard
                icon="🏛️"
                title="Historic Cemetery"
                description="Preserved memorial site"
              />
            </div>
          </div>
        </div>

        {/* Legend Preview */}
        <div className="container mx-auto px-4 pb-20">
          <div className="mx-auto max-w-md rounded-xl border bg-card p-6 shadow-sm">
            <MapLegend />
          </div>
        </div>
      </main>
    );
  }

  // Map view
  return (
    <main className="flex h-screen flex-col">
      {/* Header - Print friendly */}
      <header className="print-header shrink-0 border-b bg-background">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMap(false)}
                className="gap-2 print:hidden"
              >
                <h1 className="text-sm font-semibold sm:text-base">
                  Kirkpatrick Farms Community Map
                </h1>
              </Button>
              <p className="hidden text-xs text-muted-foreground print:block">
                Interactive community amenities map
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 print:hidden">
            <PrintButton variant="ghost" size="sm" className="hidden sm:flex" />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="hidden sm:flex"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative flex flex-1 overflow-hidden">
        <div className="pointer-events-none absolute top-16 left-4 z-[1200] max-w-lg print:hidden">
          {/* <DataReadinessBanner className="pointer-events-auto shadow-sm" /> */}
        </div>
        {/* Desktop Sidebar */}
        <aside className="hidden w-80 shrink-0 border-r bg-background lg:block print:hidden">
          <MapPanel
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            onViewOnMap={handleViewOnMap}
            activeFilters={activeFilters}
            onFilterChange={setActiveFilters}
          />
        </aside>

        {/* Map Area */}
        <div className="relative flex-1">
          <CommunityMap
            selectedLocation={selectedLocation}
            onLocationSelect={handleLocationSelect}
            activeFilters={activeFilters}
            onResetView={handleResetView}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobilePanelDrawer
        open={mobileDrawerOpen}
        onOpenChange={setMobileDrawerOpen}
        selectedLocation={selectedLocation}
        onLocationSelect={handleLocationSelect}
        onViewOnMap={handleViewOnMap}
        activeFilters={activeFilters}
        onFilterChange={setActiveFilters}
      />

      {/* Print Legend */}
      <div className="print-legend hidden print:block">
        <MapLegend compact />
      </div>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 transition-colors hover:bg-accent/50">
      <div className="mb-2 text-2xl">{icon}</div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
