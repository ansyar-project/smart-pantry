import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PantryItemWithRelations } from "@/types";

interface InventoryGridProps {
  items: PantryItemWithRelations[];
}

export function InventoryGrid({ items }: InventoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.length > 0 ? (
        items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.brand || "No brand"}</p>
              <p>
                Quantity: {item.quantity} {item.unit}
              </p>
              <Badge variant="outline">{item.category}</Badge>
            </CardContent>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No inventory items found.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
