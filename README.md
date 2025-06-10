# Smart Pantry & Recipe Orchestrator

A comprehensive system that tracks pantry/fridge inventory, prevents food waste through intelligent expiry alerts, and generates personalized recipe recommendations based on available ingredients.

## 🚀 Features

### Core Features

- **Barcode Scanning**: Quick item addition via mobile camera scanning
- **Expiry Tracking**: Smart alerts before items expire to prevent waste
- **Recipe Matching**: AI-powered recipe suggestions based on current inventory
- **Inventory Management**: Track quantities, locations, and purchase details
- **Multi-user Pantries**: Share pantries with family members
- **Shopping Lists**: Generate shopping lists from recipes or low stock items
- **Analytics Dashboard**: Insights into consumption patterns and waste reduction

### Advanced Features

- **PWA Support**: Mobile-first progressive web app
- **Offline Capabilities**: Basic functionality works without internet
- **Email Notifications**: Smart alerts via email
- **Meal Planning**: Generate weekly meal plans based on inventory
- **Nutrition Tracking**: Basic nutritional information from product APIs
- **Cost Tracking**: Monitor spending and food waste costs

## 🛠 Tech Stack

### Frontend

- **Next.js 15** - App Router, Server Components, Server Actions
- **React 18+** with TypeScript
- **Tailwind CSS v4** - Modern styling
- **shadcn/ui** - Component library
- **PWA** - Progressive Web App capabilities

### Backend

- **Next.js API Routes** - Server-side logic
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **Node.js** - Runtime environment

### Infrastructure

- **Docker & Docker Compose** - Containerization
- **Vercel/Coolify** - Deployment options
- **External APIs**: OpenFoodFacts, SMTP services

## 📦 Installation

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd smart-pantry
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment setup**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/smartpantry"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"

   # OAuth providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email configuration
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   FROM_EMAIL="noreply@smartpantry.com"
   ```

4. **Database setup**

   ```bash
   # Generate Prisma client
   pnpm db:generate

   # Run migrations
   pnpm db:migrate

   # Seed with sample data
   pnpm db:seed
   ```

5. **Start development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup

1. **Using Docker Compose**

   ```bash
   docker-compose up -d
   ```

2. **Access the application**
   - App: http://localhost:3000
   - Database Admin: http://localhost:8080 (Adminer)

## 🚀 Next Steps

1. **Install dependencies**: `pnpm install`
2. **Set up environment**: Copy `.env.example` to `.env.local` and configure
3. **Initialize database**: Run migrations and seed data
4. **Start developing**: Begin with the Phase 1 MVP features

## 📖 Documentation

See the [System Design Document](smart_pantry_system_design.md) for complete technical specifications.

Built with ❤️ using Next.js, Prisma, and PostgreSQL.
