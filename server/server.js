"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
/**
 *  ==========================
 *        SERVER CLASS
 *  ==========================
 */
/* Create the express and socket.io server */
class Server {
    constructor() {
        this.port = 3000;
        this.initialize();
        this.registerRoutes();
        this.registerChannels();
    }
    /* Create server instances */
    initialize() {
        this.app = express();
        this.httpServer = http_1.createServer(this.app);
        this.io = new socket_io_1.Server(this.httpServer);
    }
    /* Handle all routes of the sever: Further route objects will be added on the way */
    registerRoutes() {
        /* Serve the static files of the Front-End application */
        this.app.use(express.static(path.join(__dirname, 'client/build')));
        /* Map all requests to the REACT app */
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname + '/client/build/index.html'));
        });
    }
    registerChannels() {
        this.io.on('connection', (socket) => {
            console.log(`User ${socket.id} has connected to the room`);
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