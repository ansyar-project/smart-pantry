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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Welcome back, {session.user.name || session.user.email}
        </div>
      </div>

      {/* Alert Notifications */}
      {alerts.length > 0 && <AlertNotifications alerts={alerts} />}

      {/* Stats Overview */}
      <DashboardStats pantryItems={pantryItems} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiry Timeline */}
        <ExpiryTimeline pantryItems={pantryItems} />

        {/* Recipe Suggestions */}
        <RecipeSuggestions recipeMatches={recipeMatches} />
      </div>

      {/* Recent Activity */}
      <RecentActivity pantryItems={pantryItems} />
    </div>
  );
}
