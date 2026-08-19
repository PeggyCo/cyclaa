# VELO Monorepo Structure

Complete breakdown of the monorepo directory structure.

## Root Level

```
velo-app/
├── apps/                       # Application packages
├── packages/                   # Shared packages
├── docs/                       # Documentation (TODO)
├── .github/                    # GitHub Actions CI/CD (TODO)
│   └── workflows/
├── .gitignore                  # Git ignore rules
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── CLAUDE.md                  # Developer guide (READ THIS!)
├── STRUCTURE.md               # This file
├── README.md                  # Project overview
├── package.json               # Root workspace config
├── tsconfig.json              # Root TypeScript config
└── .env.example               # Environment template
```

## `/apps/api` — Fastify Backend

```
apps/api/
├── src/
│   ├── index.ts                       # Server entry point
│   ├── config/
│   │   ├── env.ts                     # Environment configuration
│   │   ├── database.ts                # Sequelize setup (TODO)
│   │   ├── redis.ts                   # Redis client (TODO)
│   │   ├── meilisearch.ts             # Meilisearch client (TODO)
│   │   ├── stripe.ts                  # Stripe client (TODO)
│   │   └── s3.ts                      # AWS S3 client (TODO)
│   ├── models/
│   │   ├── index.ts                   # Model exports
│   │   ├── User.ts                    # User model (TODO)
│   │   ├── RiderProfile.ts            # Rider profile (TODO)
│   │   ├── MechanicProfile.ts         # Mechanic profile (TODO)
│   │   ├── Bike.ts                    # Bike/digital passport (TODO)
│   │   ├── Booking.ts                 # Booking model (TODO)
│   │   ├── ServiceType.ts             # Service catalog (TODO)
│   │   ├── Review.ts                  # Reviews (TODO)
│   │   ├── CommunityPost.ts           # Posts (TODO)
│   │   ├── RideGroup.ts               # Ride groups (TODO)
│   │   ├── Challenge.ts               # Challenges (TODO)
│   │   ├── GearListing.ts             # Gear marketplace (TODO)
│   │   ├── Message.ts                 # Chat messages (TODO)
│   │   └── Conversation.ts            # Chat conversations (TODO)
│   ├── controllers/
│   │   ├── authController.ts          # Auth logic (TODO)
│   │   ├── userController.ts          # User CRUD (TODO)
│   │   ├── bikeController.ts          # Bike CRUD (TODO)
│   │   ├── bookingController.ts       # Booking CRUD (TODO)
│   │   ├── mechanicController.ts      # Mechanic search/details (TODO)
│   │   ├── communityController.ts     # Community features (TODO)
│   │   └── [more controllers]
│   ├── services/
│   │   ├── authService.ts             # Auth business logic (TODO)
│   │   ├── bookingService.ts          # Booking logic, status updates (TODO)
│   │   ├── mechanicMatchingService.ts # Geospatial matching (TODO)
│   │   ├── stravaService.ts           # Strava API integration (TODO)
│   │   ├── stripeService.ts           # Payment processing (TODO)
│   │   ├── predictiveMaintenanceService.ts # Maintenance AI (TODO)
│   │   ├── notificationService.ts     # Email, SMS, push (TODO)
│   │   └── [more services]
│   ├── routes/
│   │   ├── auth.ts                    # POST /auth/* (TODO)
│   │   ├── users.ts                   # GET/PUT /users/* (TODO)
│   │   ├── bikes.ts                   # /bikes CRUD (TODO)
│   │   ├── bookings.ts                # /bookings CRUD (TODO)
│   │   ├── mechanics.ts               # GET /mechanics (TODO)
│   │   ├── services.ts                # GET /services (TODO)
│   │   ├── community.ts               # /community endpoints (TODO)
│   │   ├── messages.ts                # /messages chat (TODO)
│   │   ├── gear.ts                    # /gear marketplace (TODO)
│   │   ├── subscription.ts            # VELO Pro endpoints (TODO)
│   │   ├── admin.ts                   # /admin endpoints (TODO)
│   │   └── health.ts                  # Health check
│   ├── middleware/
│   │   ├── auth.ts                    # JWT verification (TODO)
│   │   ├── errorHandler.ts            # Global error handling (TODO)
│   │   ├── validation.ts              # Input validation (TODO)
│   │   └── rateLimit.ts               # Rate limiting (TODO)
│   ├── jobs/
│   │   ├── sendEmailJob.ts            # Email queue (TODO)
│   │   ├── sendPushNotificationJob.ts # Push notifications (TODO)
│   │   ├── predictiveMaintenanceCronJob.ts # Daily cron (TODO)
│   │   └── processPaymentWebhookJob.ts # Stripe webhooks (TODO)
│   ├── migrations/                    # Database migrations (Sequelize)
│   │   └── [migrations created via CLI] (TODO)
│   ├── seeders/                       # Database seeders
│   │   ├── seedServiceTypes.ts        # Seed 18 service types (TODO)
│   │   └── seedCities.ts              # Seed city data (TODO)
│   ├── utils/
│   │   ├── logger.ts                  # Pino logger
│   │   ├── jwt.ts                     # JWT helpers (TODO)
│   │   ├── geolocation.ts             # Distance calc, geocoding (TODO)
│   │   ├── formatting.ts              # Response formatting (TODO)
│   │   ├── errors.ts                  # Custom error classes (TODO)
│   │   └── validators.ts              # Validation helpers (TODO)
│   └── types/
│       └── index.d.ts                 # Server-specific types (TODO)
├── dist/                              # Compiled output (created by `npm run build`)
├── docker-compose.yml                 # Local PostgreSQL, Redis, Meilisearch
├── .env.example                       # Environment template
├── .eslintrc.js                       # ESLint config
├── .gitignore                         # Git ignore
├── package.json                       # Dependencies and scripts
├── tsconfig.json                      # TypeScript config
├── jest.config.js                     # Jest testing config (TODO)
└── README.md                          # API-specific docs (TODO)
```

