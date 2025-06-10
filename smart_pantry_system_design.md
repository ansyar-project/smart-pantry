# Smart Pantry & Recipe Orchestrator
## System Design Document

### 1. Project Overview

**Vision**: A comprehensive system that tracks pantry/fridge inventory, prevents food waste through intelligent expiry alerts, and generates personalized recipe recommendations based on available ingredients.

**Key Value Propositions**:
- Minimize food waste through proactive expiry tracking
- Streamline meal planning with ingredient-based recipe matching
- Collaborative household inventory management
- Data-driven insights into consumption patterns and spending

---

### 2. System Architecture

#### 2.1 High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Next.js App   │    │   External APIs │
│                 │    │                 │    │                 │
│ • Web Browser   │◄──►│ • App Router    │◄──►│ • Barcode APIs  │
│ • Mobile PWA    │    │ • Server Actions│    │ • SMTP Service  │
│ • QR Scanner    │    │ • Edge Config   │    │ • Push Gateway  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │                 │
                       │ • Prisma ORM    │
                       │ • Docker Host   │
                       │ • Adminer GUI   │
                       └─────────────────┘
```

#### 2.2 Technology Stack

**Frontend**:
- Next.js 15 (App Router, Server Components, Server Actions)
- React 18+ with TypeScript
- Tailwind CSS v4
- shadcn/ui + Aceternity UI components
- PWA capabilities for mobile scanning

**Backend**:
- Next.js API Routes & Server Actions
- Prisma ORM
- PostgreSQL database
- Edge Config for cron scheduling
- Node.js runtime

**Infrastructure**:
- Docker & Docker Compose
- Coolify for deployment
- Self-hosted on VPS/cloud server

**External Integrations**:
- Barcode lookup APIs (OpenFoodFacts, UPC Database)
- SMTP service (SendGrid, Mailgun, or Resend)
- Push notification gateway
- File storage (local or S3-compatible)

---

### 3. Data Model & Database Schema

#### 3.1 Core Entities

```prisma
// User Management
model User {
  id              String         @id @default(cuid())
  email           String         @unique
  name            String?
  avatar          String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  pantryItems     PantryItem[]
  shoppingLists   ShoppingList[]
  pantryMembers   PantryMember[]
  alerts          Alert[]
  recipes         Recipe[]       // User-created recipes
  
  @@map("users")
}

// Pantry System
model Pantry {
  id              String         @id @default(cuid())
  name            String         @default("My Pantry")
  description     String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  items           PantryItem[]
  members         PantryMember[]
  
  @@map("pantries")
}

model PantryMember {
  id              String         @id @default(cuid())
  userId          String
  pantryId        String
  role            MemberRole     @default(MEMBER)
  joinedAt        DateTime       @default(now())
  
  // Relations
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  pantry          Pantry         @relation(fields: [pantryId], references: [id], onDelete: Cascade)
  
  @@unique([userId, pantryId])
  @@map("pantry_members")
}

model PantryItem {
  id              String         @id @default(cuid())
  userId          String
  pantryId        String
  
  // Item Details
  name            String
  brand           String?
  category        FoodCategory
  barcode         String?
  
  // Quantity & Storage
  quantity        Float
  unit            String         @default("pieces")
  location        StorageLocation @default(PANTRY)
  
  // Dates
  purchaseDate    DateTime?
  expiryDate      DateTime?
  openedDate      DateTime?
  
  // Cost Tracking
  price           Float?
  currency        String         @default("USD")
  
  // Metadata
  notes           String?
  imageUrl        String?
  nutritionData   Json?          // Store API nutrition data
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  pantry          Pantry         @relation(fields: [pantryId], references: [id], onDelete: Cascade)
  alerts          Alert[]
  usageHistory    ItemUsage[]
  
  @@map("pantry_items")
}

