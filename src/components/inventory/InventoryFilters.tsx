"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

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

export function InventoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [location, setLocation] = useState(
    searchParams.get("location") || "all"
  );
  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category && category !== "all") params.set("category", category);
    if (location && location !== "all") params.set("location", location);

    const queryString = params.toString();
    router.push(`/inventory${queryString ? `?${queryString}` : ""}`);
  };
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setLocation("all");
    router.push("/inventory");
  };

  const hasActiveFilters =
    search ||
    (category && category !== "all") ||
    (location && location !== "all");

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Filter Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  applyFilters();
                }
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>{" "}
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
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
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>{" "}
              <SelectContent>
                <SelectItem value="all">All locations</SelectItem>
                {STORAGE_LOCATIONS.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={applyFilters} className="flex-1">
            Apply Filters
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
