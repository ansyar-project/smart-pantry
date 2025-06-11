"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/inventory": "Inventory",
  "/scan": "Scan Item",
  "/recipes": "Recipes",
  "/shopping": "Shopping List",
};

export function Breadcrumbs() {
  const pathname = usePathname();

  // Don't show breadcrumbs on auth pages or landing page
  if (pathname?.startsWith("/auth") || pathname === "/") {
    return null;
  }

  const segments = pathname?.split("/").filter(Boolean) || [];

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Link
        href="/dashboard"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>

      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        const name =
          routeNames[href] ||
          segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <div key={href} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4" />
            {isLast ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {name}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
