"use strict";

import * as bodyParser from "body-parser";
import * as express from "express";
import * as path from "path";
import * as mongoose from 'mongoose';
import * as config from './config';
import * as errorHandler from 'errorhandler';
import * as methodOverride from 'method-override';
import * as requireDir from 'require-dir';
import { production } from './config';


// import * as sseExpress from 'sse-express';


// import * as indexRoute from "./routes/index";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;
    public cache: any;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     */

    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        //create expressjs application
        this.app = express();
        // this.cache = cache();

        //configure db
        this.dbConnection();

        //configure application
        this.config();

        //configure routes
        this.routes();
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     * @return void
     */
    private config() {
        //mount json form parser
        this.app.use(bodyParser.json());

        //mount query string parser
        this.app.use(bodyParser.urlencoded({ extended: true }));

        //add static paths
        if (production) {
            this.app.use(express.static(path.join(__dirname, "public")));
        }
        // this.app.use(express.static(path.join(__dirname, "bower_components")));

        //mount override
        this.app.use(methodOverride());

        //error handling
        this.app.use(errorHandler());

        this.app.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            res.header('X-Content-Type-Options', 'nosniff');

            // Permitir que el método OPTIONS funcione sin autenticación
            if ('OPTIONS' === req.method) {
                res.sendStatus(200);
            } else {
                next();
            }
        });

    }

    /**
     * Configure application
     *
     * @class Server
     * @method dbConnection
     * @return void
     */
    private dbConnection() {
        // Configuración de Mongoose
        mongoose.set('debug', config.debugMode);
        mongoose.connect(config.db);

        mongoose.connection.on('connected', function () {
            console.log('[Mongoose] Conexión OK');
        });
        mongoose.connection.on('error', function (err) {
            console.log('[Mongoose] No se pudo conectar al servidor');
        });
    }

    /**
     * Configure routes
     *
     * @class Server
     * @method routes
     * @return void
     */
    private routes() {
        //get router
        const router: express.Router = express.Router();

        const routes = requireDir('./routes/');
        for (let route in routes) {
            this.app.use('/api', routes[route].default);
        }
        //use router middleware
        this.app.use(router);
    }
}