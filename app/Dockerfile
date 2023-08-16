FROM node:8 as build-app
WORKDIR /usr/src/app
COPY package.json package-lock.json ./ 
RUN npm ci
COPY . .
RUN npm run build 
 
FROM nginx:1.19-alpine
COPY --from=build-app /usr/src/app/dist /usr/share/nginx/html
COPY --from=build-app /usr/src/app/node_modules/bootstrap/dist/css/bootstrap.min.css /usr/share/nginx/html/css
COPY --from=build-app /usr/src/app/node_modules/mdi/css/materialdesignicons.min.css /usr/share/nginx/html/css
COPY cicd/nginx-app.conf /etc/nginx/nginx.conf

EXPOSE 80
