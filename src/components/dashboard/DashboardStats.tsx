import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, Clock, DollarSign } from "lucide-react";
import { getExpiryStatus, formatCurrency } from "@/lib/utils";
import type { PantryItem } from "@/types";

interface DashboardStatsProps {
  pantryItems: PantryItem[];
}

export function DashboardStats({ pantryItems }: DashboardStatsProps) {
  const totalItems = pantryItems.length;

  const expiringItems = pantryItems.filter(
    (item) =>
      item.expiryDate && getExpiryStatus(item.expiryDate) === "expiring-soon"
  ).length;

  const expiredItems = pantryItems.filter(
    (item) => item.expiryDate && getExpiryStatus(item.expiryDate) === "expired"
  ).length;

  const totalValue = pantryItems.reduce(
    (sum, item) => sum + (item.price || 0),
    0
  );

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
      description: "Items in pantry",
      color: "text-blue-600",
    },
    {
      title: "Expiring Soon",
      value: expiringItems,
      icon: Clock,
      description: "Next 3 days",
      color: "text-orange-600",
    },
    {
      title: "Expired",
      value: expiredItems,
      icon: AlertTriangle,
      description: "Needs attention",
      color: "text-red-600",
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      description: "Estimated worth",
      color: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
