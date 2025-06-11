import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Sign In - Access Your Smart Pantry",
    template: "%s | Smart Pantry",
  },
  description:
    "Sign in to Smart Pantry to start tracking your food inventory, reducing waste, and discovering personalized recipes based on your ingredients.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
