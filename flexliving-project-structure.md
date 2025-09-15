# Flex Living Reviews Dashboard - Current Project Structure

## Root Directory Structure

```
flex-living-reviews/
├── .env.local                        # Environment variables
├── .gitignore                        # Git ignore rules
├── next.config.ts                    # Next.js configuration (TypeScript)
├── package.json                      # Dependencies and scripts
├── package-lock.json                 # Lock file
├── postcss.config.mjs                # PostCSS configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── README.md                         # Project documentation
│
├── data/                             # Local data storage
│   └── review-approvals.json         # Review approval data
│
├── docs/                             # Documentation (empty)
│
├── public/                           # Static assets
│   ├── favicon.ico
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── images/
│       └── properties/
│           └── README.md
│
├── src/
│   ├── app/                          # App Router (Next.js 15)
│   │   ├── favicon.ico
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   │
│   │   ├── about/                    # About page
│   │   │   └── page.tsx
│   │   │
│   │   ├── api/                      # API Routes
│   │   │   ├── analytics/
│   │   │   │   └── route.ts          # GET /api/analytics (MongoDB data)
│   │   │   ├── migrate/
│   │   │   │   └── route.ts          # POST /api/migrate (data seeding)
│   │   │   ├── properties/
│   │   │   │   ├── route.ts          # GET /api/properties
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts      # GET /api/properties/[id]
│   │   │   └── reviews/
│   │   │       ├── route.ts          # GET /api/reviews (MongoDB aggregation)
│   │   │       ├── approve/
│   │   │       │   └── route.ts      # POST /api/reviews/approve (MongoDB update)
│   │   │       ├── google/
│   │   │       │   └── route.ts      # GET /api/reviews/google
│   │   │       └── hostaway/
│   │   │           └── route.ts      # GET /api/reviews/hostaway
│   │   │
│   │   ├── contact/                  # Contact page
│   │   │   └── page.tsx
│   │   │
│   │   ├── dashboard/                # Manager Dashboard
│   │   │   ├── page.tsx              # Dashboard page with MongoDB integration
│   │   │   └── components/           # Dashboard components (empty)
│   │   │
│   │   ├── property/                 # Property pages
│   │   │   ├── page.tsx              # Property listing page
│   │   │   └── [slug]/               # Dynamic property page
│   │   │       ├── page.tsx
│   │   │       └── components/       # Property components (empty)
│   │   │
│   │   └── search/                   # Search page
│   │       └── page.tsx
│   │
│   ├── components/                   # Shared Components
│   │   ├── Header.tsx                # Main header component
│   │   ├── SearchForm.tsx            # Search form component
│   │   ├── charts/                   # Chart components (empty)
│   │   ├── layout/                   # Layout components (empty)
│   │   └── ui/                       # UI components (empty)
│   │
│   ├── lib/                          # Core Services & Utilities
│   │   ├── services/                 # Service modules
│   │   │   ├── database/             # MongoDB database services
│   │   │   │   ├── connection.ts     # MongoDB connection
│   │   │   │   ├── models/           # Mongoose models
│   │   │   │   │   └── Review.ts     # Review model
│   │   │   │   └── repositories/     # Repository pattern
│   │   │   │       └── ReviewRepository.ts # Review data access
│   │   │   │   └── migrateData.ts    # Data migration utilities
│   │   │   ├── google/               # Google services (empty)
│   │   │   ├── hostaway/             # Hostaway services
│   │   │   │   ├── api.ts            # Hostaway API client
│   │   │   │   └── mockData.ts       # Mock Hostaway data (41+ reviews)
│   │   │   ├── properties/           # Properties services (empty)
│   │   │   └── reviews/              # Reviews services (empty)
│   │   │   └── storage.ts            # Local storage service
│   │   │
│   │   ├── utils/                    # Utility Functions
│   │   │   └── reviewNormalizer.ts   # Review normalization utility
│   │   │
│   │   └── hooks/                    # Custom React Hooks (empty)
│   │
│   ├── styles/                       # Global Styles (empty)
│   │
│   └── types/                        # TypeScript Type Definitions
│       └── review.ts                 # Review type definitions
│
└── tests/                            # Test Files (empty)
    ├── __mocks__/
    ├── api/
    ├── components/
    └── services/
```

## Key Files Configuration

### package.json (Current)
```json
{
  "name": "flex-living-reviews",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build --turbopack",
    "start": "next start",
    "lint": "next lint",
    "test": "jest"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.87.4",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "fs": "^0.0.1-security",
    "lucide-react": "^0.544.0",
    "next": "15.5.3",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "recharts": "^3.2.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "jest": "^29.0.0",
    "jest-environment-jsdom": "^29.0.0",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### .env.local
```env
# Hostaway API
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_BASE_URL=https://api.hostaway.com/v1

# Google Places API (if implemented)
GOOGLE_PLACES_API_KEY=your_google_places_api_key

# Database (if using)
DATABASE_URL=your_database_url

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['example.com'], // Add image domains as needed
  },
  env: {
    HOSTAWAY_API_KEY: process.env.HOSTAWAY_API_KEY,
    HOSTAWAY_ACCOUNT_ID: process.env.HOSTAWAY_ACCOUNT_ID,
  },
}

module.exports = nextConfig
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        }
      }
    },
  },
  plugins: [],
}
```

## Microservices Architecture Pattern

This structure follows microservices principles within a Next.js monorepo:

### 1. **Service Layer** (`/src/lib/services/`)
- **Hostaway Service**: Handles all Hostaway API integration
- **Google Service**: Manages Google Places API integration  
- **Reviews Service**: Aggregates and processes reviews from multiple sources
- **Properties Service**: Manages property data and metadata

### 2. **API Layer** (`/src/app/api/`)
- RESTful endpoints that utilize services
- Proper separation of concerns
- Standardized response formats

### 3. **Data Layer** (`/src/lib/database/`)
- Repository pattern for data access
- Model definitions
- Database abstraction

### 4. **Presentation Layer** (`/src/app/`, `/src/components/`)
- Dashboard for managers
- Public property pages
- Reusable UI components

## Getting Started Commands

```bash
# Initialize the project
npx create-next-app@latest flex-living-reviews --typescript --tailwind --app
cd flex-living-reviews

# Install additional dependencies
npm install @tanstack/react-query lucide-react recharts date-fns clsx

# Create the directory structure
mkdir -p src/lib/{services/{hostaway,google,reviews,properties},database/{models,repositories},utils,hooks}
mkdir -p src/types src/components/{ui,layout,charts}
mkdir -p docs tests/{__mocks__,api,components,services}

# Start development
npm run dev
```

This structure gives you a solid foundation for AI-assisted development with clear separation of concerns and scalable architecture!
