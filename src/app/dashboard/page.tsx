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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/50 via-white to-green-50/50">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Welcome back, {session.user.name || session.user.email}
            </p>
          </div>
          <div className="text-sm text-muted-foreground bg-white/50 backdrop-blur-sm px-4 py-2 rounded-xl border">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>

        {/* Alert Notifications */}
        {alerts.length > 0 && (
          <div className="animate-fade-in">
            <AlertNotifications alerts={alerts} />
          </div>
        )}

        {/* Stats Overview */}
        <div className="animate-fade-in">
          <DashboardStats pantryItems={pantryItems} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expiry Timeline */}
          <div className="animate-slide-in">
            <ExpiryTimeline pantryItems={pantryItems} />
          </div>

          {/* Recipe Suggestions */}
          <div className="animate-slide-in">
            <RecipeSuggestions recipeMatches={recipeMatches} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="animate-fade-in">
          <RecentActivity />
        </div>
      </div>
    </div>
  );}
      <RecentActivity pantryItems={pantryItems} />
    </div>
  );
}