// Recipe System
model Recipe {
  id              String         @id @default(cuid())
  userId          String?        // null for system/public recipes
  
  // Recipe Details
  name            String
  description     String?
  instructions    String
  prepTime        Int?           // minutes
  cookTime        Int?           // minutes
  servings        Int            @default(4)
  difficulty      Difficulty     @default(MEDIUM)
  
  // Classification
  cuisine         String?
  category        RecipeCategory @default(MAIN_COURSE)
  tags            String[]       // ["vegetarian", "quick", "healthy"]
  
  // Media
  imageUrl        String?
  videoUrl        String?
  
  // Metadata
  rating          Float?         @default(0)
  totalRatings    Int            @default(0)
  isPublic        Boolean        @default(false)
  source          String?        // URL or book reference
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  user            User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  ingredients     RecipeIngredient[]
  mealPlans       MealPlanRecipe[]
  ratings         RecipeRating[]
  
  @@map("recipes")
}

model RecipeIngredient {
  id              String         @id @default(cuid())
  recipeId        String
  
  // Ingredient Details
  name            String
  category        FoodCategory?
  quantity        Float
  unit            String
  isOptional      Boolean        @default(false)
  notes           String?        // "finely chopped", "room temperature"
  
  // Relations
  recipe          Recipe         @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  @@map("recipe_ingredients")
}

// Alert System
model Alert {
  id              String         @id @default(cuid())
  userId          String
  pantryItemId    String?
  
  type            AlertType
  title           String
  message         String
  priority        AlertPriority  @default(MEDIUM)
  
  // Status
  isRead          Boolean        @default(false)
  isDismissed     Boolean        @default(false)
  
  // Scheduling
  scheduledFor    DateTime?
  sentAt          DateTime?
  
  createdAt       DateTime       @default(now())
  
  // Relations
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  pantryItem      PantryItem?    @relation(fields: [pantryItemId], references: [id], onDelete: Cascade)
  
  @@map("alerts")
}

// Shopping & Planning
model ShoppingList {
  id              String         @id @default(cuid())
  userId          String
  name            String         @default("Shopping List")
  
  isCompleted     Boolean        @default(false)
  completedAt     DateTime?
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           ShoppingItem[]
  
  @@map("shopping_lists")
}

model ShoppingItem {
  id              String         @id @default(cuid())
  shoppingListId  String
  
  name            String
  quantity        Float          @default(1)
  unit            String         @default("pieces")
  category        FoodCategory?
  estimatedPrice  Float?
  
  isCompleted     Boolean        @default(false)
  completedAt     DateTime?
  
  notes           String?
  
  // Relations
  shoppingList    ShoppingList   @relation(fields: [shoppingListId], references: [id], onDelete: Cascade)
  
  @@map("shopping_items")
}

model MealPlan {
  id              String         @id @default(cuid())
  userId          String
  
  name            String
  startDate       DateTime
  endDate         DateTime
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  // Relations
  recipes         MealPlanRecipe[]
  
  @@map("meal_plans")
}

model MealPlanRecipe {
  id              String         @id @default(cuid())
  mealPlanId      String
  recipeId        String
  
  scheduledDate   DateTime
  mealType        MealType       @default(DINNER)
  servings        Int            @default(4)
  
  // Relations
  mealPlan        MealPlan       @relation(fields: [mealPlanId], references: [id], onDelete: Cascade)
  recipe          Recipe         @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  @@unique([mealPlanId, scheduledDate, mealType])
  @@map("meal_plan_recipes")
}

// Analytics & Tracking
model ItemUsage {
  id              String         @id @default(cuid())
  pantryItemId    String
  
  quantityUsed    Float
  usedFor         String?        // Recipe name or "consumed"
  usedAt          DateTime       @default(now())
  
  // Relations
  pantryItem      PantryItem     @relation(fields: [pantryItemId], references: [id], onDelete: Cascade)
  
  @@map("item_usage")
}

model RecipeRating {
  id              String         @id @default(cuid())
  recipeId        String
  userId          String
  
  rating          Int            // 1-5 stars
  review          String?
  
  createdAt       DateTime       @default(now())
  
  // Relations
  recipe          Recipe         @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  
  @@unique([recipeId, userId])
  @@map("recipe_ratings")
}

// Enums
enum MemberRole {
  OWNER
  ADMIN
  MEMBER
}

enum FoodCategory {
  PRODUCE
  DAIRY
  MEAT
  SEAFOOD
  GRAINS
  PANTRY_STAPLES
  FROZEN
  BEVERAGES
  SNACKS
  CONDIMENTS
  SPICES
  BAKING
  CANNED_GOODS
  OTHER
}

