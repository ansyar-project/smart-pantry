"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ShoppingCart,
  Plus,
  Trash2,
  CheckCheck,
  Clock,
  DollarSign,
} from "lucide-react";
import {
  toggleShoppingItemComplete,
  deleteShoppingItem,
  clearCompletedItems,
  type ShoppingItem,
} from "@/app/actions/shopping";
import { AddShoppingItemDialog } from "./AddShoppingItemDialog";

interface ShoppingListProps {
  items: ShoppingItem[];
}

export function ShoppingList({ items }: ShoppingListProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const router = useRouter();

  const completedItems = items.filter((item) => item.completed);
  const pendingItems = items.filter((item) => !item.completed);
  const totalEstimatedCost = items
    .filter((item) => !item.completed && item.estimatedPrice)
    .reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);

  const handleToggleComplete = async (id: string) => {
    setIsLoading(id);
    try {
      await toggleShoppingItemComplete(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle item:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleDeleteItem = async (id: string) => {
    setIsLoading(id);
    try {
      await deleteShoppingItem(id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete item:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const handleClearCompleted = async () => {
    setIsLoading("clear-all");
    try {
      await clearCompletedItems();
      router.refresh();
    } catch (error) {
      console.error("Failed to clear completed items:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Your shopping list is empty
        </h3>
        <p className="text-muted-foreground mb-6">
          Add items manually or generate a list from low stock items in your
          pantry.
        </p>
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add First Item
        </Button>
        <AddShoppingItemDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{items.length}</p>
                <p className="text-sm text-muted-foreground">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingItems.length}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50">
                <CheckCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedItems.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {totalEstimatedCost > 0
                    ? `$${totalEstimatedCost.toFixed(2)}`
                    : "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">Est. Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <Button onClick={() => setShowAddDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
        {completedItems.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearCompleted}
            disabled={isLoading === "clear-all"}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear Completed ({completedItems.length})
          </Button>
        )}
      </div>

      {/* Pending Items */}
      {pendingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Shopping List ({pendingItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleComplete(item.id)}
                  disabled={isLoading === item.id}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <Badge
                      variant="outline"
                      className={getPriorityColor(item.priority)}
                    >
                      {item.priority.toLowerCase()}
                    </Badge>
                    {item.category && (
                      <Badge variant="secondary">{item.category}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {item.quantity} {item.unit}
                    </span>
                    {item.estimatedPrice && (
                      <span>${item.estimatedPrice.toFixed(2)}</span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isLoading === item.id}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Items */}
      {completedItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">
              Completed ({completedItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 opacity-60"
              >
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={() => handleToggleComplete(item.id)}
                  disabled={isLoading === item.id}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium line-through">{item.name}</h4>
                    {item.category && (
                      <Badge variant="secondary">{item.category}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {item.quantity} {item.unit}
                    </span>
                    {item.estimatedPrice && (
                      <span>${item.estimatedPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isLoading === item.id}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <AddShoppingItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />
    </div>
  );
}
