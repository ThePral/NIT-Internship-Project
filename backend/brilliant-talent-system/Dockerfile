FROM node:20.16.0-bullseye 

WORKDIR /app

# Remove this line - it's causing the error
# RUN npm install -g npm@latest

COPY package*.json ./
COPY prisma ./prisma/

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    make \
    g++ \
    libssl-dev \
    # WeasyPrint dependencies
    libpango1.0-dev \
    libcairo2-dev \
    libgdk-pixbuf2.0-dev \
    libharfbuzz-dev \
    libxml2-dev \
    libxslt-dev \
    # Fonts
    fonts-freefont-ttf \
    && rm -rf /var/lib/apt/lists/*

# Install WeasyPrint via pip
RUN pip3 install weasyprint

# Install npm packages
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE ${PORT:-3000}

CMD ["npm", "run", "start:dev"]