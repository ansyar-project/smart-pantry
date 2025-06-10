"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, X } from "lucide-react";
import { scanBarcode } from "@/app/actions/inventory";
import { ProductForm } from "./ProductForm";

// @ts-ignore - Quagga types
import Quagga from "quagga";

export function BarcodeScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setIsScanning(true);
    setError(null);

    try {
      await navigator.mediaDevices.getUserMedia({ video: true });

      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: scannerRef.current,
            constraints: {
              width: 640,
              height: 480,
              facingMode: "environment",
            },
          },
          decoder: {
            readers: [
              "code_128_reader",
              "ean_reader",
              "ean_8_reader",
              "code_39_reader",
              "code_39_vin_reader",
              "codabar_reader",
              "upc_reader",
              "upc_e_reader",
            ],
          },
        },
        (err: any) => {
          if (err) {
            setError("Failed to initialize camera: " + err.message);
            setIsScanning(false);
            return;
          }
          Quagga.start();
        }
      );

      Quagga.onDetected(async (result: any) => {
        const barcode = result.codeResult.code;
        console.log("Barcode detected:", barcode);

        // Stop scanner
        Quagga.stop();
        setIsScanning(false);

        // Scan barcode
        try {
          const product = await scanBarcode(barcode);
          if (product) {
            setScannedProduct(product);
          } else {
            setError("Product not found. You can still add it manually.");
          }
        } catch (error) {
          setError("Failed to scan barcode. Please try again.");
        }
      });
    } catch (error) {
      setError("Camera permission denied or not available");
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    Quagga.stop();
    setIsScanning(false);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // For now, just show manual form
    // In a real implementation, you'd use image processing to extract barcode
    setError(
      "Image upload barcode scanning coming soon. Please use camera or add manually."
    );
  };

  if (scannedProduct) {
    return (
      <div>
        <Button
          variant="outline"
          onClick={() => setScannedProduct(null)}
          className="mb-4"
        >
          <X className="h-4 w-4 mr-2" />
          Scan Another Item
        </Button>
        <ProductForm initialData={scannedProduct} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {isScanning ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Scanning for Barcode
              <Button variant="outline" size="sm" onClick={stopScanner}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={scannerRef}
              className="w-full h-64 bg-black rounded-md overflow-hidden"
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Hold the barcode steady in the camera view
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={startScanner}
          >
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Camera className="h-12 w-12 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">Scan with Camera</h3>
              <p className="text-sm text-muted-foreground text-center">
                Use your device camera to scan barcodes
              </p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <label
                htmlFor="barcode-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="h-12 w-12 mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Upload Image</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Upload a photo of the barcode
                </p>
              </label>
              <input
                id="barcode-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Or add an item manually
        </p>
        <Button
          variant="outline"
          onClick={() =>
            setScannedProduct({
              barcode: "",
              name: "",
              brand: "",
              category: "",
              imageUrl: "",
              nutritionData: null,
            })
          }
        >
          Add Manually
        </Button>
      </div>
    </div>
  );
}
