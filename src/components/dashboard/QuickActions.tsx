import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ScanLine, Plus, BookOpen, ShoppingCart } from "lucide-react";

const quickActions = [
  {
    name: "Scan Item",
    description: "Add items with barcode scanning",
    href: "/scan",
    icon: ScanLine,
    primary: true,
  },
  {
    name: "Add Manual",
    description: "Manually add inventory items",
    href: "/inventory",
    icon: Plus,
  },
  {
    name: "Browse Recipes",
    description: "Find recipes for your ingredients",
    href: "/recipes",
    icon: BookOpen,
  },
  {
    name: "Shopping List",
    description: "Generate shopping lists",
    href: "/shopping",
    icon: ShoppingCart,
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action) => {
        const Icon = action.icon;

        return (
          <Link key={action.href} href={action.href}>
            <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                <div
                  className={`
                  h-12 w-12 rounded-xl flex items-center justify-center transition-colors
                  ${
                    action.primary
                      ? "bg-primary text-primary-foreground group-hover:bg-primary/90"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }
                `}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{action.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
