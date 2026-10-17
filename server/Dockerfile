FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install package dependencies
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Set environment defaults
ENV NODE_ENV=production \
    PORT=5000

# Expose backend port
EXPOSE 5000

# Run container as non-root node user for security
USER node

# Healthcheck to monitor API status
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start server
CMD ["node", "src/server.js"]
