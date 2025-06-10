import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Smartphone,
  BarChart3,
  Users,
  Zap,
  ChefHat,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  // const session = await auth();

  // if (session?.user) {
  //   redirect("/dashboard");
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center shadow-lg">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              Smart Pantry
            </span>
          </div>
          <Button
            asChild
            className="shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/auth/signin" className="flex items-center gap-2">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 text-center relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-success/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            AI-Powered Food Management
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 leading-tight animate-fade-in">
            Smart Pantry &
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent block">
              Recipe Orchestrator
            </span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in">
            Transform your kitchen with intelligent inventory tracking, smart
            expiry alerts, and personalized recipe recommendations that reduce
            waste and inspire creativity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
            <Button
              size="lg"
              asChild
              className="shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-6"
            >
              <Link href="/auth/signin" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="text-lg px-8 py-6 border-2 hover:bg-accent/50"
            >
              <Link href="#features" className="flex items-center gap-2">
                Learn More
                <BarChart3 className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-2 text-muted-foreground animate-fade-in">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-warning text-warning" />
              ))}
            </div>
            <span className="text-sm">
              Trusted by 10,000+ households worldwide
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <ShieldCheck className="h-4 w-4" />
            Powerful Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything you need for a
            <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
              {" "}
              smarter kitchen
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover how Smart Pantry transforms the way you manage food, reduce
            waste, and create delicious meals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">
                Smart Scanning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Instantly add items with AI-powered barcode scanning. Automatic
                product recognition saves time and ensures accuracy.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-warning to-destructive rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">
                Expiry Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Proactive alerts prevent food waste. Smart notifications remind
                you to use items before they expire.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-info to-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">
                Recipe Matching
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                AI-powered recipe suggestions based on your current inventory.
                Discover new dishes with ingredients you already have.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm group hover:scale-105">
            <CardHeader className="pb-4">
              <div className="h-12 w-12 bg-gradient-to-br from-success to-info rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl font-bold">Family Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                Real-time collaboration for busy households. Share your pantry
                with family members seamlessly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Additional feature highlights */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
              <BarChart3 className="h-4 w-4" />
              Advanced Analytics
            </div>
            <h3 className="text-3xl font-bold text-foreground">
              Insights that drive smarter decisions
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Track your consumption patterns, monitor waste reduction, and
              optimize your shopping habits with detailed analytics and
              personalized recommendations.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">
                  Consumption tracking and patterns
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span className="text-muted-foreground">
                  Waste reduction metrics
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="h-2 w-2 bg-info rounded-full"></div>
                <span className="text-muted-foreground">
                  Smart shopping suggestions
                </span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-primary/10 to-success/10 rounded-3xl p-8 backdrop-blur-sm border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-primary mb-2">
                    85%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Waste Reduction
                  </div>
                </div>
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-success mb-2">
                    $240
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Monthly Savings
                  </div>
                </div>
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-info mb-2">150+</div>
                  <div className="text-sm text-muted-foreground">
                    Recipe Matches
                  </div>
                </div>
                <div className="bg-white/80 rounded-xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-warning mb-2">
                    98%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    User Satisfaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-success to-primary"></div>
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Background patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to revolutionize your kitchen?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Join thousands of smart households who have reduced food waste by
              85% and discovered amazing new recipes while saving money.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6 bg-white text-primary hover:bg-white/90"
              >
                <Link href="/auth/signin" className="flex items-center gap-2">
                  Start Your Smart Pantry
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>

              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                  <span>No credit card required</span>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-300 text-yellow-300"
                  />
                ))}
              </div>
              <blockquote className="text-white/90 text-lg italic mb-3">
                "Smart Pantry has completely transformed how we manage food in
                our household. We've cut our food waste in half and discovered
                so many new recipes!"
              </blockquote>
              <cite className="text-white/70 text-sm">
                — Sarah M., Family of 4
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-gradient-to-br from-primary to-success rounded-xl flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-xl">Smart Pantry</span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Revolutionizing kitchen management with AI-powered inventory
                tracking, smart expiry alerts, and personalized recipe
                recommendations.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © 2024 Smart Pantry. Built with Next.js, Prisma, and PostgreSQL.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="h-2 w-2 bg-success rounded-full"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
