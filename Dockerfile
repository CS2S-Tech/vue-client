FROM node:16.20.0-alpine3.17 as build

WORKDIR /app

COPY . .

RUN npm ci

RUN npm run build

FROM nginx:alpine

RUN rm -r /usr/share/nginx/html/

COPY --from=build /app/client /usr/share/nginx/html/

COPY default_nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
