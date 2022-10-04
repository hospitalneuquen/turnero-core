FROM node:10-alpine as build-api
WORKDIR /app
RUN apk add --no-cache --virtual .build-deps make gcc g++ python 
COPY package.json package-lock.json tsconfig.json ./ 
RUN npm ci
COPY src/ . 
RUN ls /app
RUN npm run tsc
RUN ls /app

FROM node:10-alpine 
RUN apk add --no-cache --virtual .build-deps gcc g++ make python bash
RUN mkdir /app
WORKDIR /app
COPY --from=build-api /app/dist /app
COPY --from=build-api /app/package.json /app
COPY --from=build-api /app/package-lock.json /app
RUN ls -lah /app
RUN npm ci
COPY cicd/wait-for-it.sh ./
ENV DB_HOST=mongodb://localhost/turnos
ENV PORT=3000
ENV production=production 
CMD node index.js
