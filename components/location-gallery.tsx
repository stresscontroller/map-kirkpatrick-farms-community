"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LocationGalleryProps {
  images: string[];
  locationName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIndex?: number;
}

export function LocationGallery({
  images,
  locationName,
  open,
  onOpenChange,
  initialIndex = 0,
}: LocationGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") goToPrevious();
    if (e.key === "ArrowRight") goToNext();
  };

  if (images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl border-0 bg-black/95 p-0"
        onKeyDown={handleKeyDown}
      >
        <VisuallyHidden>
          <DialogTitle>{locationName} Gallery</DialogTitle>
        </VisuallyHidden>
        
        <div className="relative flex h-[80vh] items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 z-10 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 z-10 text-white hover:bg-white/20"
                onClick={goToPrevious}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 z-10 text-white hover:bg-white/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <img
            src={images[currentIndex]}
            alt={`${locationName} - Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <span className="rounded-full bg-black/60 px-3 py-1 text-sm text-white">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 w-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? "bg-white"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
