# Cyclaa API — multi-stage build
# Built from the monorepo root context (see docker build command in DEPLOYMENT.md)
# because this is an npm workspaces project and needs the root lockfile.

FROM node:20-slim AS base
WORKDIR /repo

FROM base AS deps
COPY package.json package-lock.json ./
# npm ci needs every workspace's package.json present (root package.json
# declares all four), even though --workspace below only *installs*
# apps/api + packages/shared — the mobile app workspaces stay
# dependency-free stubs here, keeping their heavy RN deps out of this image.
COPY apps/api/package.json apps/api/package.json
COPY apps/mobile-rider/package.json apps/mobile-rider/package.json
COPY apps/mobile-mechanic/package.json apps/mobile-mechanic/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN npm ci --workspace=apps/api --workspace=packages/shared --include-workspace-root

FROM deps AS build
COPY packages/shared packages/shared
COPY apps/api apps/api
RUN npm run build --workspace=apps/api

FROM base AS runtime
ENV NODE_ENV=production
WORKDIR /repo
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/src/migrations ./apps/api/src/migrations
COPY apps/api/package.json ./apps/api/package.json

WORKDIR /repo/apps/api
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "dist/index.js"]
