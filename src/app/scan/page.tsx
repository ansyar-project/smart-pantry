import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { PageHeader } from "@/components/ui/page-header";

export default async function ScanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }
  return (
    <div className="container mx-auto p-4">
      <PageHeader
        title="Scan Item"
        description="Scan a barcode or manually add an item to your pantry"
      />

      <BarcodeScanner />
    </div>
  );
}