## `/apps/mobile-rider` — Rider App

```
apps/mobile-rider/
├── src/
│   ├── App.tsx                           # Root component
│   ├── index.js                          # Expo entry
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx           # Login (TODO)
│   │   │   ├── SignupScreen.tsx          # Sign up (TODO)
│   │   │   ├── OnboardingScreen.tsx      # Onboarding (TODO)
│   │   │   └── ForgotPasswordScreen.tsx  # Reset password (TODO)
│   │   ├── booking/
│   │   │   ├── BookingRequestScreen.tsx  # Request a mechanic (TODO)
│   │   │   ├── BookingDetailsScreen.tsx  # View booking details (TODO)
│   │   │   ├── TrackingScreen.tsx        # GPS tracking (TODO)
│   │   │   └── BookingHistoryScreen.tsx  # Past bookings (TODO)
│   │   ├── mechanics/
│   │   │   ├── MechanicSearchScreen.tsx  # Search/filter (TODO)
│   │   │   ├── MechanicDetailScreen.tsx  # Mechanic profile (TODO)
│   │   │   └── ReviewsScreen.tsx         # Mechanic reviews (TODO)
│   │   ├── bikes/
│   │   │   ├── BikeListScreen.tsx        # My bikes (TODO)
│   │   │   ├── BikeDetailScreen.tsx      # Bike details + service history (TODO)
│   │   │   ├── BikeFormScreen.tsx        # Add/edit bike (TODO)
│   │   │   └── BikePassportScreen.tsx    # Digital passport view (TODO)
│   │   ├── community/
│   │   │   ├── RideGroupsScreen.tsx      # Local ride groups (TODO)
│   │   │   ├── RideDetailScreen.tsx      # Ride details (TODO)
│   │   │   ├── EventsScreen.tsx          # Events calendar (TODO)
│   │   │   ├── PostsScreen.tsx           # Social feed (TODO)
│   │   │   ├── ChallengesScreen.tsx      # Community challenges (TODO)
│   │   │   └── RoutesScreen.tsx          # Shared routes (TODO)
│   │   ├── gear/
│   │   │   ├── GearListingsScreen.tsx    # Browse gear for sale (TODO)
│   │   │   ├── GearDetailScreen.tsx      # Gear details (TODO)
│   │   │   ├── SellGearScreen.tsx        # List item for sale (TODO)
│   │   │   └── ConversationScreen.tsx    # Chat with buyer (TODO)
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx         # User profile (TODO)
│   │   │   ├── EditProfileScreen.tsx     # Edit profile (TODO)
│   │   │   ├── SettingsScreen.tsx        # App settings (TODO)
│   │   │   └── PaymentMethodsScreen.tsx  # Saved cards (TODO)
│   │   ├── subscription/
│   │   │   ├── VELOProScreen.tsx         # VELO Pro marketing (TODO)
│   │   │   └── BenefitsScreen.tsx        # Pro benefits (TODO)
│   │   └── shared/
│   │       ├── HomeScreen.tsx            # Home/explore (TODO)
│   │       ├── SearchScreen.tsx          # Global search (TODO)
│   │       └── NotificationsScreen.tsx   # Notifications (TODO)
│   ├── components/
│   │   ├── Button.tsx                    # Primary button component
│   │   ├── Input.tsx                     # Input field (TODO)
│   │   ├── Card.tsx                      # Card component (TODO)
│   │   ├── Avatar.tsx                    # Avatar component (TODO)
│   │   ├── MechanicCard.tsx              # Mechanic card (TODO)
│   │   ├── BookingCard.tsx               # Booking card (TODO)
│   │   ├── BottomSheet.tsx               # Bottom sheet modal (TODO)
│   │   ├── StatusPill.tsx                # Status badge (TODO)
│   │   ├── RatingDisplay.tsx             # Star rating (TODO)
│   │   ├── LocationPicker.tsx            # Location selection (TODO)
│   │   └── [more components] (TODO)
│   ├── navigation/
│   │   ├── RootNavigator.tsx             # Auth vs main switch (TODO)
│   │   ├── BottomTabNavigator.tsx        # 4 main tabs (TODO)
│   │   ├── AuthNavigator.tsx             # Auth stack (TODO)
│   │   ├── BookingNavigator.tsx          # Booking stack (TODO)
│   │   └── LinkingConfiguration.ts       # Deep linking config (TODO)
│   ├── store/
│   │   ├── authStore.ts                  # Auth state (user, tokens) (TODO)
│   │   ├── appStore.ts                   # App-wide state (TODO)
│   │   └── uiStore.ts                    # UI state (modals, sheets) (TODO)
│   ├── api/
│   │   ├── client.ts                     # Axios instance + auth interceptors (TODO)
│   │   ├── queries/
│   │   │   ├── useUser.ts                # GET /users/:id (TODO)
│   │   │   ├── useBikes.ts               # GET /bikes (TODO)
│   │   │   ├── useMechanics.ts           # GET /mechanics (search) (TODO)
│   │   │   ├── useBookings.ts            # GET /bookings (TODO)
│   │   │   ├── useCommunity.ts           # GET /community (TODO)
│   │   │   └── [more queries] (TODO)
│   │   └── mutations/
│   │       ├── useCreateBooking.ts       # POST /bookings (TODO)
│   │       ├── useCancelBooking.ts       # POST /bookings/:id/cancel (TODO)
│   │       ├── useUpdateProfile.ts       # PUT /users/:id (TODO)
│   │       └── [more mutations] (TODO)
│   ├── utils/
│   │   ├── storage.ts                    # Secure token storage (TODO)
│   │   ├── formatting.ts                 # Price, date, distance formatting (TODO)
│   │   ├── validation.ts                 # Form validation helpers (TODO)
│   │   ├── geolocation.ts                # Location helpers (TODO)
│   │   └── constants.ts                  # Local constants (TODO)
│   ├── constants/
│   │   ├── colors.ts                     # Design system colors
│   │   ├── typography.ts                 # Font styles (TODO)
│   │   ├── spacing.ts                    # Spacing values (TODO)
│   │   ├── borderRadius.ts               # Border radius (TODO)
│   │   └── endpoints.ts                  # API base URLs (TODO)
│   ├── hooks/
│   │   ├── useLocation.ts                # Location permission + tracking (TODO)
│   │   ├── useNetworkStatus.ts           # Network state (TODO)
│   │   ├── useHaptics.ts                 # Haptic feedback (TODO)
│   │   └── [more hooks] (TODO)
│   ├── types/
│   │   ├── index.ts                      # App-specific types (TODO)
│   │   ├── navigation.ts                 # Navigation params (TODO)
│   │   └── [more types] (TODO)
│   └── assets/
│       ├── icon.png                      # App icon (TODO)
│       ├── splash.png                    # Splash screen (TODO)
│       ├── adaptive-icon.png             # Android adaptive icon (TODO)
│       ├── favicon.png                   # Web favicon (TODO)
│       ├── fonts/                        # Custom fonts (TODO)
│       └── images/                       # App images/illustrations (TODO)
├── app.json                              # Expo configuration
├── .env.example                          # Environment template
├── .eslintrc.js                          # ESLint config
├── .gitignore                            # Git ignore
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript config
├── index.js                              # Entry point
├── jest.config.js                        # Jest testing config (TODO)
└── README.md                             # Rider app docs (TODO)
```

