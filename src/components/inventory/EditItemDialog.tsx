"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updatePantryItem } from "@/app/actions/inventory";
import { Loader2 } from "lucide-react";
import { FoodCategory, StorageLocation } from "@prisma/client";
import { PantryItemWithRelations } from "@/types";

const FOOD_CATEGORIES = [
  { value: "PRODUCE", label: "Produce" },
  { value: "DAIRY", label: "Dairy" },
  { value: "MEAT", label: "Meat" },
  { value: "SEAFOOD", label: "Seafood" },
  { value: "GRAINS", label: "Grains" },
  { value: "PANTRY_STAPLES", label: "Pantry Staples" },
  { value: "FROZEN", label: "Frozen" },
  { value: "BEVERAGES", label: "Beverages" },
  { value: "SNACKS", label: "Snacks" },
  { value: "CONDIMENTS", label: "Condiments" },
  { value: "SPICES", label: "Spices" },
  { value: "BAKING", label: "Baking" },
  { value: "CANNED_GOODS", label: "Canned Goods" },
  { value: "OTHER", label: "Other" },
];

const STORAGE_LOCATIONS = [
  { value: "PANTRY", label: "Pantry" },
  { value: "REFRIGERATOR", label: "Refrigerator" },
  { value: "FREEZER", label: "Freezer" },
  { value: "SPICE_RACK", label: "Spice Rack" },
  { value: "WINE_CELLAR", label: "Wine Cellar" },
  { value: "OTHER", label: "Other" },
];

interface EditItemDialogProps {
  item: PantryItemWithRelations;
  isOpen: boolean;
  onCloseAction: () => void;
}

interface FormData {
  name: string;
  brand: string;
  category: FoodCategory;
  location: StorageLocation;
  quantity: string;
  unit: string;
  expiryDate: string;
  purchaseDate: string;
  price: string;
  notes: string;
}

export function EditItemDialog({
  item,
  isOpen,
  onCloseAction,
}: EditItemDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: item.name,
    brand: item.brand || "",
    category: item.category,
    location: item.location,
    quantity: item.quantity.toString(),
    unit: item.unit,
    expiryDate: item.expiryDate
      ? new Date(item.expiryDate).toISOString().split("T")[0]
      : "",
    purchaseDate: item.purchaseDate
      ? new Date(item.purchaseDate).toISOString().split("T")[0]
      : "",
    price: item.price?.toString() || "",
    notes: item.notes || "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.quantity) return;

    setIsLoading(true);
    try {
      const updateData = {
        name: formData.name,
        brand: formData.brand || undefined,
        category: formData.category,
        location: formData.location,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expiryDate: formData.expiryDate
          ? new Date(formData.expiryDate)
          : undefined,
        purchaseDate: formData.purchaseDate
          ? new Date(formData.purchaseDate)
          : undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        notes: formData.notes || undefined,
      };

      const result = await updatePantryItem(item.id, updateData);
      if (result.success) {
        onCloseAction();
        router.refresh();
      } else {
        console.error("Failed to update item:", result.error);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <DialogDescription>
            Update the details of your pantry item.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Milk, Bread"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-brand">Brand</Label>
              <Input
                id="edit-brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="e.g., Organic Valley"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                required
              >
                <SelectTrigger id="edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {FOOD_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Storage Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
              >
                <SelectTrigger id="edit-location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {STORAGE_LOCATIONS.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input
                id="edit-quantity"
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", e.target.value)}
                placeholder="e.g., 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-unit">Unit</Label>
              <Input
                id="edit-unit"
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                placeholder="e.g., pieces, lbs, cups"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-purchaseDate">Purchase Date</Label>
              <Input
                id="edit-purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  handleInputChange("purchaseDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-expiryDate">Expiry Date</Label>
              <Input
                id="edit-expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-price">Price ($)</Label>
            <Input
              id="edit-price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="e.g., 3.99"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Input
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            {" "}
            <Button
              type="button"
              variant="outline"
              onClick={onCloseAction}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !formData.name ||
                !formData.category ||
                !formData.quantity
              }
              className="flex-1"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Update Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
