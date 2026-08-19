# Deployment Guide

This repo had no Dockerfile, CI, or deploy config before this pass — this
doc covers what was added and how to actually use it. It complements
`docs/WAITLIST.md` (waitlist-specific setup) and the root `CLAUDE.md`.

## What exists now

| Piece | Path |
|---|---|
| API Dockerfile (multi-stage, monorepo-aware) | `apps/api/Dockerfile` |
| Railway config | `apps/api/railway.json` |
| CI: API tests on PR/push | `.github/workflows/api-tests.yml` |
| CD: deploy API to Railway after tests pass | `.github/workflows/api-deploy.yml` |
| CD: EAS builds for both mobile apps | `.github/workflows/mobile-build.yml` |
| EAS build profiles | `apps/mobile-rider/eas.json`, `apps/mobile-mechanic/eas.json` |

## 1. Backend API

### Local Docker build

Build from the **repo root** (not `apps/api`) — the Dockerfile needs the
monorepo's root `package-lock.json` and the `packages/shared` workspace:

```bash
docker build -f apps/api/Dockerfile -t cyclaa-api .
docker run -p 3000:3000 --env-file apps/api/.env cyclaa-api
```

### Railway (recommended for MVP, per CLAUDE.md)

1. Create a Railway project, add a Postgres (with PostGIS — use the
   `postgis/postgis` image or Railway's Postgres + `CREATE EXTENSION postgis;`
   run once) and a Redis plugin.
2. Add a new service from this GitHub repo. In service settings:
   - **Root directory**: repo root (`/`), not `apps/api` — same reason as
     the local build above.
   - **Builder**: Dockerfile, path `apps/api/Dockerfile` (this is already
     set in `apps/api/railway.json`, which Railway auto-detects).
3. Set environment variables on the service from `apps/api/.env.example`
   — at minimum `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`
   (Railway's Postgres plugin exposes these, or reference `${{Postgres.*}}`
   variables), `REDIS_URL`, `JWT_SECRET`, `RESEND_API_KEY`, `FROM_EMAIL`,
   `APP_URL`, `CORS_ORIGIN`.
4. Run migrations once against production after the first deploy:
   ```bash
   railway run --service api npm run migrate --workspace=apps/api
   ```
5. Get a Railway project token (Project Settings > Tokens) and add it as
   the `RAILWAY_TOKEN` secret in GitHub (Settings > Secrets and variables >
   Actions). Pushes to `main` that touch `apps/api/**` will now run tests,
   then deploy automatically via `.github/workflows/api-deploy.yml`.

### Health checks

`GET /health` returns `{ status: 'ok' }` — this is wired into both the
Dockerfile's `HEALTHCHECK` and `railway.json`'s `healthcheckPath`.

## 2. Mobile apps (EAS)

Neither app has ever been built with EAS — there's no `eas.json` history,
no Apple/Google credentials configured, and no bundle identifiers
registered on App Store Connect / Play Console. That setup has to happen
once, interactively, from your machine (not from this session):

```bash
npm install -g eas-cli
cd apps/mobile-rider   # or apps/mobile-mechanic
eas login
eas build:configure    # links the project to an Expo account/project
eas build --platform ios --profile preview      # first build, interactive credential setup
eas build --platform android --profile preview
```

Once that's done once per app, the GitHub Action
(`.github/workflows/mobile-build.yml`) can trigger unattended builds:

1. Create an Expo access token: https://expo.dev/accounts/[account]/settings/access-tokens
2. Add it as the `EXPO_TOKEN` secret in GitHub.
3. Trigger a build by pushing a tag (`rider-v1.0.0` or `mechanic-v1.0.0`)
   or manually via the Actions tab (`workflow_dispatch`, choose app +
   profile).

### Build profiles

- `development` — dev client, for use with `expo start --dev-client`.
- `preview` — internal distribution (TestFlight internal / Play internal
  testing), points at a staging API URL (update the placeholder in
  `eas.json` once staging exists).
- `production` — store-ready build, points at `https://api.cyclaa.app/api`
  (update once the real production domain is live).

### App store submission

`eas submit` isn't wired into CI (it needs interactive Apple/Google
credentials the first time) — run it manually after a production build:

```bash
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

## 3. Environment variables reference

See `apps/api/.env.example` for the full list. The ones that matter most
for a first deploy: `DB_HOST`/`DB_PORT`/`DB_USER`/`DB_PASSWORD`/`DB_NAME`
(not `DATABASE_URL` — see the comment in `.env.example`), `JWT_SECRET`,
`RESEND_API_KEY`, `FROM_EMAIL`, `APP_URL`, `CORS_ORIGIN`.

For the mobile apps, the only env var currently read at build time is
`EXPO_PUBLIC_API_URL` (set per-profile in each app's `eas.json`; for local
dev, set it in a `.env` file per Expo's `EXPO_PUBLIC_*` convention).

## 4. Known gaps (not addressed in this pass)

- **PostGIS in production**: the CI Postgres service uses the
  `postgis/postgis` image; make sure your production Postgres also has
  the PostGIS extension available before running migration `008`.
- **Redis/Meilisearch**: configured in `docker-compose.yml` for local dev
  and referenced in `.env.example`, but nothing in the API currently uses
  them (no routes beyond `/waitlist` are built yet). Add them to your
  hosting provider when the routes that need them land.
- **Auth routes**: the mobile apps' login/signup screens call
  `POST /auth/login` and `POST /auth/register`, which don't exist on the
  backend yet (only `/api/waitlist` is implemented). Build those next.
- **Expo SDK 49**: `expo-doctor` flags this as targeting an Android API
  level that Google Play will stop accepting new submissions for. Worth
  planning an upgrade to SDK 50+ before a real store submission.
