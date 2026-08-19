# VELO — Complete App Build Specification
## AI Model Instructions: Build This Exactly As Specified

**Document version:** 1.0  
**Last updated:** March 19, 2026  
**Purpose:** This document contains every instruction an AI coding model needs to build the VELO mobile application from scratch. Follow it sequentially. Do not skip sections. Do not improvise on design tokens, flows, or data models — everything is specified.

---

## TABLE OF CONTENTS

1. Project Overview & Philosophy
2. Technology Stack & Architecture
3. Design System (Complete)
4. Data Models & Schema
5. Authentication & Onboarding Flows
6. Screen-by-Screen Specifications (Rider App)
7. Screen-by-Screen Specifications (Mechanic App)
8. API Endpoints & Backend Logic
9. Payment Integration
10. Push Notifications & Real-Time Systems
11. Community & Social Features
12. Bike Digital Passport
13. VELO Pro Subscription
14. Search, Filtering & Matching Algorithm
15. Admin Dashboard
16. Error Handling & Edge Cases
17. Performance, Accessibility & Security
18. Testing Strategy
19. Deployment & CI/CD
20. Post-Launch Analytics & Tracking

---

## 1. PROJECT OVERVIEW & PHILOSOPHY

### What VELO Is
VELO is a three-layer cycling super-platform for New York City (initially), expanding globally. It connects cyclists with verified mobile mechanics, local cycling communities, and intelligent bike management tools.

### The Three Layers
- **Layer 1 — Marketplace:** On-demand and scheduled mobile mechanic booking, shop integration, bike fittings, specialist services, gear marketplace (P2P).
- **Layer 2 — Community:** Hyper-local ride groups, route sharing, event discovery, club management tools, social feed, challenges.
- **Layer 3 — Intelligence:** Predictive maintenance AI, digital bike passport (full service history per bike), personalized recommendations, data insights.

### Design Philosophy
- **Rider-first:** Every decision optimizes for the rider's experience. The mechanic app is functional and efficient; the rider app is beautiful and delightful.
- **Trust is the product:** Transparent pricing, verified mechanics, real reviews, insurance-backed service. Every pixel should communicate trustworthiness.
- **Cycling culture, not generic gig economy:** The app should feel like it was designed by cyclists for cyclists. Tone is confident, clean, slightly irreverent — not corporate. Think Rapha meets Airbnb.
- **Speed over features at MVP:** Ship the booking flow first. Make it flawless. Layer everything else on top.

### Two Separate Apps
Build TWO distinct applications sharing one backend:
1. **VELO (Rider App)** — iOS and Android. This is the consumer-facing product.
2. **VELO Mechanic** — iOS and Android. This is the service provider tool.

Both apps share the same backend API but have entirely different UIs, flows, and navigation structures.

---

## 2. TECHNOLOGY STACK & ARCHITECTURE

### Frontend (Mobile)
- **Framework:** React Native (Expo managed workflow for faster iteration at MVP)
- **Navigation:** React Navigation v7 (bottom tabs + stack navigators)
- **State management:** Zustand (lightweight, no boilerplate) for client state; React Query (TanStack Query) for server state/caching
- **Forms:** React Hook Form + Zod validation
- **Maps:** react-native-maps (Google Maps on Android, Apple Maps on iOS)
- **Animations:** react-native-reanimated v3
- **Icons:** Phosphor Icons (consistent, modern, extensive cycling-relevant set)
- **Image handling:** expo-image (fast, cached, blur hash placeholders)

### Backend
- **Runtime:** Node.js (v20 LTS)
- **Framework:** Fastify (faster than Express, schema validation built in)
- **Database:** PostgreSQL 16 (primary relational data) + PostGIS extension (geospatial queries for mechanic matching)
- **Cache:** Redis (session management, real-time mechanic availability, rate limiting)
- **Search:** Meilisearch (full-text search for mechanics, shops, gear listings, community posts)
- **File storage:** AWS S3 (profile images, bike photos, service documentation photos)
- **Real-time:** Socket.io (mechanic GPS tracking during en-route, chat, live booking status updates)
- **Background jobs:** BullMQ on Redis (email sends, push notifications, predictive maintenance cron jobs, payment webhook processing)
- **Email:** Resend (transactional emails) or Postmark
- **SMS:** Twilio (booking confirmations, mechanic dispatch for beta)

### Payments
- **Stripe Connect** (Custom accounts for mechanics, Express accounts for shops)
- Rider pays via Stripe (card on file, Apple Pay, Google Pay)
- VELO takes 15-20% commission (configurable per service type)
- Mechanic receives weekly ACH payout via Stripe Connect

### Infrastructure
- **Hosting:** Railway or Render (fast deployment at MVP stage) → migrate to AWS ECS at scale
- **CDN:** Cloudflare (static assets, image optimization)
- **Monitoring:** Sentry (error tracking), Posthog (product analytics), Betterstack (uptime)
- **CI/CD:** GitHub Actions → EAS Build (Expo) for mobile, auto-deploy backend on push to main

### Third-Party Integrations
- **Strava API** — Import rider's ride history (miles, terrain, weather) for predictive maintenance
- **Garmin Connect API** — Same as Strava, for Garmin users
- **Apple HealthKit / Google Fit** — Cycling activity data import
- **Google Places API** — Address autocomplete for service locations
- **Mapbox Directions API** — Route display, ETA calculation for mechanic en-route
- **OneSignal** — Push notifications (cross-platform)
- **Stripe** — Payments, payouts, invoicing
- **Twilio** — SMS notifications (beta phase, fallback)

---

## 3. DESIGN SYSTEM (COMPLETE)

### Brand Identity
- **App name:** VELO
- **Tagline:** "Your cycling home."
- **Tone of voice:** Confident, clean, warm, knowledgeable. Not corporate. Not bro-culture. Think: a trusted friend who really knows bikes.

### Color Palette

#### Primary Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-primary` | `#1A1A2E` | Dark navy — primary text, headers, hero backgrounds |
| `brand-accent` | `#E85D24` | VELO orange — CTAs, highlights, brand moments, active states |
| `brand-accent-light` | `#FFF0E8` | Light orange tint — accent backgrounds, selected states |
| `brand-white` | `#FFFFFF` | Card backgrounds, primary surfaces |
| `brand-offwhite` | `#F8F7F4` | Page/screen backgrounds (warm, not sterile) |

#### Semantic Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `success` | `#1B9E6D` | Confirmations, completed states, available status |
| `success-light` | `#E8F7F0` | Success backgrounds |
| `warning` | `#E5A218` | Pending states, caution messages |
| `warning-light` | `#FEF6E0` | Warning backgrounds |
| `error` | `#D93025` | Errors, destructive actions, urgent alerts |
| `error-light` | `#FDECEA` | Error backgrounds |
| `info` | `#2D7DD2` | Informational states, links, secondary actions |
| `info-light` | `#E8F1FA` | Info backgrounds |

#### Neutral Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-900` | `#1A1A2E` | Primary text (same as brand-primary) |
| `neutral-700` | `#4A4A5A` | Secondary text, labels |
| `neutral-500` | `#8E8E9A` | Placeholder text, disabled states, subtle icons |
| `neutral-300` | `#D1D1D8` | Borders, dividers |
| `neutral-200` | `#E8E8EC` | Subtle borders, input backgrounds |
| `neutral-100` | `#F4F4F6` | Card backgrounds (cool), badge backgrounds |
| `neutral-50` | `#F8F7F4` | Page background (warm offwhite) |

#### Mechanic Rating Colors
| Stars | Color | Hex |
|-------|-------|-----|
| 4.5 - 5.0 | Emerald | `#1B9E6D` |
| 4.0 - 4.4 | Teal | `#2D9CDB` |
| 3.5 - 3.9 | Amber | `#E5A218` |
| Below 3.5 | Red (flagged for review) | `#D93025` |

### Typography

#### Font Family
- **Primary:** `SF Pro Display` (iOS) / `Google Sans` or `Inter` (Android)
- **Monospace (prices, stats):** `SF Mono` (iOS) / `JetBrains Mono` (Android)
- **Fallback:** System default sans-serif

#### Type Scale
| Style Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------------|------|--------|-------------|----------------|-------|
| `display-lg` | 32px | 700 (Bold) | 38px | -0.5px | Hero headings, splash numbers |
| `display-md` | 26px | 700 | 32px | -0.3px | Section headers |
| `heading-lg` | 22px | 600 (Semibold) | 28px | -0.2px | Screen titles |
| `heading-md` | 18px | 600 | 24px | 0px | Card titles, subsection heads |
| `heading-sm` | 16px | 600 | 22px | 0px | List item titles, bold labels |
| `body-lg` | 16px | 400 (Regular) | 24px | 0px | Primary body text |
| `body-md` | 14px | 400 | 20px | 0.1px | Secondary text, descriptions |
| `body-sm` | 12px | 400 | 18px | 0.2px | Captions, timestamps, meta text |
| `label-lg` | 14px | 600 | 18px | 0.5px | Button text, tab labels |
| `label-md` | 12px | 600 | 16px | 0.5px | Badges, tags, small labels |
| `label-sm` | 10px | 600 | 14px | 0.8px | Micro labels (status pills) |
| `mono-lg` | 22px | 600 | 28px | 0px | Prices, stats, large numbers |
| `mono-md` | 16px | 500 | 22px | 0px | Inline prices, metrics |

### Spacing System (8px base grid)
| Token | Value | Usage |
|-------|-------|-------|
| `space-xs` | 4px | Tight gaps (icon + label inside button) |
| `space-sm` | 8px | Small gaps between related elements |
| `space-md` | 12px | Default gap between components |
| `space-lg` | 16px | Section padding, card internal padding |
| `space-xl` | 24px | Between major sections |
| `space-2xl` | 32px | Screen top/bottom padding, major section breaks |
| `space-3xl` | 48px | Hero section padding |

### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Small buttons, input fields, tags |
| `radius-md` | 10px | Cards, modals, medium containers |
| `radius-lg` | 16px | Large cards, bottom sheets, images |
| `radius-xl` | 24px | Profile avatars (square with rounded corners), hero images |
| `radius-full` | 999px | Circular avatars, pill badges, FABs |

