import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PantryItemWithRelations } from "@/types";
import {
  Package,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingDown,
} from "lucide-react";
import { getExpiryStatus, formatCurrency } from "@/lib/utils";

interface InventorySummaryProps {
  items: PantryItemWithRelations[];
}

export function InventorySummary({ items }: InventorySummaryProps) {
  const totalItems = items.length;

  const expiredItems = items.filter(
    (item) => item.expiryDate && getExpiryStatus(item.expiryDate) === "expired"
  ).length;

  const expiringSoonItems = items.filter(
    (item) =>
      item.expiryDate && getExpiryStatus(item.expiryDate) === "expiring-soon"
  ).length;

  const totalValue = items.reduce((sum, item) => sum + (item.price || 0), 0);

  const lowStockItems = items.filter((item) => item.quantity <= 1).length;

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Expired",
      value: expiredItems,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Expiring Soon",
      value: expiringSoonItems,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Low Stock",
      value: lowStockItems,
      icon: TrendingDown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
