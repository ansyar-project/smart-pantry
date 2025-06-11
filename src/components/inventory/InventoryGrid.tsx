"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PantryItemWithRelations } from "@/types";
import {
  CalendarDays,
  MapPin,
  Package,
  Edit,
  Trash2,
  Minus,
} from "lucide-react";
import { deletePantryItem } from "@/app/actions/inventory";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditItemDialog } from "./EditItemDialog";
import { ConsumeItemDialog } from "./ConsumeItemDialog";

interface InventoryGridProps {
  items: PantryItemWithRelations[];
}

function formatDate(date: Date | null) {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
}

function getExpiryStatus(expiryDate: Date | null) {
  if (!expiryDate) return { status: "none", color: "bg-gray-500" };

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) return { status: "expired", color: "bg-red-500" };
  if (daysUntilExpiry <= 3)
    return { status: "expires soon", color: "bg-orange-500" };
  if (daysUntilExpiry <= 7)
    return { status: "expires this week", color: "bg-yellow-500" };
  return { status: "fresh", color: "bg-green-500" };
}

function formatCategoryDisplay(category: string) {
  return category
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function formatLocationDisplay(location: string) {
  return location
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function InventoryGrid({ items }: InventoryGridProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingItem, setEditingItem] =
    useState<PantryItemWithRelations | null>(null);
  const [consumingItem, setConsumingItem] =
    useState<PantryItemWithRelations | null>(null);

  const handleDelete = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setIsDeleting(itemId);
    try {
      const result = await deletePantryItem(itemId);
      if (result.success) {
        router.refresh();
      } else {
        console.error("Failed to delete item:", result.error);
        alert("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item");
    } finally {
      setIsDeleting(null);
    }
  };
  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            No inventory items match your current filters.
          </p>
          <Button variant="outline">Clear Filters</Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => {
          const expiryInfo = getExpiryStatus(item.expiryDate);

          return (
            <Card
              key={item.id}
              className="relative group hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg leading-tight">
                    {item.name}
                  </CardTitle>{" "}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700"
                      title="Use item"
                      onClick={() => setConsumingItem(item)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      title="Edit item"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeleting === item.id}
                      title="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {item.brand && (
                  <p className="text-sm text-muted-foreground">{item.brand}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                  {item.price && (
                    <span className="text-sm font-medium text-green-600">
                      ${item.price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatLocationDisplay(item.location)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {formatCategoryDisplay(item.category)}
                  </Badge>
                  {item.expiryDate && (
                    <Badge
                      variant="outline"
                      className={`text-xs text-white ${expiryInfo.color}`}
                    >
                      {expiryInfo.status}
                    </Badge>
                  )}
                </div>

                {item.expiryDate && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    <span>Expires: {formatDate(item.expiryDate)}</span>
                  </div>
                )}

                {item.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item.notes}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>{" "}
      {editingItem && (
        <EditItemDialog
          item={editingItem}
          isOpen={true}
          onCloseAction={() => setEditingItem(null)}
        />
      )}
      {consumingItem && (
        <ConsumeItemDialog
          item={consumingItem}
          isOpen={true}
          onCloseAction={() => setConsumingItem(null)}
        />
      )}
    </>
  );
}
