# --- Stage 1: Build React App ---
FROM node:22-alpine AS builder
WORKDIR /app

# Ambil Build Arguments dari GitHub Actions / Docker Compose
# Sesuaikan prefix variabel dengan bundler kamu (VITE_APP_API_URL untuk Vite, REACT_APP_API_URL untuk CRA)
ARG VITE_APP_API_URL
ARG VITE_APP_ENV

# Set sebagai Environment Variable internal saat npm run build
ENV VITE_APP_API_URL=$VITE_APP_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV

COPY package.json package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

# --- Stage 2: Serve dengan Nginx ---
FROM nginx:alpine AS runner

# Copy konfigurasi custom Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build dari Stage 1 (Sesuaikan 'dist' jika pakai Vite, atau 'build' jika pakai Create React App)
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 4001

CMD ["nginx", "-g", "daemon off;"]