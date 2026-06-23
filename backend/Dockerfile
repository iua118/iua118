FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install

# Copy source code
COPY backend ./backend
COPY shared ./shared
COPY tsconfig.json ./

# Build the application
RUN npm run build --workspace=crm-backend

# Expose port
EXPOSE 3001

# Run the application
CMD ["npm", "run", "start", "--workspace=crm-backend"]
