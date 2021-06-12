FROM node:alpine as build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install --production

COPY . .
RUN yarn run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

