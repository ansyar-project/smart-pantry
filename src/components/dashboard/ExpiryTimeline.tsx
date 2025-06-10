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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Expiry Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itemsWithExpiry.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No items with expiry dates
          </p>
        ) : (
          <div className="space-y-3">
            {itemsWithExpiry.map((item) => {
              const daysUntil = getDaysUntilExpiry(item.expiryDate!);
              const status = getExpiryStatus(item.expiryDate!);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {status === "expired" && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
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
                    >
                      {status === "expired"
                        ? "Expired"
                        : daysUntil === 0
                        ? "Today"
                        : daysUntil === 1
                        ? "Tomorrow"
                        : `${daysUntil} days`}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
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
