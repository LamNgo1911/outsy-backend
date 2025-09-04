# Build stage
FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

# Run stage
FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Copy compiled JS and Prisma client
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma

EXPOSE 8000

CMD [ "node", "dist/server.js"]
