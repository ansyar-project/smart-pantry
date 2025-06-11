"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

// Simple label component
const Label = ({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <label htmlFor={htmlFor} className="block text-sm font-medium mb-1">
    {children}
  </label>
);

const RECIPE_CATEGORIES = [
  { value: "BREAKFAST", label: "Breakfast" },
  { value: "APPETIZER", label: "Appetizer" },
  { value: "SOUP", label: "Soup" },
  { value: "SALAD", label: "Salad" },
  { value: "MAIN_COURSE", label: "Main Course" },
  { value: "SIDE_DISH", label: "Side Dish" },
  { value: "DESSERT", label: "Dessert" },
  { value: "BEVERAGE", label: "Beverage" },
  { value: "SNACK", label: "Snack" },
  { value: "OTHER", label: "Other" },
];

const DIFFICULTY_LEVELS = [
  { value: "EASY", label: "Easy" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HARD", label: "Hard" },
  { value: "EXPERT", label: "Expert" },
];

const CUISINE_TYPES = [
  "Italian",
  "Chinese",
  "Mexican",
  "Indian",
  "French",
  "Thai",
  "Japanese",
  "Mediterranean",
  "American",
  "Korean",
  "Greek",
  "Spanish",
];

export function RecipeFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    query: searchParams.get("query") || "",
    category: searchParams.get("category") || "",
    difficulty: searchParams.get("difficulty") || "",
    cuisine: searchParams.get("cuisine") || "",
    maxPrepTime: searchParams.get("maxPrepTime") || "",
    maxCookTime: searchParams.get("maxCookTime") || "",
  });

  const [searchValue, setSearchValue] = useState(filters.query);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.query) {
        handleFilterChange("query", searchValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const updateURL = useCallback(
    (newFilters: typeof filters) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value && value.trim()) {
          params.set(key, value);
        }
      });

      const queryString = params.toString();
      const url = queryString ? `/recipes?${queryString}` : "/recipes";
      router.push(url);
    },
    [router]
  );

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: "",
      category: "",
      difficulty: "",
      cuisine: "",
      maxPrepTime: "",
      maxCookTime: "",
    };
    setFilters(clearedFilters);
    setSearchValue("");
    updateURL(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value.trim()
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filter Recipes</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search recipes by name, description, or cuisine..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>{" "}
        {/* Category and Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) =>
                handleFilterChange("category", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {RECIPE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select
              value={filters.difficulty || "all"}
              onValueChange={(value) =>
                handleFilterChange("difficulty", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any difficulty</SelectItem>
                {DIFFICULTY_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Cuisine and Time filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Cuisine</Label>
            <Select
              value={filters.cuisine || "all"}
              onValueChange={(value) =>
                handleFilterChange("cuisine", value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any cuisine</SelectItem>
                {CUISINE_TYPES.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPrepTime">Max Prep Time (minutes)</Label>
            <Input
              id="maxPrepTime"
              type="number"
              min="0"
              placeholder="Any"
              value={filters.maxPrepTime}
              onChange={(e) =>
                handleFilterChange("maxPrepTime", e.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxCookTime">Max Cook Time (minutes)</Label>
            <Input
              id="maxCookTime"
              type="number"
              min="0"
              placeholder="Any"
              value={filters.maxCookTime}
              onChange={(e) =>
                handleFilterChange("maxCookTime", e.target.value)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