## `/apps/mobile-mechanic` — Mechanic App

```
apps/mobile-mechanic/
├── src/
│   ├── App.tsx                           # Root component
│   ├── index.js                          # Expo entry
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx           # Login (TODO)
│   │   │   ├── SignupScreen.tsx          # Sign up (TODO)
│   │   │   ├── OnboardingScreen.tsx      # Mechanic verification (TODO)
│   │   │   └── DocumentUploadScreen.tsx  # Insurance, background check (TODO)
│   │   ├── bookings/
│   │   │   ├── BookingRequestScreen.tsx  # New requests (TODO)
│   │   │   ├── BookingAcceptScreen.tsx   # Accept/decline (TODO)
│   │   │   ├── ActiveBookingScreen.tsx   # In-progress (TODO)
│   │   │   ├── CompletedBookingsScreen.tsx # History (TODO)
│   │   │   └── BookingDetailScreen.tsx   # Booking details (TODO)
│   │   ├── availability/
│   │   │   ├── AvailabilityScreen.tsx    # Set availability (TODO)
│   │   │   ├── ScheduleScreen.tsx        # Weekly schedule (TODO)
│   │   │   └── LocationScreen.tsx        # Service area/base location (TODO)
│   │   ├── earnings/
│   │   │   ├── EarningsScreen.tsx        # Dashboard, stats (TODO)
│   │   │   ├── PayoutScreen.tsx          # Payout history (TODO)
│   │   │   └── InvoiceScreen.tsx         # Invoice view (TODO)
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx         # Mechanic profile (TODO)
│   │   │   ├── EditProfileScreen.tsx     # Edit specialties, bio (TODO)
│   │   │   ├── RatingsScreen.tsx         # Reviews/ratings (TODO)
│   │   │   ├── SettingsScreen.tsx        # Notification settings (TODO)
│   │   │   └── BankAccountScreen.tsx     # Stripe Connect setup (TODO)
│   │   ├── messages/
│   │   │   ├── ConversationsScreen.tsx   # Chat list (TODO)
│   │   │   └── ChatScreen.tsx            # Chat with rider (TODO)
│   │   └── shared/
│   │       └── NotificationsScreen.tsx   # Notification history (TODO)
│   ├── components/
│   │   ├── BookingRequestCard.tsx        # Booking request card (TODO)
│   │   ├── ActiveBookingCard.tsx         # Active job card (TODO)
│   │   ├── Button.tsx                    # Primary button
│   │   ├── Input.tsx                     # Input field (TODO)
│   │   ├── Avatar.tsx                    # Avatar (TODO)
│   │   ├── StatusBadge.tsx               # Status indicator (TODO)
│   │   ├── GPSTracker.tsx                # GPS map (TODO)
│   │   └── [more components] (TODO)
│   ├── navigation/
│   │   ├── RootNavigator.tsx             # Auth vs main switch (TODO)
│   │   ├── BottomTabNavigator.tsx        # Main tabs (TODO)
│   │   └── LinkingConfiguration.ts       # Deep linking (TODO)
│   ├── store/
│   │   ├── authStore.ts                  # Auth state (TODO)
│   │   ├── appStore.ts                   # App state (TODO)
│   │   └── locationStore.ts              # GPS location state (TODO)
│   ├── api/
│   │   ├── client.ts                     # Axios instance (TODO)
│   │   ├── queries/
│   │   │   ├── useBookingRequests.ts     # GET /bookings/requests (TODO)
│   │   │   ├── useEarnings.ts            # GET /earnings (TODO)
│   │   │   └── [more queries] (TODO)
│   │   └── mutations/
│   │       ├── useAcceptBooking.ts       # POST /bookings/:id/accept (TODO)
│   │       ├── useUpdateAvailability.ts  # PUT /availability (TODO)
│   │       └── [more mutations] (TODO)
│   ├── utils/
│   │   ├── storage.ts                    # Secure storage (TODO)
│   │   ├── gps.ts                        # GPS tracking (TODO)
│   │   ├── formatting.ts                 # Formatting (TODO)
│   │   └── [more utils] (TODO)
│   ├── constants/
│   │   ├── colors.ts                     # Design tokens
│   │   ├── typography.ts                 # Typography (TODO)
│   │   ├── spacing.ts                    # Spacing (TODO)
│   │   └── [more constants] (TODO)
│   ├── hooks/
│   │   ├── useLocation.ts                # GPS tracking (TODO)
│   │   ├── useBackgroundLocation.ts      # Background GPS (TODO)
│   │   └── [more hooks] (TODO)
│   ├── types/
│   │   └── index.ts                      # App types (TODO)
│   └── assets/
│       ├── icon.png                      # App icon (TODO)
│       ├── splash.png                    # Splash screen (TODO)
│       └── [images] (TODO)
├── app.json                              # Expo configuration
├── .env.example                          # Environment template
├── .eslintrc.js                          # ESLint config
├── .gitignore                            # Git ignore
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript config
├── index.js                              # Entry point
└── README.md                             # Mechanic app docs (TODO)
```

