"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail } from "lucide-react";

function VerifyRequestContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            {type === "email" ? (
              <Mail className="h-6 w-6 text-green-600" />
            ) : (
              <CheckCircle className="h-6 w-6 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            {type === "email"
              ? "A sign in link has been sent to your email address."
              : "Please check your email for verification instructions."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="text-sm text-blue-700">
              <p className="font-medium">Next steps:</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the sign-in link in the email</li>
                <li>You&apos;ll be automatically signed in</li>
              </ul>
            </div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Didn&apos;t receive the email?
            </p>
            <Button variant="outline" asChild>
              <Link href="/auth/signin">Try signing in again</Link>
            </Button>
          </div>
          <div className="text-center text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:text-blue-500">
              ← Back to home
            </Link>
          </div>{" "}
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyRequest() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestContent />
    </Suspense>
  );
}
