# VELO — Cycling Platform Monorepo

The world's first fully integrated cycling platform. A marketplace, community network, and intelligence layer for cyclists.

## Structure

This is a monorepo using npm workspaces with the following structure:

```
velo-app/
├── apps/
│   ├── api/                    # Fastify backend API
│   ├── mobile-rider/           # React Native Rider app (Expo)
│   └── mobile-mechanic/        # React Native Mechanic app (Expo)
├── packages/
│   └── shared/                 # Shared types, constants, utils
├── docs/                       # Documentation
├── CLAUDE.md                   # Developer guide (READ THIS!)
└── package.json               # Root workspace config
```

## Quick Start

### Prerequisites

- **Node.js** v20 LTS
- **npm** v10+
- **Docker** (for local PostgreSQL, Redis, Meilisearch)

### Setup

```bash
# Clone the repo
git clone <repo-url>
cd velo-app

# Install dependencies for all workspaces
npm install

# Copy environment files
cp apps/api/.env.example apps/api/.env
cp apps/mobile-rider/.env.example apps/mobile-rider/.env
cp apps/mobile-mechanic/.env.example apps/mobile-mechanic/.env
```

### Run Locally

**Terminal 1 — Start local services** (PostgreSQL, Redis, Meilisearch):
```bash
cd apps/api
docker-compose up -d
```

**Terminal 2 — Start backend API**:
```bash
npm run api
# Server running at http://localhost:3000
```

**Terminal 3 — Start Rider app**:
```bash
npm run mobile:rider
# Expo dev server running
# Scan QR code with Expo Go app
```

**Terminal 4 — Start Mechanic app** (optional):
```bash
npm run mobile:mechanic
# Expo dev server running
# Scan QR code with Expo Go app
```

## Available Scripts

**From root directory:**

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies for all workspaces |
| `npm run dev` | Run dev servers for all workspaces |
| `npm run build` | Build all workspaces |
| `npm run test` | Run tests for all workspaces |
| `npm run lint` | Lint all workspaces |
| `npm run api` | Start backend API (port 3000) |
| `npm run mobile:rider` | Start Rider app (port 8081) |
| `npm run mobile:mechanic` | Start Mechanic app (port 8082) |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |

## Project Structure

### `/apps/api`

Fastify backend API with:
- RESTful endpoints
- Real-time WebSocket with Socket.io
- PostgreSQL + PostGIS for geospatial queries
- Redis for caching and sessions
- Stripe integration for payments
- JWT authentication
- Background jobs with BullMQ

**Key files:**
- `src/index.ts` — Server entry point
- `src/config/env.ts` — Environment configuration
- `src/routes/` — API route handlers
- `src/models/` — Database models (Sequelize)
- `src/services/` — Business logic
- `src/controllers/` — Route controllers

### `/apps/mobile-rider`

React Native Rider app with:
- Bottom tab navigation (Home, Book, Community, Profile)
- Real-time booking updates
- GPS mechanic tracking
- Bike digital passport
- Community features (ride groups, events, posts)
- Gear marketplace

**Key files:**
- `src/App.tsx` — Root component
- `src/screens/` — Screen components
- `src/navigation/` — Navigation config
- `src/store/` — Zustand state stores
- `src/api/` — API queries and mutations
- `src/constants/` — Design tokens

### `/apps/mobile-mechanic`

React Native Mechanic app with:
- Booking management
- Real-time availability
- GPS tracking for riders
- Earnings dashboard
- Chat with riders
- Profile and settings

**Key files:**
- `src/App.tsx` — Root component
- `src/screens/` — Screen components
- `src/navigation/` — Navigation config
- `src/store/` — Zustand state stores
- `src/api/` — API queries and mutations

### `/packages/shared`

Shared TypeScript types, constants, and utilities:
- Type definitions for entities (User, Bike, Booking, etc.)
- Design system colors and spacing
- API endpoint constants
- Validation schemas (Zod)
- Utility functions (formatting, distance calc, etc.)

**Usage:**
```typescript
import { COLORS, SPACING, SERVICE_TYPES } from '@velo/shared';
```

## Development Guidelines

See **CLAUDE.md** for comprehensive development guidelines including:
- Coding conventions (mobile & backend)
- Design system reference
- Feature building checklist
- Testing strategy
- Deployment guide

## Tech Stack

### Frontend (Mobile)
- **React Native** with Expo
- **React Navigation** for routing
- **Zustand** for state management
- **TanStack Query** for server state
- **React Hook Form** for forms
- **Zod** for validation
- **Phosphor Icons** for UI icons
- **react-native-maps** for maps

### Backend
- **Node.js v20 LTS**
- **Fastify** web framework
- **PostgreSQL 16** + PostGIS
- **Redis** for caching
- **Socket.io** for real-time
- **BullMQ** for background jobs
- **Stripe** for payments
- **AWS S3** for file storage
- **Meilisearch** for full-text search

### Infrastructure
- **Docker** for local development
- **Railway/Render** for MVP hosting (→ AWS ECS at scale)
- **GitHub Actions** for CI/CD
- **Sentry** for error tracking
- **Posthog** for analytics

## Key Features (MVP)

1. **Mobile Mechanic Booking** — Book a certified mechanic in ~2 hours with transparent pricing
2. **Digital Bike Passport** — Complete service history and predictive maintenance
3. **Community** — Local ride groups, route sharing, events, challenges
4. **Real-time Updates** — GPS tracking during mechanic dispatch, chat
5. **Mechanic Onboarding** — Specialized onboarding app for service providers
6. **Payments** — Stripe for rider payments, Stripe Connect for mechanic payouts

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** — Developer guide, coding conventions, build instructions
- **[Specification](https://path/to/VELO_App_Build_Specification.md)** — Complete technical specification
- **[Business Plan](https://path/to/VELO_Business_Plan.docx)** — Business strategy and financials

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Follow coding conventions in CLAUDE.md
3. Run linting and tests: `npm run lint` && `npm test`
4. Commit with clear messages: `git commit -m "feat(scope): description"`
5. Open a PR for review

## Deployment

### Mobile Apps
- Built with EAS (Expo Application Services)
- TestFlight (iOS) and Google Play Internal (Android)
- See CLAUDE.md for detailed deployment steps

### Backend API
- Railway or Render (MVP) → AWS ECS (scale)
- Automatic deployment on push to main
- Managed PostgreSQL via provider
- See CLAUDE.md for setup instructions

## Status

🚧 **Monorepo scaffolding complete** — Ready for feature development

## License

Proprietary — All rights reserved
