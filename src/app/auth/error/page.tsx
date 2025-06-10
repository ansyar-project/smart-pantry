"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorDetails = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Server Configuration Error",
          description: "There is a problem with the server configuration.",
          details: "Please contact the administrator if this problem persists.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You do not have permission to sign in.",
          details:
            "Your account may not be authorized to access this application.",
        };
      case "Verification":
        return {
          title: "Verification Error",
          description: "The verification link is invalid or has expired.",
          details:
            "The link may have been used already or it may have expired. Please try signing in again.",
        };
      case "CredentialsSignin":
        return {
          title: "Sign In Failed",
          description: "The credentials you provided are incorrect.",
          details: "Please check your email and password and try again.",
        };
      case "EmailSignin":
        return {
          title: "Email Sign In Error",
          description: "Unable to send the verification email.",
          details:
            "There was a problem sending the sign-in email. Please try again or contact support.",
        };
      case "OAuthSignin":
        return {
          title: "OAuth Sign In Error",
          description: "Error occurred during OAuth sign in.",
          details:
            "There was a problem signing in with the OAuth provider. Please try again.",
        };
      case "OAuthCallback":
        return {
          title: "OAuth Callback Error",
          description: "Error in OAuth callback.",
          details:
            "There was a problem processing the OAuth callback. Please try signing in again.",
        };
      case "OAuthCreateAccount":
        return {
          title: "OAuth Account Creation Error",
          description: "Could not create account via OAuth.",
          details:
            "There was a problem creating your account with the OAuth provider.",
        };
      case "EmailCreateAccount":
        return {
          title: "Email Account Creation Error",
          description: "Could not create account via email.",
          details:
            "There was a problem creating your account with email. Please try again or use a different sign-in method.",
        };
      case "Callback":
        return {
          title: "Callback Error",
          description: "Error in authentication callback.",
          details:
            "There was a problem processing the authentication callback. Please try again.",
        };
      case "OAuthAccountNotLinked":
        return {
          title: "Account Not Linked",
          description:
            "This account is already associated with another sign-in method.",
          details:
            "To confirm your identity, sign in with the same account you used originally.",
        };
      case "SessionRequired":
        return {
          title: "Session Required",
          description: "You need to be signed in to access this page.",
          details: "Please sign in to continue.",
        };
      default:
        return {
          title: "Authentication Error",
          description: "An unknown error occurred during authentication.",
          details:
            "Please try again or contact support if the problem persists.",
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-900">
            {errorDetails.title}
          </CardTitle>
          <CardDescription className="text-red-700">
            {errorDetails.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              <p>{errorDetails.details}</p>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-gray-50 p-4">
              <div className="text-xs text-gray-500">
                <p className="font-medium">Error Code:</p>
                <p className="font-mono">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Button className="w-full" asChild>
              <Link href="/auth/signin">Try signing in again</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Go back to home</Link>
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            If this problem persists, please{" "}
            <a
              href="mailto:support@smartpantry.com"
              className="text-blue-600 hover:text-blue-500"
            >
              contact support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
