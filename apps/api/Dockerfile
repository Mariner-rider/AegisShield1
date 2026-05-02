# syntax=docker/dockerfile:1.7
FROM node:22-alpine AS build
WORKDIR /workspace

COPY package*.json tsconfig.json ./
RUN npm ci --include=dev --ignore-scripts --no-audit || true

COPY . .
RUN npm run build || true

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=build /workspace/package*.json ./
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/dist ./dist

USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "dist/index.js"]
