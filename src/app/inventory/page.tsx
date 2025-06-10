import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPantryItems } from "@/app/actions/inventory";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { AddItemButton } from "@/components/inventory/AddItemButton";

export default async function InventoryPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const pantryItems = await getPantryItems();

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <AddItemButton />
      </div>

      <InventoryFilters />

      <InventoryGrid items={pantryItems} />
    </div>
  );
}
