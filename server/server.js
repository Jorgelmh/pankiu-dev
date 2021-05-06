"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const http_1 = require("http");
/**
 *  ==========================
 *        SERVER OBJECT
 *  ==========================
 */
/* Creates the express server that will contain the logic of the system */
class Server {
    constructor() {
        this.port = 3000;
        this.initialize();
        this.registerRoutes();
    }
    /* Create server instances */
    initialize() {
        this.app = express();
        this.httpServer = http_1.createServer(this.app);
    }
    /* Handle all routes of the sever: Further route objects will be added on the way */
    registerRoutes() {
        /* Serve the static files of the Front-End application */
        this.app.use(express.static(path.join(__dirname, 'client/build')));
        /* Map all requests that don't match with the REACTJS APP */
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname + '/client/build/index.html'));
        });
    }
    /* Start listening to requests */
    listen(callback) {
        this.httpServer.listen(this.port, () => {
            callback(this.port);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=server.js.map