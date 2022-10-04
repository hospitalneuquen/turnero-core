FROM node:10 as build-app
WORKDIR /usr/src/app
COPY package.json package-lock.json ./ 
RUN npm ci
COPY . .
RUN npm run build 
 
FROM nginx:1.19-alpine
COPY --from=build-app /usr/src/app/dist/turnero-app /usr/share/nginx/html
COPY cicd/nginx-app.conf /etc/nginx/nginx.conf

EXPOSE 80
