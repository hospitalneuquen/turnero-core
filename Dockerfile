FROM node:10-alpine as build-stage

WORKDIR /usr/src/app
COPY app/package.json app/package-lock.json ./ 

RUN npm ci

COPY app/ . 
RUN npm run build 

FROM node:10-alpine

WORKDIR /usr/src/app
COPY api/ ./ 

RUN npm run tsc

RUN mkdir dist/public 

COPY --from=build-stage /usr/src/app/dist/turnero-app /usr/src/app/dist/public
 
CMD node dist/index.js