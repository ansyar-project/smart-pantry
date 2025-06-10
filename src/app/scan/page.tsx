import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";

export default async function ScanPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Scan Item</h1>
        <p className="text-muted-foreground">
          Scan a barcode or manually add an item to your pantry
        </p>
      </div>

      <BarcodeScanner />
    </div>
  );
}
