import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  showText?: boolean;
}

export function ScanButton({
  variant = "default",
  size = "default",
  className,
  showText = true,
}: ScanButtonProps) {
  return (
    <Button
      asChild
      variant={variant}
      size={size}
      className={cn(
        "gap-2 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <Link href="/scan">
        <ScanLine className="h-4 w-4" />
        {showText && "Scan Item"}
      </Link>
    </Button>
  );
}