enum StorageLocation {
  PANTRY
  REFRIGERATOR
  FREEZER
  SPICE_RACK
  WINE_CELLAR
  OTHER
}

enum AlertType {
  EXPIRY_WARNING
  EXPIRY_URGENT
  LOW_STOCK
  SHOPPING_REMINDER
  RECIPE_SUGGESTION
  SYSTEM
}

enum AlertPriority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum Difficulty {
  EASY
  MEDIUM
  HARD
  EXPERT
}

enum RecipeCategory {
  BREAKFAST
  APPETIZER
  SOUP
  SALAD
  MAIN_COURSE
  SIDE_DISH
  DESSERT
  BEVERAGE
  SNACK
  OTHER
}

enum MealType {
  BREAKFAST
  LUNCH
  DINNER
  SNACK
}
```

---

### 4. API Design & Server Actions

#### 4.1 Inventory Management APIs

```typescript
// app/actions/inventory.ts
export async function scanBarcode(barcode: string): Promise<PantryItem> {
  // 1. Query external barcode API
  // 2. Extract product metadata
  // 3. Create PantryItem with pre-filled data
  // 4. Return for user confirmation/editing
}

export async function addPantryItem(data: CreatePantryItemInput): Promise<PantryItem> {
  // Validate input, create item, trigger any alerts
}

export async function updatePantryItem(id: string, data: UpdatePantryItemInput): Promise<PantryItem> {
  // Update item, recalculate expiry alerts
}

export async function deletePantryItem(id: string): Promise<void> {
  // Soft delete with usage tracking
}

export async function consumeItem(id: string, quantity: number, usedFor?: string): Promise<void> {
  // Track usage, update quantity, log analytics
}
```

#### 4.2 Recipe Engine APIs

```typescript
// app/actions/recipes.ts
export async function generateMealPlan(params: {
  pantryId: string;
  days: number;
  preferences: string[];
}): Promise<MealPlanSuggestion[]> {
  // 1. Fetch available pantry items
  // 2. Query recipes with ingredient matching algorithm
  // 3. Score recipes by match percentage and user preferences
  // 4. Generate balanced meal plan
  // 5. Return with shopping list for missing ingredients
}

export async function searchRecipes(query: RecipeSearchQuery): Promise<Recipe[]> {
  // Advanced search with filters (cuisine, time, difficulty, available ingredients)
}

export async function createRecipe(data: CreateRecipeInput): Promise<Recipe> {
  // Create user recipe with ingredients and instructions
}
```

#### 4.3 Alert & Notification APIs

```typescript
// app/actions/alerts.ts
export async function processExpiryAlerts(): Promise<void> {
  // Cron job: scan for expiring items, create alerts, send notifications
}

export async function sendNotification(userId: string, alert: Alert): Promise<void> {
  // Send email/push notification based on user preferences
}

export async function dismissAlert(alertId: string): Promise<void> {
  // Mark alert as dismissed
}
```

---

### 5. Core Features Implementation

#### 5.1 Barcode Scanner & Inventory Tracker

**Mobile-First Scanner Page** (`app/scan/page.tsx`):
```typescript
"use client";

import { useState } from 'react';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { ProductForm } from '@/components/ProductForm';

