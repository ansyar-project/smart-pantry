"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ShoppingCart } from "lucide-react";
import { addShoppingItem } from "@/app/actions/shopping";

interface AddShoppingItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FOOD_CATEGORIES = [
  "FRUITS",
  "VEGETABLES",
  "MEAT",
  "DAIRY",
  "GRAINS",
  "BEVERAGES",
  "SNACKS",
  "CONDIMENTS",
  "FROZEN",
  "CANNED",
  "BAKERY",
  "OTHER",
];

export function AddShoppingItemDialog({
  open,
  onOpenChange,
}: AddShoppingItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    unit: "",
    category: "",
    estimatedPrice: "",
    notes: "",
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        name: formData.name,
        quantity: parseFloat(formData.quantity) || 1,
        unit: formData.unit || "pieces",
        category: formData.category || undefined,
        estimatedPrice: formData.estimatedPrice
          ? parseFloat(formData.estimatedPrice)
          : undefined,
        notes: formData.notes || undefined,
      };

      const result = await addShoppingItem(data);

      if (result.success) {
        onOpenChange(false);
        // Reset form
        setFormData({
          name: "",
          quantity: "",
          unit: "",
          category: "",
          estimatedPrice: "",
          notes: "",
        });
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to add shopping item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Add Shopping Item
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Milk, Bread, Apples"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="1"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                placeholder="pieces, lbs, oz"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Select
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.toLowerCase().replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="estimatedPrice">Estimated Price (Optional)</Label>
            <Input
              id="estimatedPrice"
              type="number"
              step="0.01"
              min="0"
              value={formData.estimatedPrice}
              onChange={(e) =>
                setFormData({ ...formData, estimatedPrice: e.target.value })
              }
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Brand preference, size, etc."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
