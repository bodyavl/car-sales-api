# build stage
FROM node:20-alpine as build
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install
COPY . .
RUN pnpm build

# prod stage
FROM node:20-alpine as prod
WORKDIR /usr/src/app
COPY package*.json pnpm-lock.yaml ./
COPY --from=build /usr/src/app/dist ./dist
RUN npm install -g pnpm
RUN pnpm install
COPY .env.example .env
RUN rm pnpm-lock.yaml
EXPOSE 3000
CMD ["node", "dist/main.js"]