## `/packages/shared` — Shared Library

```
packages/shared/
├── src/
│   ├── index.ts                          # Main export
│   ├── types/
│   │   ├── index.ts                      # Shared type definitions (TODO)
│   │   ├── user.ts                       # User types (TODO)
│   │   ├── booking.ts                    # Booking types (TODO)
│   │   ├── bike.ts                       # Bike types (TODO)
│   │   ├── api.ts                        # API types (TODO)
│   │   └── [more types] (TODO)
│   ├── constants/
│   │   ├── index.ts                      # Color palette, enums, API endpoints
│   │   ├── colors.ts                     # Design tokens (TODO - consolidate into index)
│   │   └── [more constants] (TODO)
│   └── utils/
│       ├── index.ts                      # Utility functions
│       ├── formatting.ts                 # Formatting helpers (TODO)
│       ├── validation.ts                 # Validation helpers (TODO)
│       ├── distance.ts                   # Distance calculation (TODO)
│       └── [more utils] (TODO)
├── dist/                                 # Compiled output (created by `npm run build`)
├── .eslintrc.js                          # ESLint config
├── .gitignore                            # Git ignore
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript config
└── README.md                             # Shared package docs (TODO)
```

## Documentation

```
docs/                                     # Documentation (TODO)
├── API.md                                # API endpoint reference
├── DATABASE.md                           # Schema documentation
├── DESIGN_SYSTEM.md                      # Design tokens and components
├── FLOWS.md                              # Auth, booking, payment flows
├── MECHANICS.md                          # Mechanic app specific
├── TESTING.md                            # Testing strategy
├── DEPLOYMENT.md                         # Deployment guide
└── CONTRIBUTING.md                       # Contributing guidelines
```

## CI/CD

```
.github/
└── workflows/                            # GitHub Actions (TODO)
    ├── mobile-build.yml                  # EAS Build on release tag
    ├── api-deploy.yml                    # Deploy backend on main
    ├── tests.yml                         # Run tests on PR
    └── lint.yml                          # ESLint on PR
```

## Legend

- `(TODO)` — File exists as placeholder, implementation needed
- Files without `(TODO)` — Already scaffolded and functional
- `[more *]` — Additional files of same pattern to be created

## Key Files to Review

1. **CLAUDE.md** — Developer guide with coding conventions
2. **package.json** — Root workspace config with all scripts
3. **apps/api/src/index.ts** — Backend entry point
4. **apps/mobile-rider/src/App.tsx** — Rider app entry
5. **apps/mobile-mechanic/src/App.tsx** — Mechanic app entry
6. **packages/shared/src/constants/index.ts** — Shared design tokens
7. **apps/api/docker-compose.yml** — Local development services

## Next Steps

1. **Install dependencies**: `npm install`
2. **Start local services**: `cd apps/api && docker-compose up -d`
3. **Read CLAUDE.md** for development guidelines
4. **Start building features** following the structure above
