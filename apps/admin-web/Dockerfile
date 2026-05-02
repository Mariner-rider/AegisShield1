FROM node:22-alpine

ENV NODE_ENV=production \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false

WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Keep image small for low-resource VPS/PC testing.
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit || true && npm cache clean --force

COPY . .
RUN chown -R appuser:appgroup /app

USER appuser
CMD ["node","-e","console.log('runtime placeholder')"]
