"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addPantryItem } from "@/app/actions/inventory";
import type { BarcodeProduct } from "@/types";

interface ProductFormProps {
  initialData?: BarcodeProduct | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    brand: initialData?.brand || "",
    category: "OTHER" as const,
    barcode: initialData?.barcode || "",
    quantity: 1,
    unit: "pieces",
    location: "PANTRY" as const,
    expiryDate: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    price: "",
    notes: "",
    imageUrl: initialData?.imageUrl || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await addPantryItem({
        ...formData,
        pantryId: "default", // For now, using default pantry
        price: formData.price ? parseFloat(formData.price) : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        purchaseDate: formData.purchaseDate
          ? new Date(formData.purchaseDate)
          : null,
        nutritionData: (initialData?.nutritionData ||
          null) as import("@prisma/client").Prisma.JsonValue,
        openedDate: null,
        currency: "USD",
      });

      if (result.success) {
        router.push("/inventory");
      } else {
        alert("Failed to add item: " + result.error);
      }
    } catch {
      alert("An error occurred while adding the item");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (field: string, value: string | number | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Item to Pantry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Organic Milk"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Brand</label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., Organic Valley"
              />
            </div>
          </div>

          {/* Category and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="PRODUCE">Produce</option>
                <option value="DAIRY">Dairy</option>
                <option value="MEAT">Meat</option>
                <option value="SEAFOOD">Seafood</option>
                <option value="GRAINS">Grains</option>
                <option value="PANTRY_STAPLES">Pantry Staples</option>
                <option value="FROZEN">Frozen</option>
                <option value="BEVERAGES">Beverages</option>
                <option value="SNACKS">Snacks</option>
                <option value="CONDIMENTS">Condiments</option>
                <option value="SPICES">Spices</option>
                <option value="BAKING">Baking</option>
                <option value="CANNED_GOODS">Canned Goods</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Storage Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="PANTRY">Pantry</option>
                <option value="REFRIGERATOR">Refrigerator</option>
                <option value="FREEZER">Freezer</option>
                <option value="SPICE_RACK">Spice Rack</option>
                <option value="WINE_CELLAR">Wine Cellar</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Quantity *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.1"
                value={formData.quantity}
                onChange={(e) =>
                  handleChange("quantity", parseFloat(e.target.value))
                }
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="pieces">Pieces</option>
                <option value="lbs">Pounds</option>
                <option value="oz">Ounces</option>
                <option value="kg">Kilograms</option>
                <option value="g">Grams</option>
                <option value="l">Liters</option>
                <option value="ml">Milliliters</option>
                <option value="cups">Cups</option>
                <option value="tsp">Teaspoons</option>
                <option value="tbsp">Tablespoons</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Purchase Date
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Price and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Barcode</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => handleChange("barcode", e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., 1234567890123"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Any additional notes about this item..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding..." : "Add to Pantry"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
