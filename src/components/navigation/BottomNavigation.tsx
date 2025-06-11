"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ScanLine,
  BookOpen,
  ShoppingCart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const bottomNavItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    name: "Shopping",
    href: "/shopping",
    icon: ShoppingCart,
  },
  {
    name: "Scan",
    href: "/scan",
    icon: ScanLine,
    primary: true,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: BookOpen,
  },
];

export function BottomNavigation() {
  const pathname = usePathname();

  // Don't show bottom nav on auth pages or landing page
  if (pathname?.startsWith("/auth") || pathname === "/") {
    return null;
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border">
      <div className="flex items-center justify-around px-2 py-2">
        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive
                  ? "text-primary bg-primary/10"
                  : item.primary && !isActive
                  ? "text-primary hover:bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isActive && "bg-primary text-primary-foreground",
                  item.primary && !isActive && "bg-primary/20"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium truncate">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
