# Cyclaa API Reference

Base URL: `{API_BASE_URL}/api` (e.g. `http://localhost:3000/api` locally).
Every response is JSON, shaped `{ "success": true, "data": ... }` or
`{ "success": false, "error": "..." }`.

Routes marked **auth** require `Authorization: Bearer <token>`, where the
token comes from `POST /auth/login` or `POST /auth/register`. The token
carries `{ id, role }`, and route handlers use `role` to decide what a
caller can see or do (a rider and a mechanic hit the same `GET /bookings`
endpoint but get different results — see `bookingController.ts`).

## Auth (`/auth`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/register` | — | Body: `email, password, firstName, lastName, phone, role?` (`"rider"` \| `"mechanic"`, defaults to rider). Creates the `User` row plus a matching `RiderProfile`/`MechanicProfile`. Returns `{ token, user }`. Rate-limited to 10/min. |
| POST | `/auth/login` | — | Body: `email, password`. Returns `{ token, user }`. Rate-limited to 10/min. |
| GET | `/auth/me` | ✓ | Returns the current user from the JWT. |

Mechanics registered today go live immediately (`status: active`,
`isAvailable: true`) — there's no admin-review step yet. See
`docs/DEPLOYMENT.md`'s "Known gaps".

## Mechanics (`/mechanics`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/mechanics` | ✓ | Query params: `specialty?`, `lat?`, `lng?`. Returns active mechanics, sorted by rating. `distanceMiles` is only populated when `lat`/`lng` are passed. |
| GET | `/mechanics/:userId` | ✓ | Single mechanic profile. |

## Service types (`/service-types`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/service-types` | — | The bookable service catalog (tune-up, flat fix, etc). Seed with `npm run seed` (in `apps/api`) — see below. |

## Bookings (`/bookings`)

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/bookings` | ✓ | Role-aware: a rider token returns their requests, a mechanic token returns jobs assigned to them. |
| POST | `/bookings` | ✓ (rider) | Body: `serviceTypeId, address, mechanicId?, description?, lat?, lng?`. Omitting `mechanicId` leaves the booking unmatched (`pending_match`) — there's no auto-dispatch yet, see Known gaps. Auto-creates a placeholder bike for the rider if they don't have one. |
| GET | `/bookings/:id` | ✓ | Must be the rider or mechanic on the booking. |
| PATCH | `/bookings/:id/status` | ✓ | Body: `{ "action": "accept" \| "decline" \| "start" \| "complete" \| "cancel" }`. `accept`/`decline`/`start`/`complete` require a mechanic token and that the mechanic is assigned to the booking; `cancel` requires the rider token and that they created it. |

Client-facing booking status is a simplified string
(`pending | confirmed | en_route | in_progress | completed | cancelled`)
mapped from the fuller internal `BookingStatus` enum — see
`toClientStatus()` in `bookingController.ts` if you need the raw states.

## Waitlist (`/waitlist`)

See `docs/WAITLIST.md` for the pre-launch waitlist endpoints
(`POST /waitlist`, `GET /waitlist/confirm`, etc) — unrelated to the
authenticated app endpoints above.

## Seeding the service catalog

```bash
cd apps/api
npm run migrate   # creates tables (skips already-applied ones)
npm run seed       # inserts the 6 starter service types, idempotent
```

## Not yet built

`/users`, `/bikes`, community (`/ride-groups`, `/posts`, ...), and
messaging routes have Sequelize models and migrations already in place
(`src/models/`, `src/migrations/006_create_community.ts`,
`007_create_messaging.ts`) but no routes/controllers yet — the mobile
apps don't call them. Follow the pattern in `bookingController.ts` +
`routes/bookings.ts` when building them.
