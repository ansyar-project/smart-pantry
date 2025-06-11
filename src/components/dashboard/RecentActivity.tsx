import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import type { PantryItem } from "@/types";

interface RecentActivityProps {
  pantryItems: PantryItem[];
}

export function RecentActivity({ pantryItems }: RecentActivityProps) {
  // Get recently added items (last 5)
  const recentItems = pantryItems
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-800/95 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="h-8 w-8 text-gray-500 dark:text-gray-400" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold">
              No recent activity
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-700/50 hover:shadow-md transition-all duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Added {item.name}
                  </p>{" "}
                  <p className="text-sm text-gray-700 dark:text-gray-200 font-medium">
                    {item.quantity} {item.unit} • {item.location}
                  </p>
                </div>{" "}
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {formatDateTime(item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
