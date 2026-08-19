# VELO — Developer Guide

**Last Updated:** March 19, 2026
**Spec Version:** 1.0
**Complete Spec:** `/Users/peggycoppola/Downloads/VELO_App_Build_Specification.md`

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Overview](#project-overview)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Design System](#design-system)
6. [Development Setup](#development-setup)
7. [Coding Conventions](#coding-conventions)
8. [Building Features](#building-features)
9. [Key Architecture Decisions](#key-architecture-decisions)
10. [Deployment](#deployment)

---

## Quick Start

```bash
# Clone and setup
git clone <repo>
cd velo-app

# Install dependencies (mobile)
cd velo-app-mobile
npm install
npm start  # Starts Expo dev server

# In another terminal (backend)
cd ../velo-app-api
npm install
npm start  # Starts Fastify server on http://localhost:3000
```

**Mobile development**: Scan Expo QR code with Expo Go app (iOS/Android) for instant hot reload.

---

## Project Overview

### What VELO Is

VELO is a three-layer cycling super-platform for New York City (expanding globally):

1. **Marketplace Layer** — On-demand mobile mechanic booking, shop integration, gear P2P marketplace
2. **Community Layer** — Hyper-local ride groups, route sharing, events, social feed, challenges
3. **Intelligence Layer** — Predictive maintenance AI, digital bike passport, personalized recommendations

### Philosophy

- **Rider-first design**: Every pixel optimized for the rider experience. Mechanic app is functional.
- **Trust is the product**: Verified mechanics, transparent pricing, real reviews, insurance-backed service.
- **Cycling culture, not generic gig economy**: Tone is confident, clean, slightly irreverent — designed by cyclists for cyclists.
- **Speed over features at MVP**: Launch mechanic booking first. Make it flawless. Layer everything else.

### Two Separate Apps

Build **two distinct applications** sharing one backend API:

1. **VELO (Rider App)** — Consumer-facing, beautiful, iOS + Android
2. **VELO Mechanic** — Service provider tool, functional, iOS + Android

Different UIs, flows, and navigation. Same backend.

---

## Technology Stack

### Frontend (Mobile)

| Technology | Purpose | Why |
|-----------|---------|-----|
| **React Native** | Mobile app framework | Cross-platform iOS/Android from one codebase |
| **Expo** | Managed React Native workflow | Fast iteration, no native build setup at MVP |
| **React Navigation v7** | App navigation | Bottom tabs + nested stacks, industry standard |
| **Zustand** | Client state management | Lightweight, zero boilerplate |
| **TanStack Query** | Server state & caching | Automatic cache management, background refetch |
| **React Hook Form** | Form handling | Minimal re-renders, excellent DX |
| **Zod** | Schema validation | TypeScript-first, runtime safety |
| **react-native-maps** | Maps/location | Google Maps (Android), Apple Maps (iOS) |
| **react-native-reanimated v3** | Animations | 60fps animations, Worklet-based |
| **Phosphor Icons** | Icon library | 2000+ icons, consistent, cycling-relevant |
| **expo-image** | Image handling | Caching, placeholder support, fast loading |

### Backend

| Technology | Purpose | Why |
|-----------|---------|-----|
| **Node.js v20 LTS** | Runtime | Proven, mature, large ecosystem |
| **Fastify** | Web framework | 2x faster than Express, built-in schema validation |
| **PostgreSQL 16** | Primary database | Relational data, ACID guarantees, mature |
| **PostGIS** | Geospatial queries | Mechanic matching by proximity, route calculations |
| **Redis** | Cache & sessions | Session management, real-time data, rate limiting |
| **Meilisearch** | Full-text search | Mechanics, shops, gear listings, community posts |
| **Socket.io** | Real-time communication | GPS tracking, chat, live booking status updates |
| **BullMQ** | Background jobs | Email, push notifications, batch processing |
| **AWS S3** | File storage | Profile images, bike photos, service docs |
| **Stripe Connect** | Payments & payouts | Rider payments, mechanic payouts, commission handling |

### Third-Party Services

| Service | Purpose |
|---------|---------|
| **Strava API** | Rider ride history, predictive maintenance data |
| **Garmin Connect API** | Alternative ride data source |
| **Apple HealthKit / Google Fit** | Cycling activity import |
| **Google Places API** | Address autocomplete |
| **Mapbox Directions API** | ETA calculation, route display |
| **OneSignal** | Cross-platform push notifications |
| **Resend / Postmark** | Transactional emails |
| **Twilio** | SMS notifications (beta phase) |

### Infrastructure

| Component | Tool | Timeline |
|-----------|------|----------|
| **Hosting** | Railway or Render → AWS ECS at scale | MVP → Scale |
| **CDN** | Cloudflare | All stages |
| **Error tracking** | Sentry | Production |
| **Analytics** | Posthog | Production |
| **CI/CD** | GitHub Actions + EAS Build | All stages |
| **Uptime monitoring** | Betterstack | Production |

---

## Project Structure

```
velo-app/
├── velo-app-mobile/              # React Native (Expo)
│   ├── app/
│   │   ├── screens/              # Screen components by feature
│   │   │   ├── auth/             # LoginScreen, SignupScreen, OnboardingScreen
│   │   │   ├── booking/          # BookingRequestScreen, BookingDetailsScreen, TrackingScreen
│   │   │   ├── mechanics/        # MechanicSearchScreen, MechanicDetailScreen, ReviewsScreen
│   │   │   ├── bikes/            # BikeListScreen, BikeDetailScreen, BikeFormScreen
│   │   │   ├── community/        # RideGroupsScreen, EventsScreen, PostsScreen
│   │   │   ├── profile/          # ProfileScreen, SettingsScreen, EditProfileScreen
│   │   │   ├── gear/             # GearListingsScreen, GearDetailScreen, SellGearScreen
│   │   │   ├── subscription/     # VELOProScreen, BenefitsScreen
│   │   │   └── shared/           # HomeScreen, SearchScreen
│   │   ├── navigation/
│   │   │   ├── RootNavigator.js  # Auth vs Main app switch
│   │   │   ├── BottomTabNavigator.js  # 4 main tabs
│   │   │   └── LinkingConfiguration.js # Deep linking config
│   │   ├── api/
│   │   │   ├── client.js         # Axios instance with auth interceptors
│   │   │   ├── queries/          # TanStack Query hooks by feature
│   │   │   │   ├── useBookings.js
│   │   │   │   ├── useMechanics.js
│   │   │   │   ├── useBikes.js
│   │   │   │   └── ... (one per feature)
│   │   │   └── mutations/        # TanStack Query mutations by feature
│   │   ├── store/                # Zustand stores
│   │   │   ├── authStore.js      # User auth state
│   │   │   ├── appStore.js       # Global app state
│   │   │   └── uiStore.js        # UI state (bottom sheet, modals, etc.)
│   │   ├── components/           # Reusable components
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Card.js
│   │   │   ├── Avatar.js
│   │   │   ├── MechanicCard.js
│   │   │   ├── BookingCard.js
│   │   │   └── ... (one per unique component)
│   │   ├── utils/
│   │   │   ├── storage.js        # Secure token storage
│   │   │   ├── formatting.js     # Price, date, distance formatting
│   │   │   ├── validation.js     # Form validation helpers
│   │   │   └── geolocation.js    # Location helpers
│   │   ├── constants/
│   │   │   ├── colors.js         # Design system colors
│   │   │   ├── typography.js     # Design system fonts
│   │   │   ├── spacing.js        # Design system spacing
│   │   │   └── endpoints.js      # API endpoint URLs
│   │   ├── hooks/
│   │   │   ├── useLocation.js    # Location permission + tracking
│   │   │   ├── useNetworkStatus.js
│   │   │   └── useHaptics.js
│   │   ├── types/
│   │   │   ├── user.ts
│   │   │   ├── booking.ts
│   │   │   ├── bike.ts
│   │   │   └── ... (one per entity)
│   │   ├── App.js                # Root component
│   │   └── app.json              # Expo config
│   ├── package.json
│   ├── .env.example              # Template for env vars
│   └── README.md
│
├── velo-app-api/                 # Node.js + Fastify
│   ├── src/
│   │   ├── index.js              # Server entry, setup plugins
│   │   ├── routes/               # API routes by feature
│   │   │   ├── auth.js           # POST /auth/register, /auth/login, /auth/refresh
│   │   │   ├── users.js          # GET /users/:id, PUT /users/:id
│   │   │   ├── bikes.js          # CRUD /bikes
│   │   │   ├── bookings.js       # CRUD /bookings, status updates
│   │   │   ├── mechanics.js      # GET /mechanics, search, filtering
│   │   │   ├── services.js       # GET /services
│   │   │   ├── community.js      # Ride groups, events, posts, challenges
│   │   │   ├── gear.js           # Gear marketplace
│   │   │   ├── messages.js       # Chat endpoints
│   │   │   ├── subscription.js   # VELO Pro endpoints
│   │   │   ├── admin.js          # Admin dashboard endpoints
│   │   │   └── health.js         # Health checks
│   │   ├── middleware/
│   │   │   ├── auth.js           # JWT verification
│   │   │   ├── errorHandler.js   # Global error handling
│   │   │   ├── validation.js     # Input validation middleware
│   │   │   └── rateLimit.js      # Rate limiting
│   │   ├── models/               # Database models (Sequelize ORM)
│   │   │   ├── User.js
│   │   │   ├── RiderProfile.js
│   │   │   ├── MechanicProfile.js
│   │   │   ├── Bike.js
│   │   │   ├── Booking.js
│   │   │   ├── ServiceType.js
│   │   │   ├── Review.js
│   │   │   ├── CommunityPost.js
│   │   │   ├── RideGroup.js
│   │   │   ├── Challenge.js
│   │   │   ├── GearListing.js
│   │   │   ├── Message.js
│   │   │   └── index.js          # Initialize all models
│   │   ├── controllers/          # Business logic
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── mechanicController.js
│   │   │   ├── bikeController.js
│   │   │   ├── communityController.js
│   │   │   └── ... (one per feature)
│   │   ├── services/             # Complex business logic
│   │   │   ├── bookingService.js        # Matching algorithm, status updates
│   │   │   ├── mechanicMatchingService.js # Geospatial matching
│   │   │   ├── stravaService.js         # Strava API integration
│   │   │   ├── stripeService.js         # Payment processing
│   │   │   ├── predictiveMaintenanceService.js # Maintenance AI
│   │   │   ├── notificationService.js   # Email, SMS, push
│   │   │   └── ... (one per major feature)
│   │   ├── jobs/                 # BullMQ background jobs
│   │   │   ├── sendEmailJob.js
│   │   │   ├── sendPushNotificationJob.js
│   │   │   ├── predictiveMaintenanceCronJob.js
│   │   │   ├── processPaymentWebhookJob.js
│   │   │   └── ... (one per async task)
│   │   ├── config/
│   │   │   ├── database.js       # Sequelize initialization
│   │   │   ├── redis.js          # Redis client
│   │   │   ├── meilisearch.js    # Meilisearch client
│   │   │   ├── stripe.js         # Stripe client
│   │   │   ├── s3.js             # AWS S3 client
│   │   │   └── env.js            # Environment variables with validation
│   │   ├── utils/
│   │   │   ├── jwt.js            # JWT signing/verification
│   │   │   ├── geolocation.js    # Distance calc, geocoding
│   │   │   ├── formatting.js     # Response formatting
│   │   │   ├── errors.js         # Custom error classes
│   │   │   └── validators.js     # Common validators
│   │   ├── migrations/           # Database migrations (Sequelize migrations)
│   │   ├── seeders/              # Database seeders
│   │   │   ├── seedServiceTypes.js  # Seed 18 service types
│   │   │   └── seedCities.js
│   │   └── types/                # TypeScript types
│   │       ├── index.d.ts        # Global types
│   │       └── ... (one per major entity)
│   ├── .env.example
│   ├── package.json
│   ├── .eslintrc.js
│   ├── docker-compose.yml        # Local dev: PostgreSQL, Redis, Meilisearch
│   └── README.md
│
├── docs/                         # Documentation
│   ├── API.md                    # API endpoint reference
│   ├── DATABASE.md               # Schema documentation
│   ├── DESIGN_SYSTEM.md          # Design tokens & components
│   ├── MECHANICS.md              # Mechanic app flows
│   └── FLOWS.md                  # Auth, booking, payment flows
│
├── .github/
│   └── workflows/
│       ├── mobile-build.yml      # EAS Build for mobile
│       ├── api-deploy.yml        # Deploy backend on push
│       └── tests.yml             # Run tests on PR
│
├── CLAUDE.md                     # This file
└── .env.example                  # Global env template
```

---

## Design System

### Colors

#### Brand
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#1A1A2E` | Dark navy — primary text, headers |
| `brand-accent` | `#E85D24` | VELO orange — CTAs, highlights |
| `brand-accent-light` | `#FFF0E8` | Light orange — accent backgrounds |

#### Semantic
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#1B9E6D` | Confirmations, available status |
| `warning` | `#E5A218` | Pending states, caution |
| `error` | `#D93025` | Errors, destructive actions |
| `info` | `#2D7DD2` | Informational, links |

#### Neutral Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | `#1A1A2E` | Primary text |
| `neutral-700` | `#4A4A5A` | Secondary text |
| `neutral-500` | `#8E8E9A` | Placeholders, disabled |
| `neutral-300` | `#D1D1D8` | Borders, dividers |
| `neutral-100` | `#F4F4F6` | Subtle backgrounds |
| `neutral-50` | `#F8F7F4` | Page background (warm) |

### Typography

**Font Family**: SF Pro Display (iOS) / Google Sans (Android)

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| `display-lg` | 32px | 700 | Hero headings |
| `heading-lg` | 22px | 600 | Screen titles |
| `body-lg` | 16px | 400 | Primary text |
| `body-md` | 14px | 400 | Secondary text |
| `label-lg` | 14px | 600 | Buttons |
| `mono-md` | 16px | 500 | Prices |

### Spacing (8px base grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight gaps |
| `space-sm` | 8px | Small gaps |
| `space-md` | 12px | Default gap |
| `space-lg` | 16px | Section padding |
| `space-xl` | 24px | Major sections |
| `space-2xl` | 32px | Screen padding |

### Icons

- Use **Phosphor Icons** (phosphoricons.com)
- Weight: `regular` (default), `bold` (active/selected), `fill` (emphasized)
- Sizes: 24px (nav), 20px (inline), 16px (small/badges)
- Colors follow text color of context

### Components

#### Button
All buttons: 52px height, 24px horizontal padding, `radius-md` (10px)
- **Primary**: Orange background, white text — main CTAs ("Book Now", "Confirm")
- **Secondary**: Orange border, orange text — secondary actions ("View Details")
- **Tertiary**: Gray border, gray text — alternatives ("Cancel")
- **Ghost**: No border, orange text — inline ("See All")
- **Danger**: Red background — destructive ("Delete")

Press state: Scales 0.97 with 100ms spring. Haptic feedback (light impact) on iOS.

#### Input
- **Height**: 52px
- **Border**: 1px `neutral-300`, 2px `brand-accent` when focused
- **Border radius**: `radius-sm` (6px)
- **Label**: Floats above input on focus/fill (animated)
- **Error**: Red border with error message below in `body-sm`

#### Card
- **Background**: White
- **Border radius**: `radius-lg` (16px)
- **Padding**: 16px
- **Shadow**: `shadow-md` (0 4px 12px rgba...)

See full spec at `/Users/peggycoppola/Downloads/VELO_App_Build_Specification.md` (Section 3).

---

## Development Setup

### Prerequisites

```bash
# Node.js v20 LTS
node --version  # v20.x.x

# npm (comes with Node)
npm --version   # 10.x.x or higher
```

### Local Development

#### 1. Clone the repository

```bash
git clone <repo-url> velo-app
cd velo-app
```

#### 2. Set up environment variables

```bash
# Mobile
cp velo-app-mobile/.env.example velo-app-mobile/.env

# Backend
cp velo-app-api/.env.example velo-app-api/.env
```

**Backend `.env` template**:
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://velo:velo@localhost:5432/velo_dev
REDIS_URL=redis://localhost:6379
MEILISEARCH_URL=http://localhost:7700
MEILISEARCH_API_KEY=masterKey
AWS_ACCESS_KEY_ID=<your-dev-key>
AWS_SECRET_ACCESS_KEY=<your-dev-secret>
AWS_S3_BUCKET=velo-dev-uploads
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
JWT_SECRET=<generate-a-random-string>
STRAVA_CLIENT_ID=<from-strava-dev-app>
STRAVA_CLIENT_SECRET=<from-strava-dev-app>
GOOGLE_PLACES_API_KEY=<your-key>
MAPBOX_API_KEY=<your-key>
ONESIGNAL_APP_ID=<your-app-id>
ONESIGNAL_REST_API_KEY=<your-key>
```

#### 3. Start local services (PostgreSQL, Redis, Meilisearch)

```bash
cd velo-app-api
docker-compose up -d
```

This starts:
- PostgreSQL 16 on `localhost:5432`
- Redis on `localhost:6379`
- Meilisearch on `localhost:7700`

#### 4. Initialize database

```bash
cd velo-app-api
npm run migrate        # Run Sequelize migrations
npm run seed           # Seed service types and test data
```

#### 5. Start backend

```bash
cd velo-app-api
npm install
npm start
# Server runs on http://localhost:3000
```

#### 6. Start mobile app

In a **new terminal**:

```bash
cd velo-app-mobile
npm install
npm start
# Expo dev server starts, show QR code
# Scan with Expo Go app on iOS/Android
```

### Development Workflow

1. **Mobile**: Make changes, hot reload instantly via Expo
2. **Backend**: Make changes, server auto-restarts via nodemon
3. **Database**: Migrations are version-controlled in `src/migrations/`
4. **Design**: Reference design tokens in `velo-app-mobile/app/constants/`

### Testing

```bash
# Backend
cd velo-app-api
npm test               # Run Jest tests

# Mobile
cd velo-app-mobile
npm test               # Run Jest tests
```

---

## Coding Conventions

### General

- **Language**: JavaScript (could migrate to TypeScript later, but not required for MVP)
- **Linting**: ESLint configured in `.eslintrc.js`
- **Formatting**: Prettier with 2-space indentation
- **Line length**: 100 characters (soft limit)

### Mobile (React Native)

#### File Structure
- One component per file
- Component name matches filename (e.g., `MechanicCard.js`)
- Functional components only (hooks-based)

#### Component Template
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@constants/index';

const MyComponent = ({ prop1, prop2 }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.heading.lg,
    color: colors.brand.primary,
  },
});

export default MyComponent;
```

#### Naming Conventions
- **Screens**: `*Screen.js` (e.g., `BookingRequestScreen.js`)
- **Components**: `*.js` (e.g., `MechanicCard.js`)
- **Hooks**: `use*.js` (e.g., `useLocation.js`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_BIKE_PHOTOS = 6`)

#### Imports
Order imports:
1. React/React Native core
2. Navigation
3. Third-party libraries
4. Local components
5. Constants/utils/hooks

```javascript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import MechanicCard from '@components/MechanicCard';
import { colors } from '@constants/index';
```

#### State Management
- Use **Zustand** for persistent global state (auth, user, app settings)
- Use **TanStack Query** for server state (bookings, mechanics, bikes)
- Use **useState** for local component state only

```javascript
import { useAuthStore } from '@store/authStore';
import { useMechanics } from '@api/queries/useMechanics';

const MechanicListScreen = () => {
  const user = useAuthStore((state) => state.user);
  const { data: mechanics, isLoading } = useMechanics();
  // ...
};
```

#### API Calls
Always use TanStack Query for fetching:

```javascript
// velo-app-mobile/app/api/queries/useMechanics.js
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@api/client';

export const useMechanics = (filters = {}) => {
  return useQuery({
    queryKey: ['mechanics', filters],
    queryFn: async () => {
      const response = await apiClient.get('/mechanics', { params: filters });
      return response.data;
    },
  });
};
```

Never make direct Axios calls in components — always use a custom hook.

#### Styling
Use `StyleSheet.create()` for performance:

```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brand.offwhite,
  },
});
```

### Backend (Node.js + Fastify)

#### File Structure
- One model, controller, or service per file
- Async/await for all async operations
- Error handling with try/catch

#### Route Template
```javascript
// routes/bookings.js
async function bookingRoutes(fastify) {
  fastify.get('/bookings', {
    onRequest: [fastify.authenticate], // Require auth
    schema: {
      querystring: {
        limit: { type: 'integer', default: 20 },
        offset: { type: 'integer', default: 0 },
      },
      response: { 200: { type: 'object' } },
    },
  }, async (request, reply) => {
    try {
      const bookings = await BookingController.getBookings(request.user.id, request.query);
      return reply.send({ data: bookings });
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Internal server error' });
    }
  });
}

module.exports = bookingRoutes;
```

#### Controller Template
```javascript
// controllers/bookingController.js
class BookingController {
  static async getBookings(userId, filters) {
    const bookings = await Booking.findAll({
      where: { rider_id: userId },
      limit: filters.limit,
      offset: filters.offset,
      include: [{ model: Mechanic, include: [{ model: User }] }],
    });
    return bookings;
  }

  static async createBooking(userId, bookingData) {
    // Validate mechanic availability
    // Create booking
    // Trigger mechanic notification
    // Return booking with status pending
  }
}

module.exports = BookingController;
```

#### Error Handling
Use custom error classes:

```javascript
// utils/errors.js
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'ValidationError';
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

module.exports = { ValidationError, NotFoundError };
```

#### Database Models
Use Sequelize ORM:

```javascript
// models/Booking.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rider_id: {
      type: DataTypes.UUID,
      references: { model: 'Users', key: 'id' },
      allowNull: false,
    },
    mechanic_id: {
      type: DataTypes.UUID,
      references: { model: 'MechanicProfiles', key: 'user_id' },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'en_route', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    service_type_id: {
      type: DataTypes.UUID,
      references: { model: 'ServiceTypes', key: 'id' },
    },
  }, {
    timestamps: true,
  });

  return Booking;
};
```

#### Naming Conventions
- **Routes**: `/features` (e.g., `/bookings`, `/mechanics`)
- **Controllers**: `*Controller.js` (e.g., `BookingController.js`)
- **Services**: `*Service.js` (e.g., `BookingService.js`)
- **Models**: Singular, PascalCase (e.g., `Booking.js`, `User.js`)
- **Database columns**: snake_case (e.g., `rider_id`, `created_at`)

### Git Conventions

#### Commit Messages
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
**Scope**: Feature area (e.g., `booking`, `auth`, `mechanics`)
**Subject**: Imperative, lowercase, no period

**Examples**:
```
feat(booking): add mechanic matching algorithm
fix(auth): resolve token expiration on app backgrounding
docs(setup): update local development instructions
```

#### Branch Names
```
feature/mechanic-matching
fix/booking-status-update
docs/api-endpoints
```

---

## Building Features

### Feature Checklist

When building a new feature, follow this checklist:

1. **Database**
   - [ ] Create migrations for new tables
   - [ ] Add models (Sequelize)
   - [ ] Create indexes as needed

2. **Backend API**
   - [ ] Create routes
   - [ ] Write controllers
   - [ ] Write services (business logic)
   - [ ] Add validation
   - [ ] Write tests

3. **Mobile**
   - [ ] Design screens (reference design system)
   - [ ] Create components
   - [ ] Implement API queries/mutations
   - [ ] Add navigation
   - [ ] Add error handling

4. **Testing**
   - [ ] Write API tests (Jest)
   - [ ] Write component tests (React Native Testing Library)
   - [ ] Manual QA on device

5. **Documentation**
   - [ ] Update API.md
   - [ ] Add code comments for complex logic
   - [ ] Update this CLAUDE.md if new conventions

### Example: Building "Cancel Booking" Feature

**1. Database** (`velo-app-api/src/migrations/`):
```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bookings', 'cancelled_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('Bookings', 'cancellation_reason', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
};
```

**2. Backend** (`velo-app-api/src/routes/bookings.js`):
```javascript
fastify.post('/bookings/:id/cancel', {
  onRequest: [fastify.authenticate],
}, async (request, reply) => {
  const { reason } = request.body;
  const booking = await BookingService.cancelBooking(request.params.id, request.user.id, reason);
  // Notify mechanic
  // Refund rider if applicable
  return reply.send({ data: booking });
});
```

**3. Mobile** (`velo-app-mobile/app/screens/booking/BookingDetailsScreen.js`):
```javascript
const useCancelBooking = () => {
  return useMutation({
    mutationFn: (bookingId, reason) =>
      apiClient.post(`/bookings/${bookingId}/cancel`, { reason }),
  });
};

export const BookingDetailsScreen = ({ bookingId }) => {
  const { mutate: cancelBooking } = useCancelBooking();

  const handleCancel = () => {
    Alert.alert('Cancel booking?', 'You can cancel up to 2 hours before.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Cancel',
        style: 'destructive',
        onPress: () => cancelBooking(bookingId, 'User requested'),
      },
    ]);
  };

  return (
    <Button variant="danger" onPress={handleCancel}>
      Cancel Booking
    </Button>
  );
};
```

---

## Key Architecture Decisions

### Why Expo (not bare React Native)?

- **Faster MVP**: No native build setup, instant iteration
- **Simplicity**: Managed workflow handles updates, push notifications, etc.
- **Trade-off**: Less control over native modules (acceptable for MVP)
- **Future**: Can eject to bare RN later if needed

### Why Fastify (not Express)?

- **Speed**: 2-3x faster request handling
- **Schema validation**: Built-in request validation (no separate middleware)
- **Plugins**: Cleaner plugin system than Express middleware
- **DX**: Better TypeScript support, modern APIs

### Why PostgreSQL + PostGIS?

- **Relational data**: Riders, bikes, bookings, reviews fit ACID model perfectly
- **Geospatial**: PostGIS extension enables "find nearby mechanics" with single query
- **Mature**: Battle-tested, excellent tooling

### Why Redis + BullMQ?

- **Sessions**: Fast session storage, auto-cleanup
- **Real-time data**: Mechanic availability, booking updates
- **Background jobs**: Email/push notifications don't block API responses
- **Rate limiting**: Simple rate limit checks via Redis counters

### Why TanStack Query (not Redux)?

- **Server state**: Automatic caching, refetch on focus, background updates
- **Boilerplate**: No actions/reducers, minimal setup
- **Performance**: Prevents over-fetching, deduplicates requests
- **Trade-off**: For complex client state, use Zustand (which we do)

### Why Socket.io (not just polling)?

- **Mechanic tracking**: Low-latency GPS updates during en-route phase
- **Chat**: Real-time messages between rider and mechanic
- **Booking updates**: Instant status updates without polling
- **Cost**: More efficient than polling thousands of concurrent connections

---

## Deployment

### Mobile (iOS & Android)

1. **Build with EAS**:
   ```bash
   cd velo-app-mobile
   eas login  # Log in with Expo account
   eas build --platform ios
   eas build --platform android
   ```

2. **Distribute**:
   - **iOS**: Testflight for beta, App Store for production
   - **Android**: Google Play Console (internal testing → beta → production)

3. **CI/CD**: GitHub Actions auto-builds on tag push (see `.github/workflows/mobile-build.yml`)

### Backend

1. **Choose hosting** (options in order of recommendation for MVP):
   - **Railway.app** (recommended): Deploy from Git, auto-scaling, PostgreSQL addon
   - **Render**: Similar to Railway, slightly slower onboarding
   - **Heroku**: Familiar but expensive at scale
   - **AWS ECS**: Best at scale, complex setup

2. **Deploy**:
   ```bash
   # Railway
   railway link
   railway up

   # Render
   git push origin main  # Auto-deploys
   ```

3. **Environment**:
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Enable HTTPS only
   - Configure CORS for your mobile app domain

4. **Database**:
   - Production: Managed PostgreSQL (AWS RDS, Railway, Render)
   - Backups: Daily automated backups
   - Monitoring: Slow query logs, connection pool monitoring

5. **Monitoring**:
   - **Errors**: Sentry captures exceptions
   - **Logs**: Railway/Render built-in log streaming
   - **Analytics**: Posthog tracks user behavior
   - **Uptime**: Betterstack monitors endpoint health

### CI/CD Pipeline

Automated on push to `main`:

1. **Tests**: Run Jest tests (fail if coverage drops)
2. **Linting**: ESLint check (fail if linting errors)
3. **Build backend**: Compile, check for errors
4. **Build mobile**: EAS build (iOS & Android)
5. **Deploy backend**: Push to Railway/Render
6. **Deploy mobile**: Push to Testflight/Google Play internal testing

See `.github/workflows/` for implementation.

---

## Quick Reference

### Key Repositories & Paths

| Item | Path |
|------|------|
| **Spec** | `/Users/peggycoppola/Downloads/VELO_App_Build_Specification.md` |
| **Business Plan** | `/Users/peggycoppola/Downloads/VELO Business Plan 3-19-26.docx` |
| **Brand Guidelines** | `/Users/peggycoppola/Downloads/VELO_Brand_Guidelines_v3.pdf` |
| **Design System Colors** | `velo-app-mobile/app/constants/colors.js` |
| **Design System Typography** | `velo-app-mobile/app/constants/typography.js` |
| **API Endpoints** | `docs/API.md` |
| **Database Schema** | `docs/DATABASE.md` |

### Common Commands

```bash
# Mobile
cd velo-app-mobile
npm start                 # Start Expo dev server
npm test                  # Run tests
npm run build:ios         # Local iOS build
npm run build:android     # Local Android build

# Backend
cd velo-app-api
npm start                 # Start Fastify server
npm test                  # Run tests
npm run migrate           # Run migrations
npm run seed              # Seed database
npm run lint              # ESLint check

# Docker (local services)
docker-compose up -d      # Start PostgreSQL, Redis, Meilisearch
docker-compose down       # Stop services
```

### Useful Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Fastify](https://www.fastify.io/)
- [TanStack Query](https://tanstack.com/query/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Phosphor Icons](https://phosphoricons.com/)
- [Stripe Connect Docs](https://stripe.com/docs/connect)
- [PostGIS](https://postgis.net/)
- [Socket.io](https://socket.io/)

---

## Questions?

Refer to the **complete specification** at `/Users/peggycoppola/Downloads/VELO_App_Build_Specification.md` for detailed information on:
- All screen designs and flows
- All API endpoints
- All database models
- All business logic
- Payment integration details
- Community features
- Admin dashboard

Good luck building VELO! 🚴‍♂️
