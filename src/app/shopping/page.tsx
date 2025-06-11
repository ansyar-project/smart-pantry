import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getShoppingList } from "@/app/actions/shopping";
import { PageHeader } from "@/components/ui/page-header";
import { ShoppingList } from "@/components/shopping/ShoppingList";
import { GenerateListButton } from "@/components/shopping/GenerateListButton";
import { ScanButton } from "@/components/ui/scan-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Shopping List - Auto-Generated from Your Pantry",
  description:
    "Never forget what to buy again. Our AI-powered shopping list automatically suggests items based on your consumption patterns and current pantry inventory.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function ShoppingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const shoppingItems = await getShoppingList();

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Shopping List"
        description="Manage your shopping list based on low stock items"
      >
        <ScanButton variant="outline" />
        <GenerateListButton />
      </PageHeader>

      <ShoppingList items={shoppingItems} />
    </div>
  );
}
