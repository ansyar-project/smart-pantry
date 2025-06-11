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
  DialogTrigger,
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
import { addPantryItem } from "@/app/actions/inventory";
import { getOrCreateDefaultPantry } from "@/lib/pantry";
import { Plus, Loader2 } from "lucide-react";
import { FoodCategory, StorageLocation } from "@prisma/client";

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

interface FormData {
  name: string;
  brand: string;
  category: FoodCategory | "";
  location: StorageLocation | "";
  quantity: string;
  unit: string;
  expiryDate: string;
  purchaseDate: string;
  price: string;
  notes: string;
}

export function AddItemButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    brand: "",
    category: "",
    location: "",
    quantity: "",
    unit: "pieces",
    expiryDate: "",
    purchaseDate: "",
    price: "",
    notes: "",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.quantity) return;

    setIsLoading(true);
    try {
      // Get or create default pantry
      const pantry = await getOrCreateDefaultPantry();
      const itemData = {
        name: formData.name,
        brand: formData.brand || null,
        category: formData.category as FoodCategory,
        location: (formData.location as StorageLocation) || "PANTRY",
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        purchaseDate: formData.purchaseDate
          ? new Date(formData.purchaseDate)
          : null,
        price: formData.price ? parseFloat(formData.price) : null,
        notes: formData.notes || null,
        pantryId: pantry.id,
        barcode: null,
        openedDate: null,
        currency: "USD",
        imageUrl: null,
        nutritionData: null,
      };

      const result = await addPantryItem(itemData);

      if (result.success) {
        setIsOpen(false);
        setFormData({
          name: "",
          brand: "",
          category: "",
          location: "",
          quantity: "",
          unit: "pieces",
          expiryDate: "",
          purchaseDate: "",
          price: "",
          notes: "",
        });
        router.refresh();
      } else {
        console.error("Failed to add item:", result.error);
      }
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Pantry Item</DialogTitle>
          <DialogDescription>
            Add a new item to your pantry inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Milk, Bread"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange("brand", e.target.value)}
                placeholder="e.g., Organic Valley"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                required
              >
                <SelectTrigger id="category">
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
              <Label htmlFor="location">Storage Location</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
              >
                <SelectTrigger id="location">
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
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
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
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => handleInputChange("unit", e.target.value)}
                placeholder="e.g., pieces, lbs, cups"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  handleInputChange("purchaseDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              placeholder="e.g., 3.99"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
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
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
