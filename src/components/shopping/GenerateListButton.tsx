"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wand2, Loader2 } from "lucide-react";
import { generateShoppingListFromLowStock } from "@/app/actions/shopping";

export function GenerateListButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const result = await generateShoppingListFromLowStock();

      if (result.success) {
        // Show success message or notification
        router.refresh();
      } else {
        console.error("Failed to generate shopping list:", result.error);
      }
    } catch (error) {
      console.error("Failed to generate shopping list:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={isLoading} className="gap-2">
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="h-4 w-4" />
          Generate from Low Stock
        </>
      )}
    </Button>
  );
}
