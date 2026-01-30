FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Expose port
EXPOSE 4000

# Start application
CMD ["node", "server/index-standardized.js"]