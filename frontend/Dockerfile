# ---- Build stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

COPY . .

RUN npm run build

# ---- Production stage (Nginx) ----
FROM nginx:1.27-alpine

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost/health/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
