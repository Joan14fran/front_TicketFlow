# ----- STAGE 1: Construcción (Build) -----
    
FROM node:20-alpine AS builder

# Directorio de trabajo
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

# ----- STAGE 2: Servidor (Serve) -----
FROM nginx:stable-alpine

COPY --from=builder /app/dist/front_TicketFlow/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
