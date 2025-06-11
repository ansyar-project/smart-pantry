import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, X, Clock } from "lucide-react";
import { dismissAlert, markAlertAsRead } from "@/app/actions/alerts";
import type { AlertWithItem } from "@/types";

interface AlertNotificationsProps {
  alerts: AlertWithItem[];
}

export function AlertNotifications({ alerts }: AlertNotificationsProps) {
  const handleDismiss = async (alertId: string) => {
    await dismissAlert(alertId);
  };

  const handleMarkAsRead = async (alertId: string) => {
    await markAlertAsRead(alertId);
  };

  if (alerts.length === 0) return null;
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-2 w-2 bg-destructive rounded-full animate-pulse"></div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Active Alerts
        </h2>
        <Badge variant="destructive" className="ml-auto">
          {alerts.length} alert{alerts.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {alerts.map((alert, index) => (
        <Card
          key={alert.id}
          className={`border shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden animate-fade-in ${
            alert.priority === "HIGH" || alert.priority === "URGENT"
              ? "bg-gradient-to-r from-red-50 to-red-25 dark:from-red-950/30 dark:to-red-900/20 border-l-4 border-l-destructive border-red-200 dark:border-red-800"
              : alert.priority === "MEDIUM"
              ? "bg-gradient-to-r from-orange-50 to-orange-25 dark:from-orange-950/30 dark:to-orange-900/20 border-l-4 border-l-warning border-orange-200 dark:border-orange-800"
              : "bg-gradient-to-r from-blue-50 to-blue-25 dark:from-blue-950/30 dark:to-blue-900/20 border-l-4 border-l-info border-blue-200 dark:border-blue-800"
          }`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    alert.priority === "HIGH" || alert.priority === "URGENT"
                      ? "bg-destructive/10"
                      : alert.priority === "MEDIUM"
                      ? "bg-warning/10"
                      : "bg-info/10"
                  }`}
                >
                  {alert.type === "EXPIRY_URGENT" && (
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  )}
                  {alert.type === "EXPIRY_WARNING" && (
                    <Clock className="h-5 w-5 text-warning" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {alert.title}
                    </h4>
                    <Badge
                      variant={
                        alert.priority === "HIGH" || alert.priority === "URGENT"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {alert.priority}
                    </Badge>
                    {!alert.isRead && (
                      <div className="h-2 w-2 bg-primary rounded-full"></div>
                    )}{" "}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-xs hover:bg-accent/50 transition-colors"
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
