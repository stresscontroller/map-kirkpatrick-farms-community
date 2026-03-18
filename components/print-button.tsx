"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface PrintButtonProps {
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function PrintButton({
  variant = "outline",
  size = "default",
  className,
}: PrintButtonProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      className={className}
    >
      <Printer className="mr-2 h-4 w-4" />
      Print Map
    </Button>
  );
}
