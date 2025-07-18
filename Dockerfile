# Stage 1: Build the React app
FROM node:24.2.0-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Optional: add custom nginx config for proxy or routing
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]