export default function ScanPage() {
  const [scannedProduct, setScannedProduct] = useState(null);
  
  const handleScan = async (barcode: string) => {
    const product = await scanBarcode(barcode);
    setScannedProduct(product);
  };
  
  return (
    <div className="container mx-auto p-4">
      {!scannedProduct ? (
        <BarcodeScanner onScan={handleScan} />
      ) : (
        <ProductForm 
          initialData={scannedProduct}
          onSave={addPantryItem}
        />
      )}
    </div>
  );
}
```

**Barcode Integration Flow**:
1. User scans barcode via camera or uploads image
2. Extract barcode using QuaggaJS or similar library
3. Query OpenFoodFacts API or UPC Database
4. Pre-populate form with product name, brand, category, nutrition
5. User confirms/edits quantity, expiry date, storage location
6. Save to database with automatic categorization

#### 5.2 Expiry Alert System

**Cron Job Implementation** (`app/api/cron/expiry-check/route.ts`):
```typescript
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendExpiryAlert } from '@/lib/notifications';

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  
  // Find items expiring soon
  const expiringItems = await prisma.pantryItem.findMany({
    where: {
      expiryDate: {
        lte: threeDaysFromNow,
        gte: now
      }
    },
    include: { user: true }
  });
  
  // Create alerts and send notifications
  for (const item of expiringItems) {
    await createExpiryAlert(item);
    await sendExpiryAlert(item.user.email, item);
  }
  
  return Response.json({ processed: expiringItems.length });
}
```

#### 5.3 Recipe Recommendation Engine

**Ingredient Matching Algorithm**:
```typescript
export async function findMatchingRecipes(pantryItems: PantryItem[]): Promise<RecipeMatch[]> {
  const availableIngredients = pantryItems.map(item => ({
    name: item.name.toLowerCase(),
    category: item.category,
    quantity: item.quantity
  }));
  
  const recipes = await prisma.recipe.findMany({
    include: { ingredients: true }
  });
  
  return recipes.map(recipe => {
    const matches = recipe.ingredients.filter(ingredient => 
      availableIngredients.some(available => 
        available.name.includes(ingredient.name.toLowerCase()) ||
        ingredient.name.toLowerCase().includes(available.name)
      )
    );
    
    const matchPercentage = (matches.length / recipe.ingredients.length) * 100;
    const missingIngredients = recipe.ingredients.filter(ingredient =>
      !matches.some(match => match.id === ingredient.id)
    );
    
    return {
      recipe,
      matchPercentage,
      availableIngredients: matches,
      missingIngredients,
      canMake: matchPercentage >= 70 // Configurable threshold
    };
  }).sort((a, b) => b.matchPercentage - a.matchPercentage);
}
```

---

### 6. User Interface Design

#### 6.1 Dashboard Layout

**Main Dashboard** (`app/dashboard/page.tsx`):
- **Quick Stats**: Total items, expiring soon, recipes available
- **Expiry Timeline**: Visual timeline of items expiring in next 7 days
- **Recipe Suggestions**: Top 3 recipes based on current inventory
- **Recent Activity**: Latest scans, consumption, alerts

#### 6.2 Mobile-Responsive Components

**Key UI Components**:
- **Scanner Interface**: Full-screen camera view with barcode overlay
- **Inventory Grid**: Masonry layout with item cards showing images, names, expiry
- **Recipe Cards**: Image, title, match percentage, difficulty, time
- **Shopping List**: Swipe-to-complete items with category grouping
- **Alert Notifications**: Toast messages with action buttons

#### 6.3 PWA Features

**Progressive Web App Setup**:
```typescript
// app/manifest.ts
export default function manifest() {
  return {
    name: 'Smart Pantry',
    short_name: 'Pantry',
    description: 'Smart pantry and recipe orchestrator',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
    ],
  }
}
```

---

### 7. Infrastructure & Deployment

#### 7.1 Docker Configuration

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/smartpantry
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - SMTP_HOST=${SMTP_HOST}
      - BARCODE_API_KEY=${BARCODE_API_KEY}
    depends_on:
      - db
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=smartpantry
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db

volumes:
  postgres_data:
```

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

#### 7.2 Coolify Deployment Configuration

**Environment Variables**:
```env
DATABASE_URL=postgresql://user:password@db:5432/smartpantry
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# External APIs
OPENFOODFACTS_API_URL=https://world.openfoodfacts.org/api/v0
UPC_DATABASE_API_KEY=your-upc-api-key

# Email/Notifications
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@your-domain.com

# Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# File Storage
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=5MB

# Security
CRON_SECRET=your-cron-secret-key
```

---

### 8. Security & Privacy

#### 8.1 Authentication & Authorization

