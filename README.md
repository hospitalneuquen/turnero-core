# Turnero (Front y Back)

## Build 

First you have to build the docker images using the script `./build.sh` it will create 2 images *turnero-api* and *turnero-app*

## Run locally 

Use docker-compose to launch the local environment 

```docker-compose up```

Open the Web Browser and navigate to `http://localhost:80` (the port is optional)

This command will run 4 containers 

* turnero_mongo: MongoDB database to store the data 
* turnero_api: API App of the turnero (it connects to turnero_mongo)
* turnero_app: Frontend App of the turnero 
* turnero_reverse: entrypoint for the requests. All the requests to `/api` will be redirected to turnero_api, all other request will be redirected to `turnero_app`


## FAQs 

* turnero_api in docker-compose uses a startup script (wait-for-it.sh) so it can wait for the MongoDB database to be accept TCP requests (this container doesn't start until turnero_mongo is fully started)
* turnero_app uses a nginx to serve the static content generated 
