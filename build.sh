#!/bin/sh 
docker buildx build -f api/Dockerfile -t turnero-api ./api
docker buildx build -f app/Dockerfile -t turnero-app ./app