**NextAuth.js Configuration**:
```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.SMTP_SERVER,
      from: process.env.FROM_EMAIL,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.sub },
    }),
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

#### 8.2 Data Protection

**Privacy Measures**:
- End-to-end encryption for sensitive data
- User data isolation with row-level security
- GDPR compliance with data export/deletion
- Rate limiting on API endpoints
- Input validation and sanitization
- Secure file upload with type/size restrictions

---

### 9. Performance & Scalability

#### 9.1 Database Optimization

**Indexing Strategy**:
```sql
-- Performance indexes
CREATE INDEX idx_pantry_items_expiry ON pantry_items(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX idx_pantry_items_user_category ON pantry_items(user_id, category);
CREATE INDEX idx_recipe_ingredients_name ON recipe_ingredients USING gin(name gin_trgm_ops);
CREATE INDEX idx_alerts_user_unread ON alerts(user_id) WHERE is_read = false;

-- Full-text search
CREATE INDEX idx_recipes_search ON recipes USING gin(to_tsvector('english', name || ' ' || description));
```

#### 9.2 Caching Strategy

**Redis Integration** (Optional Enhancement):
```typescript
// lib/cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedRecipes(userId: string): Promise<Recipe[] | null> {
  const cached = await redis.get(`user:${userId}:recipes`);
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedRecipes(userId: string, recipes: Recipe[]): Promise<void> {
  await redis.setex(`user:${userId}:recipes`, 300, JSON.stringify(recipes)); // 5 min cache
}
```

#### 9.3 Background Jobs

**Queue System** (Future Enhancement):
```typescript
// lib/queue.ts
import Bull from 'bull';

export const expiryQueue = new Bull('expiry alerts');
export const emailQueue = new Bull('email notifications');
export const barcodeQueue = new Bull('barcode processing');

// Process jobs
expiryQueue.process(async (job) => {
  await processExpiryAlerts();
});

emailQueue.process(async (job) => {
  const { userId, alertId } = job.data;
  await sendAlertEmail(userId, alertId);
});
```

---

### 10. Analytics & Insights

#### 10.1 Waste Tracking Dashboard

**Key Metrics**:
- Monthly waste by category and value
- Most frequently wasted items
- Expiry prediction accuracy
- Shopping pattern analysis
- Recipe usage statistics

#### 10.2 Data Visualization

**Chart Components**:
```typescript
// components/analytics/WasteHeatmap.tsx
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

export function WasteHeatmap({ data }: { data: WasteData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category" />
        <YAxis />
        <Bar dataKey="wastedValue" fill="#ef4444" />
        <Bar dataKey="consumedValue" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  );
}
```

---

### 11. Testing Strategy

#### 11.1 Test Structure

```
tests/
├── unit/
│   ├── actions/
│   ├── components/
│   └── utils/
├── integration/
│   ├── api/
│   └── database/
├── e2e/
│   ├── barcode-scanning.spec.ts
│   ├── recipe-generation.spec.ts
│   └── collaborative-pantry.spec.ts
└── fixtures/
    ├── sample-data.json
    └── mock-responses.json
```

#### 11.2 Key Test Scenarios

**Critical Path Testing**:
- Barcode scanning and product lookup
- Expiry alert generation and delivery
- Recipe matching algorithm accuracy
- Multi-user pantry collaboration
- Data export/import functionality

---

### 12. Development Phases

#### Phase 1: Core MVP (4-6 weeks)
- Basic inventory management (manual add/edit)
- Simple expiry alerts
- Basic recipe database and search
- User authentication and single pantry

#### Phase 2: Enhanced Features (3-4 weeks)
- Barcode scanning integration
- Email notifications
- Recipe recommendation engine
- Shopping list generation

#### Phase 3: Collaboration & Polish (3-4 weeks)
- Multi-user pantries and invitations
- Mobile PWA optimization
- Analytics dashboard
- Advanced search and filters

#### Phase 4: Advanced Features (Ongoing)
- AI-powered recipe suggestions
- Nutrition tracking
- Smart shopping predictions
- Integration with grocery delivery services

---

### 13. Success Metrics

#### 13.1 User Engagement
- Daily/Monthly Active Users
- Average session duration
- Feature adoption rates
- User retention (30/60/90 day)

#### 13.2 System Performance
- API response times < 200ms
- 99.9% uptime
- Database query optimization
- Mobile performance scores

#### 13.3 Business Impact
- Food waste reduction percentage
- User-reported savings
- Recipe completion rates
- Collaborative pantry adoption

---

This comprehensive system design provides a complete blueprint for building the Smart Pantry & Recipe Orchestrator. The architecture supports scalability, maintainability, and delivers a rich user experience while solving real problems around food waste and meal planning.