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
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className={`border-l-4 ${
            alert.priority === "HIGH" || alert.priority === "URGENT"
              ? "border-l-red-500"
              : alert.priority === "MEDIUM"
              ? "border-l-orange-500"
              : "border-l-blue-500"
          }`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {alert.type === "EXPIRY_URGENT" && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                  {alert.type === "EXPIRY_WARNING" && (
                    <Clock className="h-4 w-4 text-orange-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
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
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 ml-4">
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkAsRead(alert.id)}
                    className="text-xs"
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDismiss(alert.id)}
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