### Shadows
| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 3px rgba(26,26,46,0.06)` | Subtle lift (inputs on focus, small cards) |
| `shadow-md` | `0 4px 12px rgba(26,26,46,0.08)` | Cards, floating elements |
| `shadow-lg` | `0 8px 24px rgba(26,26,46,0.12)` | Modals, bottom sheets, elevated CTAs |
| `shadow-xl` | `0 16px 48px rgba(26,26,46,0.16)` | Full-screen overlays, mechanic tracking card |

### Iconography
- Use **Phosphor Icons** (phosphoricons.com) throughout
- Icon weight: `regular` for navigation, `bold` for active/selected states, `fill` for emphasized actions
- Default icon size: 24px (navigation), 20px (inline), 16px (small/badges)
- Icon color follows text color of context (primary text = neutral-900 icons, secondary = neutral-500)

### Component Library Specifications

#### Button Variants
| Variant | Background | Text | Border | Height | Radius | Usage |
|---------|-----------|------|--------|--------|--------|-------|
| `primary` | `brand-accent` (#E85D24) | `#FFFFFF` | none | 52px | `radius-md` (10px) | Primary CTAs: "Book Now", "Confirm", "Pay" |
| `primary-disabled` | `#F0997B` (40% opacity) | `#FFFFFF` (60% opacity) | none | 52px | 10px | Disabled primary buttons |
| `secondary` | `transparent` | `brand-accent` | 1.5px `brand-accent` | 48px | 10px | Secondary actions: "View Details", "Share" |
| `tertiary` | `transparent` | `neutral-700` | 1px `neutral-300` | 44px | 10px | Tertiary actions: "Cancel", "Skip" |
| `ghost` | `transparent` | `brand-accent` | none | 44px | 10px | Inline actions: "See All", "Edit" |
| `danger` | `error` (#D93025) | `#FFFFFF` | none | 48px | 10px | Destructive actions: "Delete", "Cancel Booking" |
| `pill` | `neutral-100` | `neutral-700` | none | 36px | `radius-full` | Filter pills, tags |
| `pill-active` | `brand-accent-light` | `brand-accent` | 1px `brand-accent` | 36px | `radius-full` | Active filter pills |

All buttons: padding horizontal 24px, font `label-lg` (14px/600), press state scales to 0.97 with 100ms spring animation. Haptic feedback (light impact) on press for iOS.

#### Input Fields
| State | Background | Border | Label | Text |
|-------|-----------|--------|-------|------|
| Default | `#FFFFFF` | 1px `neutral-300` | `neutral-500` (floats above on focus/filled) | `neutral-900` |
| Focused | `#FFFFFF` | 2px `brand-accent` | `brand-accent` (floated) | `neutral-900` |
| Error | `#FFFFFF` | 2px `error` | `error` | `neutral-900` |
| Disabled | `neutral-100` | 1px `neutral-200` | `neutral-500` | `neutral-500` |

Height: 52px. Border radius: `radius-sm` (6px). Padding: 16px horizontal. Label uses animated float pattern (starts as placeholder, animates to top-left on focus). Error messages appear below in `body-sm` style, color `error`, with 4px top margin.

#### Cards
| Variant | Background | Border | Shadow | Radius | Padding |
|---------|-----------|--------|--------|--------|---------|
| `elevated` | `#FFFFFF` | none | `shadow-md` | `radius-lg` (16px) | 16px | 
| `outlined` | `#FFFFFF` | 1px `neutral-200` | none | `radius-md` (10px) | 16px |
| `flat` | `neutral-100` | none | none | `radius-md` | 12px |
| `accent` | `brand-accent-light` | 1px `brand-accent` at 20% opacity | none | `radius-md` | 16px |

#### Bottom Sheet
- Background: `#FFFFFF`
- Top handle: 36px wide × 4px tall, `neutral-300`, centered, 8px from top
- Border radius: 24px top-left and top-right, 0 bottom
- Shadow: `shadow-xl`
- Backdrop: `rgba(26,26,46,0.5)` with blur(8px)
- Snap points: Define per use case (e.g., 30% for mini, 60% for medium, 90% for full)
- Drag gesture to dismiss, with haptic at snap points

#### Avatar
| Size | Dimensions | Radius | Font (initials fallback) | Border |
|------|-----------|--------|--------------------------|--------|
| `xs` | 28px | `radius-full` | 10px/700 | none |
| `sm` | 36px | `radius-full` | 12px/700 | none |
| `md` | 48px | `radius-full` | 16px/700 | none |
| `lg` | 64px | `radius-full` | 20px/700 | none |
| `xl` | 96px | `radius-xl` (24px) | 28px/700 | 3px white border + shadow-sm |

Initials fallback: Generate from first+last name initials. Background color cycles through a fixed set based on hash of user ID: [`#E85D24`, `#2D7DD2`, `#1B9E6D`, `#9B59B6`, `#E5A218`, `#D93025`]. Text color always white.

#### Status Pills / Badges
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| Available | `success-light` | `success` | none |
| En Route | `info-light` | `info` | none |
| In Progress | `warning-light` | `warning` | none |
| Completed | `neutral-100` | `neutral-700` | none |
| Cancelled | `error-light` | `error` | none |
| Founding Mechanic | `brand-accent-light` | `brand-accent` | 1px `brand-accent` |
| VELO Pro | `#1A1A2E` | `#FFFFFF` | none |
| Verified | `success-light` | `success` | none |

Height: 24px. Padding: 6px 10px. Font: `label-md`. Border radius: `radius-full`.

#### Star Rating Display
- Use filled stars (`Star` icon, weight `fill`) for earned, outlined for unearned
- Star color: `#E5A218` (amber/gold)
- Star size: 16px (inline), 20px (card display), 28px (profile hero)
- Show numeric rating next to stars: e.g., "4.8" in `mono-md` style
- Show review count in parentheses: "(47 reviews)" in `body-sm`, `neutral-500`

#### Tab Bar (Bottom Navigation)
- Background: `#FFFFFF`
- Top border: 1px `neutral-200`
- Height: 80px (includes safe area on iPhone)
- Active icon: `brand-accent`, weight `fill`, 24px
- Inactive icon: `neutral-500`, weight `regular`, 24px
- Label: 10px/600, 4px below icon
- Active label: `brand-accent`
- Inactive label: `neutral-500`
- Active indicator: 4px dot below label, `brand-accent`, `radius-full`, fade in 200ms

---

## 4. DATA MODELS & SCHEMA

### Core Entities

#### User (shared base for riders and mechanics)
```
users
├── id: UUID (primary key, generated)
├── email: VARCHAR(255) UNIQUE NOT NULL
├── phone: VARCHAR(20) UNIQUE
├── password_hash: VARCHAR(255) NOT NULL
├── first_name: VARCHAR(100) NOT NULL
├── last_name: VARCHAR(100) NOT NULL
├── display_name: VARCHAR(100) (auto-generated: first_name + last initial)
├── avatar_url: VARCHAR(500)
├── role: ENUM('rider', 'mechanic', 'admin') NOT NULL
├── is_verified: BOOLEAN DEFAULT false
├── is_pro: BOOLEAN DEFAULT false
├── pro_expires_at: TIMESTAMP
├── stripe_customer_id: VARCHAR(100)
├── default_payment_method_id: VARCHAR(100)
├── referral_code: VARCHAR(20) UNIQUE (auto-generated, 6 alphanumeric chars)
├── referred_by: UUID REFERENCES users(id)
├── push_token: VARCHAR(500)
├── last_location_lat: DECIMAL(10,8)
├── last_location_lng: DECIMAL(11,8)
├── last_location_updated_at: TIMESTAMP
├── created_at: TIMESTAMP DEFAULT NOW()
├── updated_at: TIMESTAMP DEFAULT NOW()
├── deleted_at: TIMESTAMP (soft delete)
└── INDEXES: email, phone, role, referral_code, geospatial(last_location_lat, last_location_lng)
```

#### Rider Profile (extends User where role = 'rider')
```
rider_profiles
├── id: UUID (primary key)
├── user_id: UUID REFERENCES users(id) UNIQUE
├── home_address: JSONB {street, apt, city, state, zip, lat, lng}
├── work_address: JSONB (optional, same structure)
├── preferred_service_location: ENUM('home', 'work', 'other')
├── strava_access_token: VARCHAR(255) (encrypted)
├── strava_refresh_token: VARCHAR(255) (encrypted)
├── strava_athlete_id: VARCHAR(50)
├── garmin_access_token: VARCHAR(255) (encrypted)
├── total_rides_logged: INTEGER DEFAULT 0
├── total_miles_logged: DECIMAL(10,1) DEFAULT 0
├── member_since_display: DATE (the date they joined — for "Member since" display)
├── founding_member: BOOLEAN DEFAULT false
├── founding_member_number: INTEGER (sequential, only for founding members)
├── notification_preferences: JSONB {
│   booking_updates: true,
│   community_activity: true,
│   maintenance_alerts: true,
│   promotions: true,
│   ride_reminders: true
│ }
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

#### Mechanic Profile (extends User where role = 'mechanic')
```
mechanic_profiles
├── id: UUID (primary key)
├── user_id: UUID REFERENCES users(id) UNIQUE
├── bio: TEXT (max 500 chars)
├── headline: VARCHAR(150) ("E-bike specialist with 8 years experience")
├── specialties: VARCHAR[] (array of: 'road', 'mountain', 'commuter', 'e-bike', 'cargo', 'track', 'bmx', 'gravel', 'folding', 'general')
├── years_experience: INTEGER
├── certifications: JSONB[] (array of {name, issuer, year, verified: boolean})
├── is_mobile: BOOLEAN DEFAULT true
├── service_radius_km: DECIMAL(4,1) DEFAULT 8.0
├── base_location_lat: DECIMAL(10,8)
├── base_location_lng: DECIMAL(11,8)
├── base_location_address: VARCHAR(255)
├── is_founding_mechanic: BOOLEAN DEFAULT false
├── founding_mechanic_number: INTEGER
├── guarantee_active: BOOLEAN DEFAULT false
├── guarantee_start_date: DATE
├── guarantee_end_date: DATE
├── stripe_connect_account_id: VARCHAR(100)
├── stripe_connect_onboarded: BOOLEAN DEFAULT false
├── rating_average: DECIMAL(2,1) DEFAULT 0.0
├── rating_count: INTEGER DEFAULT 0
├── total_jobs_completed: INTEGER DEFAULT 0
├── completion_rate: DECIMAL(4,1) DEFAULT 100.0 (% of accepted jobs completed)
├── response_time_avg_minutes: INTEGER DEFAULT 0
├── is_available: BOOLEAN DEFAULT false (real-time toggle)
├── availability_schedule: JSONB {
│   monday: [{start: "09:00", end: "17:00"}],
│   tuesday: [{start: "09:00", end: "17:00"}],
│   ... (each day can have multiple time blocks or be empty)
│ }
├── insurance_status: ENUM('none', 'partial', 'full', 'velo_covered')
├── insurance_expiry: DATE
├── background_check_status: ENUM('pending', 'passed', 'failed', 'expired')
├── background_check_date: DATE
├── tools_verified: BOOLEAN DEFAULT false
├── status: ENUM('pending_review', 'active', 'suspended', 'deactivated') DEFAULT 'pending_review'
├── suspension_reason: TEXT
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
└── INDEXES: geospatial(base_location), rating_average, status, is_available, specialties (GIN)
```

#### Bike (Digital Bike Passport)
```
bikes
├── id: UUID (primary key)
├── owner_id: UUID REFERENCES users(id)
├── nickname: VARCHAR(100) ("The Commuter", "Weekend Beast")
├── make: VARCHAR(100) (e.g., "Trek", "Specialized", "Canyon")
├── model: VARCHAR(100) (e.g., "Domane SL 6", "Diverge Comp")
├── year: INTEGER
├── type: ENUM('road', 'mountain', 'hybrid', 'commuter', 'e-bike', 'cargo', 'gravel', 'track', 'bmx', 'folding', 'other')
├── frame_material: ENUM('carbon', 'aluminum', 'steel', 'titanium', 'other')
├── color: VARCHAR(50)
├── serial_number: VARCHAR(100) (encrypted at rest)
├── purchase_date: DATE
├── purchase_price: DECIMAL(10,2)
├── estimated_value: DECIMAL(10,2) (calculated based on age, condition, service history)
├── photo_urls: VARCHAR[] (array of S3 URLs, max 6 photos)
├── is_ebike: BOOLEAN DEFAULT false
├── ebike_motor_type: VARCHAR(100)
├── ebike_battery_capacity_wh: INTEGER
├── total_miles: DECIMAL(10,1) DEFAULT 0 (synced from Strava/Garmin or manual)
├── miles_since_last_service: DECIMAL(10,1) DEFAULT 0
├── last_service_date: DATE
├── next_service_due_date: DATE (calculated by predictive maintenance)
├── next_service_due_miles: DECIMAL(10,1)
├── components: JSONB {
│   chain: {brand, model, installed_date, installed_miles, expected_life_miles},
│   tires_front: {brand, model, installed_date, installed_miles, expected_life_miles},
│   tires_rear: {brand, model, installed_date, installed_miles, expected_life_miles},
│   brake_pads_front: {...},
│   brake_pads_rear: {...},
│   cassette: {...},
│   cables: {...},
│   bar_tape: {...},
│   battery: {brand, capacity_wh, health_percentage, last_checked} (e-bikes only)
│ }
├── is_stolen: BOOLEAN DEFAULT false
├── stolen_reported_at: TIMESTAMP
├── is_for_sale: BOOLEAN DEFAULT false
├── sale_price: DECIMAL(10,2)
├── sale_description: TEXT
├── insurance_policy_id: VARCHAR(100)
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
└── INDEXES: owner_id, type, is_for_sale, serial_number, is_stolen
```

#### Service Type (predefined catalog)
```
service_types
├── id: UUID
├── name: VARCHAR(100) ("Basic Tune-Up", "Flat Tire Fix", "Brake Adjustment", etc.)
├── slug: VARCHAR(100) UNIQUE
├── description: TEXT
├── short_description: VARCHAR(200) (shown on card)
├── icon_name: VARCHAR(50) (Phosphor icon name, e.g., "wrench", "tire", "gear")
├── category: ENUM('maintenance', 'repair', 'installation', 'inspection', 'specialty', 'e-bike')
├── base_price_min: DECIMAL(8,2)
├── base_price_max: DECIMAL(8,2)
├── estimated_duration_minutes: INTEGER
├── requires_parts: BOOLEAN
├── common_parts: JSONB[] (suggested parts for this service)
├── skill_level_required: ENUM('basic', 'intermediate', 'advanced', 'specialist')
├── is_mobile_eligible: BOOLEAN DEFAULT true
├── is_active: BOOLEAN DEFAULT true
├── sort_order: INTEGER
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

Seed the following service types at launch:
1. Basic Tune-Up — $80-120 — 45 min — The essential: adjust brakes, derailleurs, check tire pressure, lube chain, safety check
2. Full Overhaul — $200-350 — 2-3 hrs — Complete disassembly, clean, inspect, replace worn parts, reassemble, test ride
3. Flat Tire Fix — $25-45 — 20 min — Tube replacement or patch, tire inspection
4. Brake Adjustment — $30-60 — 20 min — Adjust brake cable tension, pad alignment, check pad wear
5. Derailleur Adjustment — $35-65 — 25 min — Fine-tune shifting, cable tension, limit screws
6. Chain Replacement — $30-50 + parts — 20 min — Remove old chain, install new, check cassette wear
7. Wheel Truing — $25-50 — 30 min — Spoke tension adjustment, lateral and radial truing
8. Cable Replacement — $40-70 — 30 min — Replace brake and/or shift cables and housing
9. Bottom Bracket Service — $50-90 — 45 min — Remove, clean/replace, reinstall, check bearings
10. Headset Service — $40-75 — 30 min — Disassemble, clean, regrease, reassemble, adjust
11. Bike Fitting (Basic) — $100-200 — 60 min — Saddle height, reach, handlebar position
12. Bike Fitting (Professional) — $200-400 — 90+ min — Full body measurement, cleat position, video analysis
13. E-Bike Battery Check — $50-80 — 30 min — Diagnostic scan, capacity test, connector inspection
14. E-Bike Motor Service — $80-150 — 45 min — Diagnostic, firmware update, sensor check
15. Safety Inspection — $40-60 — 30 min — Full bike safety check, report card issued
16. New Bike Assembly — $75-150 — 60 min — Assemble bike from box, tune, test ride
17. Custom Build — Quote — Variable — Custom spec'd build from frame up
18. Emergency Roadside — $50 + service — ASAP — Mechanic dispatched for on-road breakdown

#### Booking
```
bookings
├── id: UUID (primary key)
├── booking_number: VARCHAR(20) UNIQUE (human-readable: "VELO-2026-00001")
├── rider_id: UUID REFERENCES users(id)
├── mechanic_id: UUID REFERENCES users(id) (null until matched)
├── bike_id: UUID REFERENCES bikes(id)
├── service_type_id: UUID REFERENCES service_types(id)
├── additional_services: UUID[] (array of additional service_type_ids)
├── description: TEXT (rider's description of the problem, optional)
├── photos: VARCHAR[] (photos of the issue, S3 URLs)
├── booking_type: ENUM('on_demand', 'scheduled')
├── scheduled_date: DATE (for scheduled bookings)
├── scheduled_time_start: TIME
├── scheduled_time_end: TIME
├── service_location: JSONB {
│   type: 'home' | 'work' | 'custom',
│   address: string,
│   apt_unit: string,
│   lat: decimal,
│   lng: decimal,
│   access_notes: string ("Ring buzzer 4B", "Meet in lobby", etc.)
│ }
├── status: ENUM(
│   'pending_match',      — Submitted, looking for mechanic
│   'matched',            — Mechanic assigned, not yet confirmed
│   'confirmed',          — Mechanic confirmed, waiting for service day
│   'mechanic_en_route',  — Mechanic is traveling to location
│   'in_progress',        — Mechanic arrived, work started
│   'completed',          — Service done, pending payment
│   'paid',               — Payment processed
│   'cancelled_by_rider', — Rider cancelled
│   'cancelled_by_mechanic', — Mechanic cancelled (triggers rematch)
│   'no_show_rider',      — Rider not present
│   'no_show_mechanic',   — Mechanic didn't arrive
│   'disputed'            — Payment or service disputed
│ )
├── quoted_price: DECIMAL(8,2) (upfront price shown to rider)
├── mobile_visit_fee: DECIMAL(8,2) DEFAULT 20.00
├── parts_cost: DECIMAL(8,2) DEFAULT 0
├── final_price: DECIMAL(8,2) (may differ if additional work needed — requires rider approval)
├── velo_commission_rate: DECIMAL(4,2) (e.g., 0.18 for 18%)
├── velo_commission_amount: DECIMAL(8,2) (calculated)
├── mechanic_payout_amount: DECIMAL(8,2) (calculated)
├── tip_amount: DECIMAL(8,2) DEFAULT 0
├── stripe_payment_intent_id: VARCHAR(100)
├── stripe_transfer_id: VARCHAR(100)
├── estimated_duration_minutes: INTEGER
├── actual_duration_minutes: INTEGER
├── mechanic_eta_minutes: INTEGER (live, updated by GPS)
├── mechanic_arrived_at: TIMESTAMP
├── service_started_at: TIMESTAMP
├── service_completed_at: TIMESTAMP
├── completion_notes: TEXT (mechanic's notes about what was done)
├── completion_photos: VARCHAR[] (before/after photos)
├── parts_used: JSONB[] ({name, brand, quantity, cost})
├── rider_rating: DECIMAL(2,1)
├── rider_review: TEXT
├── rider_review_at: TIMESTAMP
├── mechanic_rating: DECIMAL(2,1)
├── mechanic_review: TEXT
├── mechanic_review_at: TIMESTAMP
├── cancelled_at: TIMESTAMP
├── cancellation_reason: TEXT
├── cancelled_by: ENUM('rider', 'mechanic', 'system')
├── cancellation_fee: DECIMAL(8,2) DEFAULT 0
├── created_at: TIMESTAMP
├── updated_at: TIMESTAMP
└── INDEXES: rider_id, mechanic_id, status, booking_type, scheduled_date, created_at, bike_id
```

#### Ride Group / Club
```
ride_groups
├── id: UUID
├── name: VARCHAR(100)
├── slug: VARCHAR(100) UNIQUE
├── description: TEXT (max 1000 chars)
├── cover_photo_url: VARCHAR(500)
├── avatar_url: VARCHAR(500)
├── type: ENUM('club', 'casual_group', 'shop_group', 'event_series')
├── visibility: ENUM('public', 'private', 'unlisted')
├── ride_style: VARCHAR[] ('road', 'gravel', 'mountain', 'casual', 'commute', 'e-bike')
├── pace: ENUM('chill', 'moderate', 'fast', 'hammerfest', 'mixed')
├── neighborhood: VARCHAR(100) ("Williamsburg", "Park Slope")
├── borough: VARCHAR(50) ("Brooklyn", "Manhattan", "Queens")
├── meeting_point: JSONB {address, lat, lng, description}
├── recurring_schedule: JSONB {
│   day: 'tuesday',
│   time: '18:30',
│   frequency: 'weekly',
│   route_description: 'Prospect Park loops, 20mi'
│ }
├── member_count: INTEGER DEFAULT 0
├── created_by: UUID REFERENCES users(id)
├── is_verified: BOOLEAN DEFAULT false
├── is_featured: BOOLEAN DEFAULT false
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

#### Ride Group Membership
```
ride_group_members
├── id: UUID
├── group_id: UUID REFERENCES ride_groups(id)
├── user_id: UUID REFERENCES users(id)
├── role: ENUM('member', 'ride_leader', 'admin', 'owner')
├── joined_at: TIMESTAMP
├── UNIQUE(group_id, user_id)
```

#### Scheduled Ride (individual ride event)
```
rides
├── id: UUID
├── group_id: UUID REFERENCES ride_groups(id) (null for individual rides)
├── created_by: UUID REFERENCES users(id)
├── title: VARCHAR(200) ("Tuesday Night Park Slope Hammerfest")
├── description: TEXT
├── ride_date: DATE
├── start_time: TIME
├── estimated_duration_minutes: INTEGER
├── distance_estimate_miles: DECIMAL(5,1)
├── pace: ENUM('chill', 'moderate', 'fast', 'hammerfest')
├── terrain: VARCHAR[] ('road', 'gravel', 'mixed', 'hills', 'flat')
├── difficulty: ENUM('beginner', 'intermediate', 'advanced', 'expert')
├── meeting_point: JSONB {address, lat, lng, description}
├── route_gpx_url: VARCHAR(500) (optional GPX file)
├── max_riders: INTEGER (null = unlimited)
├── rsvp_count: INTEGER DEFAULT 0
├── requires_helmet: BOOLEAN DEFAULT true
├── requires_lights: BOOLEAN DEFAULT false
├── weather_policy: VARCHAR(200) ("Rain cancels", "We ride rain or shine")
├── status: ENUM('upcoming', 'in_progress', 'completed', 'cancelled')
├── cancelled_reason: TEXT
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

#### Ride RSVP
```
ride_rsvps
├── id: UUID
├── ride_id: UUID REFERENCES rides(id)
├── user_id: UUID REFERENCES users(id)
├── status: ENUM('going', 'maybe', 'not_going')
├── created_at: TIMESTAMP
├── UNIQUE(ride_id, user_id)
```

#### Community Post (Social Feed)
```
posts
├── id: UUID
├── author_id: UUID REFERENCES users(id)
├── group_id: UUID REFERENCES ride_groups(id) (null for public feed)
├── type: ENUM('text', 'ride_recap', 'photo', 'question', 'gear_review', 'route_share', 'service_review')
├── content: TEXT (max 2000 chars)
├── photos: VARCHAR[] (max 4 photos)
├── linked_ride_id: UUID REFERENCES rides(id)
├── linked_booking_id: UUID REFERENCES bookings(id) (for service reviews)
├── linked_bike_id: UUID REFERENCES bikes(id)
├── like_count: INTEGER DEFAULT 0
├── comment_count: INTEGER DEFAULT 0
├── is_pinned: BOOLEAN DEFAULT false
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
└── INDEXES: author_id, group_id, created_at DESC, type
```

#### Post Like
```
post_likes
├── post_id: UUID REFERENCES posts(id)
├── user_id: UUID REFERENCES users(id)
├── created_at: TIMESTAMP
├── PRIMARY KEY(post_id, user_id)
```

#### Post Comment
```
post_comments
├── id: UUID
├── post_id: UUID REFERENCES posts(id)
├── author_id: UUID REFERENCES users(id)
├── parent_comment_id: UUID REFERENCES post_comments(id) (for threaded replies)
├── content: TEXT (max 500 chars)
├── like_count: INTEGER DEFAULT 0
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP
```

#### Gear Listing (P2P Marketplace)
```
gear_listings
├── id: UUID
├── seller_id: UUID REFERENCES users(id)
├── title: VARCHAR(200)
├── description: TEXT (max 2000 chars)
├── category: ENUM('complete_bike', 'frameset', 'wheels', 'components', 'accessories', 'apparel', 'electronics', 'tools', 'other')
├── condition: ENUM('new', 'like_new', 'good', 'fair', 'for_parts')
├── brand: VARCHAR(100)
├── model: VARCHAR(100)
├── price: DECIMAL(10,2)
├── is_negotiable: BOOLEAN DEFAULT false
├── photos: VARCHAR[] (max 8 photos, first is hero)
├── location_borough: VARCHAR(50)
├── location_neighborhood: VARCHAR(100)
├── shipping_available: BOOLEAN DEFAULT false
├── local_pickup_only: BOOLEAN DEFAULT true
├── linked_bike_id: UUID REFERENCES bikes(id) (if selling a bike on VELO, links to its passport)
├── status: ENUM('active', 'pending_sale', 'sold', 'expired', 'removed')
├── view_count: INTEGER DEFAULT 0
├── save_count: INTEGER DEFAULT 0
├── created_at: TIMESTAMP
├── updated_at: TIMESTAMP
└── expires_at: TIMESTAMP (auto-expire after 60 days)
└── INDEXES: seller_id, category, status, price, created_at DESC, location_borough
```

#### Conversation / Chat
```
conversations
├── id: UUID
├── booking_id: UUID REFERENCES bookings(id) (for booking-related chat)
├── gear_listing_id: UUID REFERENCES gear_listings(id) (for gear inquiries)
├── type: ENUM('booking', 'gear_inquiry', 'direct')
├── created_at: TIMESTAMP
└── updated_at: TIMESTAMP

conversation_participants
├── conversation_id: UUID REFERENCES conversations(id)
├── user_id: UUID REFERENCES users(id)
├── last_read_at: TIMESTAMP
├── PRIMARY KEY(conversation_id, user_id)

messages
├── id: UUID
├── conversation_id: UUID REFERENCES conversations(id)
├── sender_id: UUID REFERENCES users(id)
├── content: TEXT
├── type: ENUM('text', 'image', 'system', 'location', 'booking_update')
├── image_url: VARCHAR(500)
├── metadata: JSONB (for system messages: {event: 'mechanic_en_route', booking_id: '...'})
├── is_read: BOOLEAN DEFAULT false
├── created_at: TIMESTAMP
└── INDEXES: conversation_id + created_at DESC
```

---

## 5. AUTHENTICATION & ONBOARDING FLOWS

### Rider Onboarding (6 screens max — under 90 seconds)

**Screen 1: Welcome / Splash**
- Full-screen hero image: a cyclist on a Brooklyn bridge at golden hour (use curated stock or commission original)
- VELO logo (centered, white, 48px mark + wordmark)
- Tagline below: "Your cycling home." — `body-lg`, white, 60% opacity
- Two buttons at bottom:
  - "Get Started" — `primary` button, full width
  - "I already have an account" — `ghost` button, white text
- No skip. No carousel. No onboarding slides. Get them in fast.

**Screen 2: Sign Up**
- Title: "Create your account" — `heading-lg`
- Social auth buttons (top, fastest path):
  - "Continue with Apple" — black button, Apple icon, full width
  - "Continue with Google" — white outlined button, Google icon, full width
- Divider: "or sign up with email"
- Form fields:
  - First name (text input)
  - Last name (text input)
  - Email (email input, validate format)
  - Password (password input, min 8 chars, show/hide toggle)
- "Create Account" — `primary` button, full width
- Footer: "By creating an account, you agree to our Terms and Privacy Policy" — `body-sm`, `neutral-500`, linked text in `brand-accent`

**Screen 3: Verify Email (or Phone)**
- Title: "Check your email" — `heading-lg`
- Subtitle: "We sent a 6-digit code to {email}" — `body-md`, `neutral-700`
- 6-digit code input (6 separate boxes, auto-advance, auto-submit on 6th digit)
- "Didn't get it? Resend" — `ghost` button, appears after 30 second countdown
- Auto-advance to next screen on valid code

**Screen 4: Add Your First Bike (optional but encouraged)**
- Title: "Add your bike" — `heading-lg`
- Subtitle: "This helps mechanics prepare the right parts" — `body-md`, `neutral-700`
- Form:
  - Bike type selector (horizontal scroll of pill buttons): Road, Mountain, Hybrid, Commuter, E-Bike, Gravel, Other
  - Make (text input with autocomplete: Trek, Specialized, Giant, Canyon, Cannondale, etc.)
  - Model (text input)
  - Year (number input, current year pre-filled)
  - Photo (optional, camera/gallery picker, single photo for now)
- "Add Bike" — `primary` button
- "Skip for now" — `ghost` button at bottom (always visible, no guilt)

**Screen 5: Set Your Location**
- Title: "Where should mechanics come?" — `heading-lg`
- Map view (half screen, centered on user's current location)
- Address input with Google Places autocomplete
- "Apt / Unit" input (appears after address selected)
- "Use current location" — button with location pin icon
- Save button — `primary`
- This becomes their default service location (can be changed per booking)

**Screen 6: You're In**
- Confetti animation (subtle, 1.5 seconds, small particles in brand colors)
- Large checkmark icon, `brand-accent`, animated (scale from 0 to 1, spring)
- "You're all set!" — `display-md`
- "Book your first mechanic or explore what's happening in your neighborhood" — `body-md`
- Two CTAs:
  - "Book a Mechanic" — `primary` button, full width
  - "Explore Community" — `secondary` button, full width
- These go directly to the relevant tab

### Mechanic Onboarding (separate app, more involved — 10 screens)

**Screen 1: Welcome**
- Title: "Earn on your terms" — `display-md`
- Subtitle: "VELO connects you with cyclists who need your skills. Set your own hours, keep 85% of every job." — `body-lg`
- "Apply to Join" — `primary` button
- "Already a VELO Mechanic? Sign In" — `ghost` button

**Screen 2: Basic Info**
- First name, last name, email, phone, password
- Same validation as rider signup

**Screen 3: Experience & Specialties**
- "How many years of bike mechanic experience do you have?" — Number stepper (1-30+)
- "What types of bikes do you specialize in?" — Multi-select pills (Road, Mountain, E-Bike, Commuter, Cargo, Track, BMX, Gravel, General)
- "Do you have any certifications?" — Optional, add multiple: certification name, issuing org, year

**Screen 4: Service Area**
- Map view with draggable radius circle
- "Where are you based?" — Address input with autocomplete
- "How far will you travel?" — Slider, 2km to 15km, default 8km
- Visual: shaded circle on map updates as slider moves

**Screen 5: Availability**
- Weekly calendar grid
- For each day: toggle on/off, set start time and end time
- Can add multiple blocks per day (e.g., 8am-12pm and 2pm-6pm)
- Default: Mon-Fri 9am-5pm pre-filled

**Screen 6: Profile Photo & Bio**
- Upload profile photo (required, camera or gallery)
- Photo guidelines: "Show your face clearly. Smile. Cyclists want to know who's coming to their home."
- Bio text input (max 500 chars): "Tell riders about yourself and why you love bikes"
- Headline (max 150 chars): "This appears on your card. E.g., 'E-bike specialist, 8 years experience'"

**Screen 7: Mobile Setup**
- "Do you have your own tools?" — Yes/No (Yes required to proceed)
- "Do you have reliable transportation to reach riders?" — Yes/No
- "Can you carry a basic parts inventory (tubes, cables, brake pads)?" — Yes/No
- All must be Yes to proceed. If No, show info about VELO's tool kit program (future feature)

**Screen 8: Background Check Consent**
- Explanation of background check process
- "VELO requires a background check for all mechanics. This protects you and the riders you serve."
- Consent checkbox
- Link to privacy policy regarding background data
- "Continue" — proceeds with Checkr (or similar) integration

**Screen 9: Bank Account (Stripe Connect Onboarding)**
- "Set up your payouts"
- Redirect to Stripe Connect Express onboarding flow
- On return: confirm bank account connected

**Screen 10: Application Submitted**
- "We're reviewing your application" — `display-md`
- "This usually takes 24-48 hours. We'll notify you when you're approved."
- Timeline of next steps:
  1. Application review ← You are here
  2. Background check complete
  3. Welcome call with VELO team
  4. Go live and start earning
- "While you wait, explore the VELO community" — link to community feed

---

## 6. SCREEN-BY-SCREEN SPECIFICATIONS — RIDER APP

### Tab Bar Structure (Bottom Navigation)
5 tabs:
1. **Home** (icon: `House`) — Dashboard, quick actions, nearby activity
2. **Book** (icon: `Wrench`) — Service booking flow, active bookings
3. **Community** (icon: `UsersThree`) — Feed, groups, rides, events
4. **Garage** (icon: `Bicycle`) — My bikes (digital passport), service history
5. **Profile** (icon: `UserCircle`) — Settings, VELO Pro, payment methods, referrals

### Tab 1: Home Screen

**Layout (top to bottom):**

1. **Header bar** (sticky)
   - Left: "Good morning, {first_name}" — `heading-sm`, `neutral-900`
   - Right: notification bell icon (badge count if unread), avatar (sm, tappable → profile)

2. **Location bar**
   - Pin icon + "Williamsburg, Brooklyn" — `body-md`, `neutral-700`
   - Tappable to change location
   - Chevron right icon

3. **Hero card: Quick Book** (elevated card, full width)
   - Title: "Need a mechanic?" — `heading-md`
   - Subtitle: "Get a certified mobile mechanic in ~2 hours" — `body-md`, `neutral-700`
   - "Book Now" — `primary` button, full width inside card
   - Background: subtle gradient or illustration of a wrench icon, brand-accent at 5% opacity

4. **Active booking banner** (only shows if user has an active booking)
   - Accent card variant
   - Left: status icon (animated pulse for en-route)
   - "Your mechanic is en route — 12 min away" — `heading-sm`
   - "Tap to track" — `body-sm`, `brand-accent`
   - Tapping opens booking detail/tracking screen

5. **Upcoming rides section**
   - Section header: "Upcoming rides near you" — `heading-sm` + "See all" ghost link
   - Horizontal scroll of ride cards:
     - Each card: 280px wide, `elevated` card
     - Ride name, date/time, group name, pace badge, RSVP count
     - "RSVP" pill button

6. **Nearby mechanics section**
   - Section header: "Top mechanics nearby" — `heading-sm` + "See all"
   - Horizontal scroll of mechanic mini-cards:
     - Avatar (md), name, rating (stars + number), specialty badges, "Book" mini button
     - "2.1 km away" — `body-sm`, `neutral-500`

7. **Recent community posts**
   - Section header: "From your community" — `heading-sm` + "See all"
   - 2-3 preview cards from the community feed (text truncated at 2 lines)

8. **Bike health alerts** (if user has bikes with predictive maintenance data)
   - Section header: "Bike health" — `heading-sm`
   - Alert cards: "Your chain has ~200 miles left. Schedule a replacement?"
   - "Book Service" CTA on each alert

### Tab 2: Book Screen

**Default state (no active booking):**

1. **Header:** "Services" — `heading-lg`

2. **Search bar** (outlined input, search icon, placeholder: "Search services...")

3. **Category filter pills** (horizontal scroll)
   - All, Maintenance, Repair, E-Bike, Inspection, Specialty
   - `pill` / `pill-active` variants

4. **Service cards grid** (2 columns on larger phones, 1 column on smaller)
   - Each card: `outlined` card
   - Icon (from service_types.icon_name, 32px, `brand-accent`)
   - Service name — `heading-sm`
   - Price range — `mono-md`, `neutral-900`
   - Duration estimate — `body-sm`, `neutral-500`
   - Tap → opens service detail → booking flow

5. **"Not sure what you need?"** card at bottom
   - `flat` card
   - "Describe your issue and we'll recommend the right service"
   - "Get Help" button → opens free-text description flow

**Booking Flow (multi-step, bottom sheet or full screen):**

Step 1: **Select Service** (already done from previous screen, or show picker)
- Selected service shown at top as confirmation
- "Add another service" option (allows stacking: tune-up + chain replacement)
- Running total updates dynamically

Step 2: **Select Bike**
- List of user's bikes (from Garage)
- Each bike: photo, nickname, make/model/year, type badge
- "Add a new bike" option at bottom
- If user has no bikes: prompt to add one (simplified: type + make + model only)

Step 3: **Describe the Issue** (optional)
- Text area: "Anything else your mechanic should know?" (placeholder)
- Photo upload (up to 3 photos): "Add photos of the issue"
- Camera and gallery options

Step 4: **Choose When**
- Toggle: "As soon as possible" (default, highlighted) / "Schedule for later"
- If ASAP: shows estimated wait time ("~2 hours based on mechanic availability")
- If Scheduled: date picker (next 14 days) + time slot picker (1-hour blocks based on mechanic availability)

Step 5: **Choose Where**
- Pre-filled with user's saved address
- Map preview showing the pin
- "Use a different address" → address input with autocomplete
- Access notes input: "How should the mechanic access? (buzzer code, meet in lobby, etc.)"

Step 6: **Review & Confirm**
- Full summary card:
  - Service(s) selected with prices
  - Bike: nickname + make/model
  - When: "ASAP (~2hr wait)" or "Sat, March 22 at 2:00 PM"
  - Where: address + access notes
  - Mobile visit fee: $20.00
  - Subtotal: $XXX.XX
  - "You'll be matched with the nearest available mechanic"
- Payment method selector (card on file, Apple Pay, Google Pay)
- Promo code input (collapsible)
- Total: bold, large, `mono-lg`
- "Confirm Booking — $XXX.XX" — `primary` button, full width
- Fine print: "Free cancellation up to 2 hours before. VELO service guarantee applies."

**Post-Booking States:**

State: **Pending Match**
- Screen shows: booking confirmation with animated searching indicator
- "Finding your mechanic..." — pulsing dot animation
- Estimated match time: "Usually under 15 minutes"
- Cancel button available (no fee)

State: **Matched**
- Mechanic card appears: photo, name, rating, specialty, "X years experience"
- "Your mechanic: {name}" — with "View Profile" link
- Chat button to message mechanic
- Booking details summary
- Cancel button available (no fee if >2hrs before)

State: **Mechanic En Route**
- Full-screen map with:
  - Mechanic's real-time GPS location (bike icon marker, updates every 5 seconds via Socket.io)
  - Rider's service location pin
  - Route line between them
  - ETA bubble on mechanic marker: "12 min"
- Bottom card (draggable bottom sheet):
  - Mechanic photo + name + rating
  - ETA: "Arriving in ~12 minutes"
  - Phone button (tap to call mechanic)
  - Chat button
  - Booking details (collapsible)
  - Cancel button (may incur fee)
- Push notification sent: "Your mechanic {name} is on the way! ETA: 12 minutes"

State: **In Progress**
- Status: "Service in progress" with animated progress indicator
- Timer showing elapsed time
- Mechanic can send live updates via chat
- If mechanic discovers additional work needed:
  - Mechanic sends a "Price Update Request" through the app
  - Rider sees: "Your mechanic found additional work needed: {description}. Additional cost: $XX. Approve?"
  - "Approve" / "Decline — complete original service only" buttons
  - This prevents surprise charges

State: **Completed — Review**
- Congratulations screen
- "Your service is complete!" — `display-md`
- Summary of work done (from mechanic's completion notes)
- Before/after photos (if mechanic took them)
- Parts used list
- Final price breakdown
- **Rating prompt:**
  - "How was your experience with {mechanic_name}?" 
  - 5-star tap selector (large, 36px stars)
  - Review text (optional): "Tell others about your experience"
  - Category ratings (optional, collapsible): Punctuality, Quality, Communication, Value
  - "Submit Review" button
- **Tip prompt** (after review):
  - "Add a tip for {name}?" 
  - Preset amounts: $5, $10, $15, Custom
  - "No tip" option (no guilt, small text)
  - "You can also tip later from your booking history"
- Service record auto-added to bike's digital passport

### Tab 3: Community Screen

**Layout:**

1. **Header:** "Community" — `heading-lg`
   - Right: compose button (pencil icon) → create new post

2. **Sub-navigation** (horizontal tabs at top, below header)
   - Feed | Groups | Rides | Events
   - Underline indicator on active tab, `brand-accent`

**Feed sub-tab:**
- Infinite scroll of community posts
- Each post card:
  - Author avatar (sm) + name + time ago ("2h ago")
  - Post type badge (if ride recap, gear review, etc.)
  - Post content (text, truncated at 3 lines with "Read more")
  - Photos (if any): single photo full-width, multiple in 2x2 grid
  - Engagement bar: like button (heart icon + count), comment button (+ count), share button
  - If service review: linked mechanic card with rating
- Pull to refresh
- Floating "+" button (FAB) for new post

**Groups sub-tab:**
- "My Groups" section (horizontal scroll of group avatars with names)
- "Discover Groups" section
  - Filter pills: Borough, Ride Style, Pace
  - Grid of group cards:
    - Cover photo (top half of card)
    - Group name, member count, pace badge, neighborhood
    - "Join" button

**Rides sub-tab:**
- Calendar strip at top (horizontally scrollable dates, current date highlighted)
- List of rides on selected date:
  - Each ride card:
    - Ride title
    - Group name (if group ride)
    - Date + time
    - Meeting point (address, tappable for map)
    - Distance + pace + terrain badges
    - RSVP count: "12 going"
    - "RSVP" button
- "Create a Ride" button at bottom

**Events sub-tab:**
- Similar to rides but for larger events (races, charity rides, bike swaps)
- Featured event banner at top
- List of upcoming events with ticket/RSVP options

### Tab 4: Garage Screen (Digital Bike Passport)

**Layout:**

1. **Header:** "My Garage" — `heading-lg`
   - Right: "+" button to add a bike

2. **Bike cards** (vertical scroll, one per bike)
   - Each card: `elevated` card, tall
   - Hero photo of bike (or placeholder illustration if no photo)
   - Nickname — `heading-md`
   - Make + Model + Year — `body-md`, `neutral-700`
   - Type badge (e.g., "Road", "E-Bike")
   - Quick stats row:
     - Total miles: "3,420 mi"
     - Services: "7 services"
     - Health score: circular progress ring (green/amber/red) with percentage
   - "View Passport" button → full bike detail screen

3. **If no bikes:** empty state
   - Illustration: line drawing of a bike
   - "Add your first bike"
   - "Track service history, get maintenance alerts, and increase resale value"
   - "Add Bike" button

**Bike Detail / Passport Screen:**
- Hero photo (full width, parallax scroll effect)
- Bike name, make/model/year, type, color
- **Health Score section:**
  - Large circular progress (animated on load)
  - Component breakdown:
    - Chain: "Good — ~800 mi remaining"
    - Tires (front): "Replace soon — ~200 mi remaining"
    - Brake pads: "Good"
    - etc.
  - Each component tappable → shows install date, miles, expected life, "Schedule Replacement" CTA
- **Service History timeline:**
  - Chronological list (most recent first)
  - Each entry: date, service type, mechanic name + avatar, price, notes
  - Before/after photos if available
  - Tappable → full service detail
- **Specs tab:**
  - Full component list (from bike.components JSONB)
  - Serial number (masked, tap to reveal)
  - Purchase info
- **Actions:**
  - "Book Service for this bike" — primary CTA
  - "Edit Bike" — pencil icon
  - "List for Sale" — gear marketplace integration
  - "Report Stolen" — danger action (generates theft report, flags in system)

### Tab 5: Profile Screen

**Layout:**
- Profile header:
  - Avatar (xl), name, member since, location
  - VELO Pro badge (if applicable)
  - Founding Member badge + number (if applicable)
  - Edit profile button (pencil icon)
- Stats row: "X bikes", "X services", "X rides", "X groups"
- Menu list:
  - VELO Pro (→ subscription management / upsell)
  - Payment Methods (→ manage cards, Apple Pay)
  - Service History (→ full list of all bookings)
  - Saved Mechanics (→ favorited mechanics)
  - Notifications Settings
  - Connected Apps (Strava, Garmin)
  - Referral Program ("Invite friends, get $15")
  - Help & Support
  - About VELO
  - Sign Out

---

## 7. SCREEN-BY-SCREEN SPECIFICATIONS — MECHANIC APP

### Tab Bar Structure
4 tabs:
1. **Jobs** (icon: `Clipboard`) — Incoming requests, active job, schedule
2. **Earnings** (icon: `CurrencyDollar`) — Weekly earnings, payout history, stats
3. **Messages** (icon: `ChatCircle`) — Conversations with riders
4. **Profile** (icon: `UserCircle`) — Availability, settings, profile management

### Tab 1: Jobs Screen

**Default state (available, no active job):**

1. **Availability toggle** (prominent, top of screen)
   - Large toggle switch: "Available" (green) / "Unavailable" (gray)
   - When available: pulsing green dot, "You're online. Requests will come to you."
   - When unavailable: "You're offline. Toggle on to receive job requests."

2. **Incoming job requests** (if any pending)
   - Each request: `accent` card with urgency pulse animation
   - Service type + price range
   - Distance: "1.2 km away"
   - Time: "ASAP" or "Scheduled: Sat 2 PM"
   - Rider info: first name + rating
   - Bike info: type + make
   - "Accept" (primary) / "Decline" (tertiary) buttons
   - Auto-decline timer: 5 minutes (countdown shown)

3. **Today's schedule** (list of confirmed bookings for today)
   - Each booking card: time, rider name, service type, location, status badge
   - Tappable → booking detail

4. **Upcoming schedule** (next 7 days)
   - Calendar strip + list view

**Active Job Flow:**

When mechanic accepts a job:
1. **Navigate** screen:
   - Full-screen map with route to rider's location
   - "Start Navigation" button → opens Apple Maps / Google Maps with directions
   - "I've Arrived" button (becomes active when GPS detects proximity <100m)
   - Chat button to message rider
   - Rider's access notes displayed prominently

2. **In Progress** screen (after "I've Arrived"):
   - Timer: elapsed time
   - Job details: service type, bike info, rider notes
   - "Add Notes" — text field for documenting work
   - "Add Parts Used" — line items: part name, brand, quantity, cost
   - "Take Photos" — before/after documentation
   - If additional work discovered:
     - "Request Price Adjustment" button
     - Enter: description of additional work, additional cost
     - Rider must approve in their app before mechanic proceeds
   - "Mark Complete" button (large, bottom)

3. **Complete** screen:
   - Final price summary (original + any approved additions + parts)
   - "Complete & Submit for Payment" — primary button
   - Payment auto-processes, earnings added to balance
   - Prompt: "Rate this rider" (1-5 stars, optional note)

### Tab 2: Earnings Screen
- **This Week** hero card:
  - Total earnings (large `mono-lg`)
  - Number of jobs completed
  - Average rating this week
  - Hours online
- **Earnings chart** (bar chart, last 4 weeks)
- **Payout history** list:
  - Each payout: date, amount, status (Paid / Pending / Processing), bank last 4 digits
- **Stats:**
  - All-time earnings, total jobs, average rating, completion rate

### Tab 3: Messages Screen
- List of conversations, sorted by most recent
- Each row: rider avatar, name, last message preview, timestamp, unread badge
- Tappable → full chat screen
- Chat supports: text, photos, system messages (booking updates), quick replies

### Tab 4: Mechanic Profile Screen
- Profile photo + name + rating + badges
- "Edit Profile" → bio, headline, specialties, certifications
- "Availability Schedule" → weekly time blocks
- "Service Area" → map with radius
- "Stripe Payouts" → manage bank account
- "Documents" → insurance, certifications, background check status
- "Performance" → rating breakdown, response time, completion rate
- "VELO Support"
- "Sign Out"

---

## 8. API ENDPOINTS & BACKEND LOGIC

### Authentication
```
POST   /api/v1/auth/register          — Create account (rider or mechanic)
POST   /api/v1/auth/login             — Email + password login
POST   /api/v1/auth/login/social      — Apple/Google OAuth
POST   /api/v1/auth/verify-email      — Verify 6-digit code
POST   /api/v1/auth/forgot-password   — Send reset email
POST   /api/v1/auth/reset-password    — Reset with token
POST   /api/v1/auth/refresh-token     — Refresh JWT
POST   /api/v1/auth/logout            — Invalidate session
```

### Users & Profiles
```
GET    /api/v1/users/me               — Get current user profile
PATCH  /api/v1/users/me               — Update profile
PATCH  /api/v1/users/me/location      — Update real-time location (mechanic GPS)
GET    /api/v1/users/:id/public       — Get public profile (for viewing mechanics or riders)
POST   /api/v1/users/me/avatar        — Upload avatar (multipart)
DELETE /api/v1/users/me               — Soft delete account
```

### Bikes (Digital Passport)
```
POST   /api/v1/bikes                  — Add a bike
GET    /api/v1/bikes                  — List user's bikes
GET    /api/v1/bikes/:id              — Get bike detail with full passport
PATCH  /api/v1/bikes/:id              — Update bike info
DELETE /api/v1/bikes/:id              — Remove bike
POST   /api/v1/bikes/:id/photos      — Upload bike photos
GET    /api/v1/bikes/:id/service-history — Get all service records for a bike
POST   /api/v1/bikes/:id/report-stolen — Report bike stolen
GET    /api/v1/bikes/:id/health       — Get predictive maintenance health report
```

### Service Types
```
GET    /api/v1/services               — List all available service types
GET    /api/v1/services/:slug         — Get service detail
GET    /api/v1/services/categories    — List service categories
```

### Bookings
```
POST   /api/v1/bookings               — Create new booking
GET    /api/v1/bookings               — List user's bookings (paginated, filterable by status)
GET    /api/v1/bookings/:id           — Get booking detail
PATCH  /api/v1/bookings/:id           — Update booking (limited fields based on status)
POST   /api/v1/bookings/:id/cancel    — Cancel booking
POST   /api/v1/bookings/:id/accept    — Mechanic accepts booking
POST   /api/v1/bookings/:id/decline   — Mechanic declines booking
POST   /api/v1/bookings/:id/en-route  — Mechanic marks en-route (starts GPS tracking)
POST   /api/v1/bookings/:id/arrived   — Mechanic marks arrived
POST   /api/v1/bookings/:id/start     — Mechanic starts service
POST   /api/v1/bookings/:id/complete  — Mechanic completes service (with notes, parts, photos)
POST   /api/v1/bookings/:id/price-adjustment — Mechanic requests price change (requires rider approval)
POST   /api/v1/bookings/:id/approve-adjustment — Rider approves price change
POST   /api/v1/bookings/:id/decline-adjustment — Rider declines price change
POST   /api/v1/bookings/:id/review    — Submit review (rider or mechanic)
POST   /api/v1/bookings/:id/tip       — Add tip
GET    /api/v1/bookings/:id/tracking  — Get real-time mechanic location (WebSocket upgrade)
```

### Mechanic Discovery & Matching
```
GET    /api/v1/mechanics/nearby        — Find mechanics near a location
  Query params: lat, lng, radius_km, specialty[], service_type_id, available_now (boolean)
  Returns: sorted by distance, filtered by availability and skills
GET    /api/v1/mechanics/:id           — Get mechanic public profile
GET    /api/v1/mechanics/:id/reviews   — Get mechanic reviews (paginated)
GET    /api/v1/mechanics/:id/availability — Get available time slots for next 14 days
POST   /api/v1/mechanics/me/availability — Update availability toggle
PATCH  /api/v1/mechanics/me/schedule   — Update weekly schedule
```

### Matching Algorithm Logic
When a booking is created:
1. Query all mechanics where:
   - `status = 'active'`
   - `is_available = true` (for on-demand) OR has availability on scheduled date/time
   - PostGIS distance from `service_location` to `base_location` <= `service_radius_km`
   - `specialties` includes the required specialty for the service type
   - `background_check_status = 'passed'`
   - Not currently in an active job (status 'mechanic_en_route' or 'in_progress')
2. Score each mechanic:
   - Distance score (closer = higher): `1 - (distance / max_radius)` × 40 points
   - Rating score: `(rating_average / 5)` × 30 points
   - Completion rate: `(completion_rate / 100)` × 15 points
   - Response time: `(1 - (response_time_avg / 60))` × 15 points (max 60 min, faster = higher)
3. Sort by total score descending
4. Send request to top mechanic first
5. If no response in 5 minutes, cascade to next mechanic
6. If no mechanic accepts within 20 minutes, notify rider: "No mechanics currently available. We'll keep trying and notify you when matched." Continue trying in background.
7. For scheduled bookings: assign the highest-scoring available mechanic immediately; they have 24 hours to confirm.

### Community
```
GET    /api/v1/feed                    — Get community feed (paginated, filterable)
POST   /api/v1/posts                   — Create post
GET    /api/v1/posts/:id               — Get post with comments
POST   /api/v1/posts/:id/like          — Like a post
DELETE /api/v1/posts/:id/like          — Unlike a post
POST   /api/v1/posts/:id/comments      — Add comment
GET    /api/v1/groups                  — List groups (filterable)
POST   /api/v1/groups                  — Create group
GET    /api/v1/groups/:id              — Get group detail
POST   /api/v1/groups/:id/join         — Join group
POST   /api/v1/groups/:id/leave        — Leave group
GET    /api/v1/groups/:id/feed         — Get group-specific feed
GET    /api/v1/rides                   — List upcoming rides (filterable by date, location, pace)
POST   /api/v1/rides                   — Create ride
GET    /api/v1/rides/:id               — Get ride detail with RSVPs
POST   /api/v1/rides/:id/rsvp          — RSVP to ride
```

### Gear Marketplace
```
GET    /api/v1/gear                    — List gear listings (filterable, searchable)
POST   /api/v1/gear                    — Create listing
GET    /api/v1/gear/:id                — Get listing detail
PATCH  /api/v1/gear/:id                — Update listing
DELETE /api/v1/gear/:id                — Remove listing
POST   /api/v1/gear/:id/save           — Save to favorites
POST   /api/v1/gear/:id/contact        — Start conversation with seller
```

### Chat / Messaging
```
GET    /api/v1/conversations           — List conversations
GET    /api/v1/conversations/:id/messages — Get messages (paginated, most recent first)
POST   /api/v1/conversations/:id/messages — Send message
PATCH  /api/v1/conversations/:id/read  — Mark as read
```
Real-time messages via Socket.io on `ws://api.getvelo.com/socket` with room = conversation_id.

### Payments
```
POST   /api/v1/payments/setup-intent   — Create Stripe Setup Intent (for saving card)
GET    /api/v1/payments/methods         — List saved payment methods
DELETE /api/v1/payments/methods/:id     — Remove payment method
POST   /api/v1/payments/process/:booking_id — Process payment for completed booking
GET    /api/v1/mechanics/me/earnings    — Get earnings summary
GET    /api/v1/mechanics/me/payouts     — Get payout history
```

### Strava Integration
```
GET    /api/v1/integrations/strava/connect — Get OAuth URL
GET    /api/v1/integrations/strava/callback — OAuth callback
POST   /api/v1/integrations/strava/sync    — Trigger manual sync of ride data
DELETE /api/v1/integrations/strava         — Disconnect Strava
```

### Search
```
GET    /api/v1/search?q={query}&type={mechanics|services|gear|groups|rides}
```
Meilisearch powers this. Index all searchable entities. Return mixed results with type labels.

### Notifications
```
GET    /api/v1/notifications           — List notifications (paginated)
PATCH  /api/v1/notifications/:id/read  — Mark notification as read
PATCH  /api/v1/notifications/read-all  — Mark all as read
```

---

## 9. PAYMENT INTEGRATION

### Stripe Connect Architecture
- **Platform account:** VELO's main Stripe account
- **Connected accounts:** One per mechanic (Express type for simplicity)
- **Payment flow:**
  1. Rider creates booking → Stripe PaymentIntent created with `transfer_data.destination` set to matched mechanic's Connect account
  2. `application_fee_amount` = `quoted_price × velo_commission_rate`
  3. On successful payment: funds split automatically (VELO fee retained, mechanic portion transferred)
  4. Tips: separate PaymentIntent, 100% transferred to mechanic (no commission on tips)

### Pricing Logic
- Base price determined by `service_types.base_price_min` to `base_price_max`
- Mechanic sets their specific price within this range (or system uses midpoint)
- Mobile visit fee: flat $20 added to all mobile bookings
- Parts: added at actual cost (mechanic enters cost, passed through to rider with 0% markup at MVP)
- Surge pricing (future): multiplier during peak demand periods (spring tune-up season). NOT at MVP.

### Payout Schedule
- Weekly ACH payouts every Monday for the previous week's completed jobs
- Minimum payout threshold: $25 (below threshold rolls to next week)
- Founding Mechanic guarantee: if weekly earnings < ($4,000/4.33 weeks = ~$923/week), VELO tops up the difference from operating funds. Tracked in separate `guarantee_topups` table.

---

## 10. PUSH NOTIFICATIONS & REAL-TIME SYSTEMS

### Push Notification Types (via OneSignal)

| Event | Recipient | Title | Body | Deep Link |
|-------|-----------|-------|------|-----------|
| Booking confirmed | Rider | "Booking confirmed!" | "Your {service} with {mechanic} is set for {date/time}" | booking detail |
| Mechanic matched | Rider | "Mechanic found!" | "{mechanic} accepted your request. They'll arrive in ~{eta} min" | booking tracking |
| Mechanic en route | Rider | "On the way!" | "{mechanic} is heading to you. ETA: {eta} min" | booking tracking |
| Mechanic arrived | Rider | "Your mechanic has arrived" | "{mechanic} is at your location" | booking detail |
| Service complete | Rider | "Service complete!" | "Your {service} is done. Tap to review and pay." | booking review |
| Price adjustment request | Rider | "Additional work needed" | "{mechanic} found: {description}. +${amount}. Tap to approve." | booking detail |
| New job request | Mechanic | "New job nearby!" | "{service} — {distance} away — ${price}" | job detail |
| Booking cancelled | Mechanic | "Booking cancelled" | "The {service} booking for {time} was cancelled." | jobs list |
| Review received | Mechanic | "New review!" | "{rider} left you a {stars}-star review" | profile reviews |
| Payout processed | Mechanic | "Payout sent!" | "${amount} has been sent to your bank account" | earnings |
| Ride reminder | Rider | "Ride tomorrow!" | "{ride_name} starts at {time}. {rsvp_count} riders going." | ride detail |
| Maintenance alert | Rider | "Time for a tune-up?" | "Your {bike_name}'s chain has ~200 mi left. Schedule service?" | bike passport |
| Group activity | Rider | "New in {group_name}" | "{user} posted in your group" | group feed |

### Real-Time (Socket.io)

**Events emitted by server:**
- `booking:status_changed` — sent to rider and mechanic when booking status updates
- `mechanic:location_update` — sent to rider during en-route (every 5 seconds)
  - Payload: `{lat, lng, heading, speed, eta_minutes}`
- `message:new` — sent to conversation participants on new message
- `booking:price_adjustment` — sent to rider when mechanic requests price change
- `notification:new` — sent to user on any new notification

**Events emitted by client:**
- `mechanic:update_location` — mechanic app sends GPS coordinates during en-route
  - Throttled to every 5 seconds on client side
  - Server stores in Redis (not Postgres) for real-time access, expires after 1 hour
- `conversation:typing` — typing indicator

---

## 11. COMMUNITY & SOCIAL FEATURES

### Feed Algorithm (Simple, V1)
1. Posts from groups the user belongs to (weight: 1.0)
2. Posts from users in the same borough (weight: 0.7)
3. Posts from users the user follows (weight: 0.9)
4. Service reviews from bookings in user's neighborhood (weight: 0.5)
5. Sort by: `score × recency_decay` where `recency_decay = 1 / (1 + hours_since_post / 24)`
6. Paginate 20 posts per request
7. Deduplicate (never show same post twice in a session)

### Group Ride Features
- Ride leader can take attendance (check off who showed up)
- Post-ride: auto-generate "Ride Recap" post template with attendee list, route (if GPX uploaded), photos
- Recurring rides: system auto-creates next week's ride from template
- Weather integration: show forecast on ride detail page, auto-notify if severe weather expected

---

## 12. BIKE DIGITAL PASSPORT

### Health Score Calculation
For each component:
- `remaining_life_percentage = max(0, (expected_life_miles - miles_since_installed) / expected_life_miles × 100)`
- Component health: Green (>40%), Amber (15-40%), Red (<15%)
- Overall bike health score: weighted average of all components
  - Chain: 20% weight (fails most often)
  - Tires: 20% weight each (front + rear = 40% total, split evenly)
  - Brake pads: 15% weight (safety critical)
  - Cassette: 10% weight
  - Cables: 10% weight
  - Other: 5% weight

### Predictive Maintenance Triggers
When any component drops below 20% remaining life:
- Create a `maintenance_alert` record
- Send push notification
- Show alert on Home screen and Bike Passport screen
- Include "Book Service" CTA with the relevant service type pre-selected

### Service History Auto-Population
After every completed booking:
- Auto-create service history entry on the associated bike
- If mechanic notes include part replacement: update the component record with new install date and reset miles
- If mechanic notes include mileage adjustment: update total miles

---

## 13. VELO PRO SUBSCRIPTION

### Pricing
- Monthly: $15/month
- Annual: $120/year ($10/month effective — 33% savings)
- Founding Member rate: $9.99/month or $99/year (locked for life)

### Pro Features
- 1 free basic tune-up per quarter (labor only, parts at cost)
- Priority booking (Pro riders matched before free riders)
- Full predictive maintenance AI with detailed health reports
- Extended digital bike passport (unlimited component tracking)
- Exclusive Pro badge on profile and community posts
- 10% discount on all gear marketplace purchases
- Access to Pro-only community groups and events
- Advanced ride stats (if Strava connected: trend graphs, PR tracking)

### Implementation
- Stripe Subscriptions (not one-time charges)
- `users.is_pro` flag + `users.pro_expires_at` timestamp
- Webhook: `customer.subscription.updated` / `customer.subscription.deleted` → update user record
- Grace period: 3 days after failed payment before downgrading
- Cancellation: downgrade at end of current billing period, not immediately

---

## 14. SEARCH, FILTERING & MATCHING

### Meilisearch Indexes

**mechanics_index:**
- Searchable attributes: `display_name`, `bio`, `headline`, `specialties`, `certifications.name`
- Filterable: `specialties`, `is_available`, `rating_average`, `borough`, `is_founding_mechanic`
- Sortable: `rating_average`, `total_jobs_completed`, `distance`
- Geo: `_geo: {lat, lng}` for distance-based sorting

**gear_index:**
- Searchable: `title`, `description`, `brand`, `model`, `category`
- Filterable: `category`, `condition`, `price`, `location_borough`, `status`
- Sortable: `price`, `created_at`

**groups_index:**
- Searchable: `name`, `description`, `ride_style`, `neighborhood`
- Filterable: `borough`, `ride_style`, `pace`, `type`
- Sortable: `member_count`

**services_index:**
- Searchable: `name`, `description`, `category`
- Filterable: `category`, `is_mobile_eligible`
- Sortable: `sort_order`, `base_price_min`

---

## 15. ADMIN DASHBOARD

Build as a web app (React + Vite + Tailwind) accessible at admin.getvelo.com.

### Key Screens:
1. **Dashboard** — KPIs: total users, active mechanics, bookings today/week/month, revenue, average rating, NPS
2. **Mechanics Management** — list, filter by status, approve/reject applications, view performance, suspend/deactivate
3. **Bookings** — live view of all bookings, filter by status, intervene on disputes
4. **Users** — search, view profiles, manage Pro subscriptions, handle support issues
5. **Community Moderation** — flagged posts, reported content, group management
6. **Gear Marketplace** — flagged listings, reported scams, listing management
7. **Financials** — revenue by stream, commission totals, payout summary, guarantee costs
8. **Content Management** — service type catalog, pricing updates, promo codes
9. **Analytics** — Posthog embed or custom charts for user behavior, funnel analysis

---

## 16. ERROR HANDLING & EDGE CASES

### Booking Edge Cases
| Scenario | Handling |
|----------|---------|
| No mechanics available for on-demand | Show "No mechanics currently available in your area. Try scheduling for later or we'll notify you when one becomes available." Offer to be notified. |
| Mechanic cancels after accepting | Auto-rematch with next available mechanic. Notify rider: "Your original mechanic is no longer available. We're finding you a new one." |
| Rider not present at service location | Mechanic taps "Rider not present." Rider gets push notification + 10-minute timer. If no response: booking marked as no-show, rider charged $25 no-show fee. |
| Mechanic doesn't arrive | If mechanic doesn't mark "arrived" within 30 min of ETA: auto-alert to VELO ops. Rider can cancel with no fee and gets $20 credit. |
| Payment fails | Retry once automatically. If still fails: notify rider to update payment method. Booking moves to "payment_pending" status. Mechanic still gets paid (VELO absorbs risk at MVP). |
| Rider disputes price | Booking moves to "disputed" status. VELO support manually reviews. Mechanic payout held until resolved. Target resolution: 48 hours. |
| App crash during booking | All state persisted server-side. On app restart, check for active booking and resume from correct state. |
| Poor network during GPS tracking | Client-side: buffer location updates, send batch when connection restored. Server-side: interpolate gaps in tracking. Show "Last updated X min ago" if stale. |
| Mechanic's phone dies during en-route | Last known location shown with "Last updated X min ago" note. Rider can call/text mechanic directly. |

### Input Validation Rules
- Email: RFC 5322 format validation
- Password: minimum 8 characters, at least 1 letter and 1 number
- Phone: E.164 format validation
- Names: 1-100 characters, letters/spaces/hyphens/apostrophes only
- Bio: max 500 characters
- Review text: max 1000 characters
- Addresses: must resolve to valid lat/lng via Google Places
- Photos: max 10MB per image, JPEG/PNG/HEIC only, auto-compress client-side to max 2048px
- Prices: max 2 decimal places, positive numbers only

---

## 17. PERFORMANCE, ACCESSIBILITY & SECURITY

### Performance Targets
- App launch to interactive: <2 seconds
- API response time (p95): <200ms for reads, <500ms for writes
- Image loading: blur hash placeholder → progressive load, max 500KB per image
- Feed pagination: 20 items per page, infinite scroll with 500ms debounce
- Map rendering: <1 second to interactive
- GPS tracking: 5-second update interval, no battery drain optimization needed at MVP (mechanic will have phone charging in vehicle)

### Accessibility
- All interactive elements: minimum 44×44px touch target
- Color contrast: WCAG AA minimum (4.5:1 for text, 3:1 for large text)
- Screen reader: all images have alt text, all buttons have accessible labels
- Dynamic type: support iOS Dynamic Type scaling (minimum and maximum bounds)
- Reduce motion: respect `prefers-reduced-motion` — disable animations, use instant transitions

### Security
- All API calls over HTTPS
- JWT tokens: 15-minute access token + 7-day refresh token, stored in secure device keychain (not AsyncStorage)
- Sensitive data (serial numbers, payment info): encrypted at rest in database (AES-256)
- Rate limiting: 100 req/min per user for general endpoints, 10 req/min for auth endpoints
- Input sanitization: all user input sanitized server-side before storage
- File uploads: scanned for malware, type-verified server-side (don't trust Content-Type header)
- Mechanic GPS data: only shared with the rider during an active en-route/in-progress booking, never stored permanently, deleted from Redis 1 hour after booking completion
- PII handling: comply with CCPA and GDPR (data export, deletion request support)
- Background check data: never stored in VELO systems (handled entirely by third-party provider)

---

## 18. TESTING STRATEGY

### Unit Tests (Jest)
- All utility functions (price calculation, health score, matching algorithm scoring)
- All Zod validation schemas
- All data transformation functions

### Integration Tests (Supertest + test database)
- Full booking lifecycle: create → match → accept → en-route → arrive → start → complete → pay → review
- Payment flow: card setup → payment intent → capture → transfer
- Auth flow: register → verify → login → refresh → logout

### E2E Tests (Detox for mobile)
- Rider: sign up → add bike → book service → track mechanic → review
- Mechanic: sign up → get approved (mocked) → go online → accept job → complete job → view earnings

### Load Testing (k6)
- Simulate 500 concurrent booking requests to test matching algorithm performance
- Simulate 1000 concurrent GPS location updates to test Socket.io throughput

---

## 19. DEPLOYMENT & CI/CD

### Mobile
- **Build:** EAS Build (Expo Application Services)
- **OTA Updates:** EAS Update for JS-only changes (no native code changes)
- **App Store:** Submit via EAS Submit
- **Environments:** development (local), staging (TestFlight / Internal Track), production

### Backend
- **Repo:** GitHub monorepo (`/apps/api`, `/apps/admin`, `/apps/mobile`)
- **CI:** GitHub Actions
  - On PR: run lint + type check + unit tests + integration tests
  - On merge to main: deploy to staging
  - On tag (v1.x.x): deploy to production
- **Staging:** Railway (auto-deploy on push to `staging` branch)
- **Production:** Railway or AWS ECS (auto-deploy on tag)
- **Database migrations:** Prisma Migrate (run in CI before deployment)
- **Environment variables:** managed via Railway/AWS Secrets Manager

---

## 20. POST-LAUNCH ANALYTICS & TRACKING

### Key Events to Track (Posthog)

**Rider Events:**
- `app_opened`, `sign_up_started`, `sign_up_completed`, `bike_added`
- `booking_started`, `service_selected`, `booking_confirmed`, `booking_cancelled`
- `mechanic_tracked` (viewed tracking screen), `review_submitted`, `tip_added`
- `pro_upsell_viewed`, `pro_subscribed`, `pro_cancelled`
- `community_post_created`, `ride_rsvp`, `group_joined`
- `gear_listing_viewed`, `gear_listing_created`, `gear_inquiry_sent`
- `strava_connected`, `bike_passport_viewed`

**Mechanic Events:**
- `went_online`, `went_offline`, `job_received`, `job_accepted`, `job_declined`
- `arrived_at_location`, `job_started`, `job_completed`
- `earnings_viewed`, `payout_received`

### KPI Dashboard (built into admin)
- **North Star Metric:** Weekly completed bookings
- **Growth:** WAU, MAU, new sign-ups (rider + mechanic), DAU/MAU ratio
- **Marketplace health:** Mechanic utilization rate, average match time, cancellation rate
- **Revenue:** GTV, net revenue, take rate, ARPU, MRR
- **Quality:** Average rating, NPS (quarterly survey), repeat booking rate
- **Community:** DAU on community tab, posts/day, ride RSVPs/week, groups created
- **Retention:** D1, D7, D30 retention cohorts, Pro subscription churn rate

---

## END OF SPECIFICATION

This document contains everything needed to build VELO from scratch. Follow the data models exactly. Follow the screen specifications exactly. Follow the design tokens exactly. When in doubt, optimize for the rider's experience — make it feel effortless, trustworthy, and unmistakably designed for cyclists.

Build the marketplace first. Make it perfect. Layer community on top. Let the intelligence layer grow from the data.

The order of implementation should be:
1. Backend API + database schema + auth
2. Rider app: onboarding + booking flow + payment
3. Mechanic app: onboarding + job acceptance + completion flow
4. Real-time tracking (Socket.io GPS)
5. Community features (feed, groups, rides)
6. Bike Digital Passport + predictive maintenance
7. Gear Marketplace
8. VELO Pro subscription
9. Admin dashboard
10. Strava/Garmin integration

Ship items 1-4 as the MVP. Items 5-10 follow in subsequent releases.
