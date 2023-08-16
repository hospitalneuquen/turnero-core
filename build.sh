#!/bin/sh 
docker buildx build -f api/Dockerfile -t andesnqn/turnero-api:master ./api
docker buildx build -f app/Dockerfile -t andesnqn/turnero-app:master ./app

# Push
docker push andesnqn/turnero-api:master
docker push andesnqn/turnero-app:master
