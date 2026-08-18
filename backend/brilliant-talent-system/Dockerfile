# ---- Build stage ----
FROM node:22.15.0 AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

# ---- Production stage ----
FROM node:22.15.0 AS production

WORKDIR /app
RUN mkdir -p /app/output
# System deps needed at runtime for WeasyPrint
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-dev make g++ libssl-dev \
    libpango1.0-dev libcairo2-dev libgdk-pixbuf2.0-dev \
    libharfbuzz-dev libxml2-dev libxslt-dev \
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install weasyprint --break-system-packages

COPY package*.json ./
COPY prisma ./prisma/
# Copy fonts and make them available to the system
COPY --from=builder /app/assets ./assets
RUN mkdir -p /usr/share/fonts/custom && \
    cp -r /app/assets/fonts/* /usr/share/fonts/custom/ && \
    fc-cache -fv

RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

CMD npx prisma migrate deploy && node dist/main