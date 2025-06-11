import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPantryItems } from "@/app/actions/inventory";
import { getUserAlerts } from "@/app/actions/alerts";
import { findMatchingRecipes } from "@/app/actions/recipes";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ExpiryTimeline } from "@/components/dashboard/ExpiryTimeline";
import { RecipeSuggestions } from "@/components/dashboard/RecipeSuggestions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { AlertNotifications } from "@/components/dashboard/AlertNotifications";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  // Fetch dashboard data
  const [pantryItems, alerts, recipeMatches] = await Promise.all([
    getPantryItems(),
    getUserAlerts(5),
    findMatchingRecipes(await getPantryItems()).then((matches) =>
      matches.slice(0, 3)
    ),
  ]);
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-800 dark:text-gray-200 mt-2 font-semibold text-lg">
            Welcome back, {session.user.name || session.user.email}
          </p>
        </div>
        <div className="text-sm text-gray-800 dark:text-gray-200 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 shadow-md font-medium">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
      {/* Alert Notifications */}
      {alerts.length > 0 && (
        <div className="animate-fade-in">
          <AlertNotifications alerts={alerts} />
        </div>
      )}{" "}
      {/* Stats Overview */}
      <div className="animate-fade-in">
        <DashboardStats pantryItems={pantryItems} />
      </div>
      {/* Quick Actions */}
      <div className="animate-fade-in">
        <QuickActions />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expiry Timeline */}
        <div className="animate-slide-in">
          <ExpiryTimeline pantryItems={pantryItems} />
        </div>
        {/* Recipe Suggestions */}
        <div className="animate-slide-in">
          <RecipeSuggestions recipeMatches={recipeMatches} />
        </div>{" "}
      </div>{" "}
      {/* Recent Activity */}
      <div className="animate-fade-in">
        <RecentActivity pantryItems={pantryItems} />
      </div>
    </div>
  );
}
