import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getShoppingList } from "@/app/actions/shopping";
import { PageHeader } from "@/components/ui/page-header";
import { ShoppingList } from "@/components/shopping/ShoppingList";
import { GenerateListButton } from "@/components/shopping/GenerateListButton";
import { ScanButton } from "@/components/ui/scan-button";

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
