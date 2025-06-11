import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { BarcodeScanner } from "@/components/scanner/BarcodeScanner";
import { PageHeader } from "@/components/ui/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barcode Scanner - Add Items to Your Pantry Instantly",
  description:
    "Use our intelligent barcode scanner to quickly add items to your pantry inventory. Automatic product recognition and smart categorization included.",
  robots: {
    index: false,
    follow: false,
  },
};

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
