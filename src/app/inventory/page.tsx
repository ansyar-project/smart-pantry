import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPantryItems } from "@/app/actions/inventory";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { InventoryFilters } from "@/components/inventory/InventoryFilters";
import { InventorySummary } from "@/components/inventory/InventorySummary";
import { AddItemButton } from "@/components/inventory/AddItemButton";
import { PageHeader } from "@/components/ui/page-header";
import { ScanButton } from "@/components/ui/scan-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Inventory - Track Your Pantry Items",
  description:
    "Manage your complete food inventory with barcode scanning, expiry tracking, and smart organization. Keep track of all your pantry, fridge, and freezer items.",
  robots: {
    index: false,
    follow: false,
  },
};

interface InventoryPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    location?: string;
  }>;
}

export default async function InventoryPage({
  searchParams,
}: InventoryPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }
  const params = await searchParams;

  const filters = {
    search: params.search,
    category: params.category,
    location: params.location,
  };

  const pantryItems = await getPantryItems(undefined, filters);

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Inventory"
        description="Manage your pantry items and track expiry dates"
      >
        <ScanButton variant="outline" />
        <AddItemButton />
      </PageHeader>{" "}
      <InventoryFilters />
      <InventorySummary items={pantryItems} />
      <InventoryGrid items={pantryItems} />
    </div>
  );
}
