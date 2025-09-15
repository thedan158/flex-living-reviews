# Flex Living Reviews 🏠⭐

## 🚀 **LIVE APP**: https://flex-living-reviews-seven.vercel.app/

> **⚠️ IMPORTANT**: The version referenced in the "Submitted PDF" contains an outdated link. Use the URL above for the latest deployed version with full MongoDB integration.

A comprehensive property review management platform built with Next.js 15, designed for property managers to monitor and manage guest reviews across multiple properties. Features a modern dashboard with analytics, review approval system, and automated CI/CD deployment.

## 🌟 Key Features

- **Manager Dashboard** - Central hub for property performance monitoring
- **Review Management** - Approve/reject reviews with bulk operations
- **Advanced Analytics** - Charts, sentiment analysis, and performance metrics
- **Multi-Property Support** - Manage reviews across different properties
- **Responsive Design** - Mobile-first approach with modern UI
- **API Integration Ready** - Structured for Hostaway and Google Reviews APIs

## 📋 Documentation

This repository includes comprehensive documentation to help you understand and work with the project:

### 📖 Documentation Files

| File | Description | When to Read |
|------|-------------|--------------|
| **[`build-process.md`](build-process.md)** | Complete CI/CD setup and deployment guide | Setting up automated deployments, Vercel configuration, monitoring |
| **[`features.md`](features.md)** | Detailed feature overview and functionality | Understanding platform capabilities, dashboard features, analytics |
| **[`flexliving-project-structure.md`](flexliving-project-structure.md)** | Project architecture and technical setup | Developer onboarding, understanding codebase structure, API endpoints |

### 🚀 Quick Start Guides

- **For Developers**: Start with [`flexliving-project-structure.md`](flexliving-project-structure.md) to understand the architecture
- **For Deployment**: Read [`build-process.md`](build-process.md) for CI/CD setup
- **For Features**: Check [`features.md`](features.md) to explore platform capabilities

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts for data visualization
- **State Management**: TanStack React Query
- **Deployment**: Vercel with automated CI/CD

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/thedan158/flex-living-reviews.git
   cd flex-living-reviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📊 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests (when implemented)
```

## 🏗️ Project Structure

```
flex-living-reviews/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Manager dashboard
│   │   └── property/       # Property pages
│   ├── components/         # Reusable UI components
│   ├── lib/               # Core services and utilities
│   └── types/             # TypeScript definitions
├── public/                # Static assets
├── data/                  # Local data storage
└── docs/                  # Documentation (see markdown files above)
```

## 🔧 API Endpoints

- `GET /api/reviews` - Fetch all reviews with aggregation
- `POST /api/reviews/approve` - Approve/reject reviews
- `GET /api/properties` - Property listings
- `GET /api/analytics` - Analytics data and insights

## 🚀 Deployment

### Automated Deployment (Recommended)
This project is configured for automatic deployment to Vercel when code is pushed to the `main` branch.

**Setup Steps:**
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deployments happen automatically on every push to main

**For detailed deployment instructions, see [`build-process.md`](build-process.md)**

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

## 📈 Development Timeline

This project was built in a **5-hour development sprint** using AI-assisted development tools:
- **Planning & Architecture**: Claude AI for project structure design
- **Implementation**: Cline for code generation and development
- **Documentation**: Comprehensive guides for deployment and features

## 🎯 Database Integration

The application uses **MongoDB** for data persistence with comprehensive review data (41+ reviews across 9 months) to demonstrate:
- Realistic review content and ratings from real database
- Multiple property management scenarios
- Review approval workflow with persistent storage
- Analytics and reporting features with live data
- Dynamic month-over-month comparisons

## 📚 Learn More

- **[`features.md`](features.md)** - Complete feature overview and user guide
- **[`build-process.md`](build-process.md)** - CI/CD and deployment documentation
- **[`flexliving-project-structure.md`](flexliving-project-structure.md)** - Technical architecture guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Ready to explore?** Start with [`features.md`](features.md) to see what the platform can do, or dive into [`build-process.md`](build-process.md) for deployment setup!
