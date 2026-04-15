FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
ARG VITE_GUIDORA_SDK_CDN_URL
ARG GUIDORA_DASHBOARD_ORIGIN
ENV VITE_GUIDORA_SDK_CDN_URL=$VITE_GUIDORA_SDK_CDN_URL
ENV GUIDORA_DASHBOARD_ORIGIN=$GUIDORA_DASHBOARD_ORIGIN
RUN npm run build

FROM caddy:2-alpine AS runner
COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
