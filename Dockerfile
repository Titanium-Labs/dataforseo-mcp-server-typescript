FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build
ENV NODE_ENV=production
ENTRYPOINT ["node", "build/main/main/cli.js"]
CMD ["local"]