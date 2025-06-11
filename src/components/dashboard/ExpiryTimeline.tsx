import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle } from "lucide-react";
import { getDaysUntilExpiry, getExpiryStatus, formatDate } from "@/lib/utils";
import type { PantryItem } from "@/types";

interface ExpiryTimelineProps {
  pantryItems: PantryItem[];
}

export function ExpiryTimeline({ pantryItems }: ExpiryTimelineProps) {
  const itemsWithExpiry = pantryItems
    .filter((item) => item.expiryDate)
    .sort(
      (a, b) =>
        new Date(a.expiryDate!).getTime() - new Date(b.expiryDate!).getTime()
    )
    .slice(0, 8); // Show next 8 items

  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-gray-900 dark:text-white">
          <div className="h-10 w-10 bg-gradient-to-br from-warning to-orange-500 rounded-xl flex items-center justify-center">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <span>Expiry Timeline</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itemsWithExpiry.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>{" "}
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              No items with expiry dates
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {itemsWithExpiry.map((item, index) => {
              const daysUntil = getDaysUntilExpiry(item.expiryDate!);
              const status = getExpiryStatus(item.expiryDate!);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        status === "expired"
                          ? "bg-destructive/10"
                          : status === "expiring-soon"
                          ? "bg-warning/10"
                          : "bg-success/10"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      {status === "expired" ? (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      ) : (
                        <Clock
                          className={`h-5 w-5 ${
                            status === "expiring-soon"
                              ? "text-warning"
                              : "text-success"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {item.brand && `${item.brand} • `}
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={
                        status === "expired"
                          ? "destructive"
                          : status === "expiring-soon"
                          ? "secondary"
                          : "outline"
                      }
                      className="mb-2 shadow-sm"
                    >
                      {status === "expired"
                        ? "Expired"
                        : daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : `${daysUntil} days`}
                    </Badge>{" "}
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {formatDate(item.expiryDate!)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
