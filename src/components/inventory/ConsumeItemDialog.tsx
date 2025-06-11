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
import { consumeItem } from "@/app/actions/inventory";
import { Loader2, Minus } from "lucide-react";
import { PantryItemWithRelations } from "@/types";

interface ConsumeItemDialogProps {
  item: PantryItemWithRelations;
  isOpen: boolean;
  onCloseAction: () => void;
}

export function ConsumeItemDialog({
  item,
  isOpen,
  onCloseAction,
}: ConsumeItemDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [usedFor, setUsedFor] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) return;

    setIsLoading(true);
    try {
      const result = await consumeItem(
        item.id,
        parseFloat(quantity),
        usedFor || undefined
      );

      if (result.success) {
        onCloseAction();
        router.refresh();
      } else {
        console.error("Failed to consume item:", result.error);
        alert("Failed to consume item");
      }
    } catch (error) {
      console.error("Error consuming item:", error);
      alert("Failed to consume item");
    } finally {
      setIsLoading(false);
    }
  };

  const maxQuantity = item.quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onCloseAction}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minus className="h-5 w-5" />
            Use Item
          </DialogTitle>
          <DialogDescription>
            Record usage of {item.name} from your pantry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consume-quantity">
              Quantity to use (max: {maxQuantity} {item.unit})
            </Label>
            <Input
              id="consume-quantity"
              type="number"
              step="0.1"
              min="0.1"
              max={maxQuantity}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="used-for">Used for (optional)</Label>
            <Input
              id="used-for"
              value={usedFor}
              onChange={(e) => setUsedFor(e.target.value)}
              placeholder="e.g., breakfast, dinner recipe"
            />
          </div>

          <div className="flex gap-2 pt-4">
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
                !quantity ||
                parseFloat(quantity) <= 0 ||
                parseFloat(quantity) > maxQuantity
              }
              className="flex-1"
            >
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Use Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
