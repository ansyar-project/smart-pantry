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
      gradient: "from-primary to-success",
      bgColor: "bg-primary/10",
    },
    {
      title: "Expiring Soon",
      value: expiringItems,
      icon: Clock,
      description: "Next 3 days",
      gradient: "from-warning to-orange-500",
      bgColor: "bg-warning/10",
    },
    {
      title: "Expired",
      value: expiredItems,
      icon: AlertTriangle,
      description: "Needs attention",
      gradient: "from-destructive to-red-600",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Total Value",
      value: formatCurrency(totalValue),
      icon: DollarSign,
      description: "Estimated worth",
      gradient: "from-success to-emerald-600",
      bgColor: "bg-success/10",
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-primary rounded-full"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105 bg-white dark:bg-gray-800/95 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {" "}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-sm font-bold text-gray-700 dark:text-gray-200">
                  {stat.title}
                </CardTitle>
                <div
                  className={`h-12 w-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-1`}
                >
                  {stat.value}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 font-semibold">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
