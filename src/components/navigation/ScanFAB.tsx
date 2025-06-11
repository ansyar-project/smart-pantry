"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScanLine, Plus, X, ShoppingCart, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScanFAB() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Don't show FAB on auth pages, landing page, or scan page itself
  if (
    pathname?.startsWith("/auth") ||
    pathname === "/" ||
    pathname === "/scan"
  ) {
    return null;
  }

  const quickActions = [
    {
      label: "Scan Item",
      href: "/scan",
      icon: ScanLine,
      className: "bg-primary hover:bg-primary/90",
    },
    {
      label: "Add Manual",
      href: "/inventory",
      icon: Plus,
      className: "bg-secondary hover:bg-secondary/90",
    },
    {
      label: "Recipes",
      href: "/recipes",
      icon: BookOpen,
      className: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Shopping",
      href: "/shopping",
      icon: ShoppingCart,
      className: "bg-green-500 hover:bg-green-600",
    },
  ];
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        {/* Quick Actions (when expanded) */}
        {isExpanded && (
          <div className="absolute bottom-20 right-0 flex flex-col gap-4 animate-in slide-in-from-bottom-4 fade-in duration-200">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.href}
                  className="flex items-center justify-end gap-3"
                >
                  <span className="text-sm font-medium bg-background/98 backdrop-blur-md px-4 py-2 rounded-full shadow-xl border-2 border-border/50 whitespace-nowrap max-w-[120px] text-center">
                    {action.label}
                  </span>
                  <Button
                    asChild
                    size="lg"
                    className={cn(
                      "h-14 w-14 rounded-full shadow-xl transition-all duration-200 flex-shrink-0",
                      action.className
                    )}
                    onClick={() => setIsExpanded(false)}
                  >
                    <Link href={action.href} title={action.label}>
                      <Icon className="h-6 w-6" />
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <div className="relative">
          {/* Primary scan button - always visible and prominent */}
          <Button
            asChild
            size="lg"
            className="h-16 w-16 rounded-full shadow-xl bg-primary hover:bg-primary/90 border-2 border-background transition-all duration-200"
            title="Quick Scan"
          >
            <Link href="/scan">
              <div className="flex flex-col items-center">
                <ScanLine className="h-7 w-7" />
                <span className="text-xs font-medium mt-0.5">SCAN</span>
              </div>
            </Link>
          </Button>

          {/* Small expand button */}
          <Button
            size="sm"
            className={cn(
              "absolute -top-1 -right-1 h-6 w-6 rounded-full shadow-md transition-all duration-200",
              "bg-secondary hover:bg-secondary/90 border border-background",
              isExpanded && "rotate-45 bg-red-500 hover:bg-red-600"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Close menu" : "More options"}
          >
            {isExpanded ? (
              <X className="h-3 w-3" />
            ) : (
              <Plus className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
