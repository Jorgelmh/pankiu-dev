"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const MatchMaking_1 = require("./matchmaking/MatchMaking");
const uuid_1 = require("uuid");
const Channels_1 = require("./sockets/Channels");
const API_1 = require("./routes/API");
const sessions_1 = require("./routes/sessions");
const jwt = require("jsonwebtoken");
const Database_1 = require("./db/Database");
/**
 *  ==========================
 *        SERVER CLASS
 *  ==========================
 */
/* Create the express and socket.io server */
class Server {
    constructor() {
        this.port = parseInt(process.env.PORT || "3000");
        this.initialize();
        this.registerRoutes();
        this.registerChannels();
    }
    /* Create server instances */
    initialize() {
        this.app = express();
        /* Add middlewares */
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.httpServer = http_1.createServer(this.app);
        this.io = new socket_io_1.Server(this.httpServer);
        this.matchMaking = new MatchMaking_1.default();
        this.rooms = {};
    }
    /* Handle all routes of the sever: Further route objects will be added on the way */
    registerRoutes() {
        /* Serve the static files of the Front-End application */
        this.app.use(express.static(path.join(__dirname, "..", "..", "client/build")));
        /**
         *  ============================
         *      REGISTER THE REST API
         *  ============================
         */
        new API_1.default(this.app);
        /**
         *  ===============================
         *     REGISTER THE SESSION API
         *  ===============================
         */
        new sessions_1.default(this.app);
        /* Map all other requests to the REACT app */
        this.app.get("/*", (req, res) => {
            res.sendFile(path.join(__dirname, "..", "..", "client/build/index.html"));
        });
    }
    /* Register message passing channels */
    registerChannels() {
        this.io.on("connection", (socket) => {
            console.log(`Socket id ${socket.id} has connected`);
            /* Patient queuing for matchmaking -> Uses token to get users data */
            socket.on(Channels_1.QUEUE_USER, (search) => __awaiter(this, void 0, void 0, function* () {
                let person;
                jwt.verify(search.token, process.env.secret, (err, decoded) => {
                    /* If there's an error with the session token */
                    if (err) {
                        socket.emit(Channels_1.QUEUE_ERROR, { message: "The token is invalid" });
                    }
                    /* Check whether the user is already in the queue */
                    if (!this.matchMaking.canQueue(decoded.id))
                        return;
                    /* Check whether it is a patient or a counselor */
                    if ("param" in search) {
                        person = {
                            socketid: socket.id,
                            peerid: search.peerid,
                            user: decoded,
                            param: search.param,
                            language: search.language,
                        };
                    }
                    else {
                        person = {
                            peerid: search.peerid,
                            socketid: socket.id,
                            user: decoded,
                            language: search.language,
                        };
                    }
                    /* Add patient to queue and look for a match */
                    const match = this.matchMaking.addPerson(person);
                    if (match)
                        this.communicateMatch(match);
                });
            }));
            /* Queue guest user with a random identifier as ID */
            socket.on(Channels_1.QUEUE_GUEST, (search) => {
                /* Create a temporary patient */
                const person = {
                    socketid: socket.id,
                    peerid: search.peerid,
                    user: {
                        id: null,
                        username: search.name,
                        email: null,
                        isAdmin: false,
                        mood: search.mood,
                    },
                    language: search.language,
                    param: search.param,
                };
                /* Add patient to queue and look for a match */
                const match = this.matchMaking.addPerson(person);
                if (match)
                    this.communicateMatch(match);
            });
            /* Enter Video Chat room -> Patient */
            socket.on(Channels_1.ENTER_ROOM, ({ roomid, peerid }) => __awaiter(this, void 0, void 0, function* () {
                if (this.rooms[roomid][1].peerid === peerid ||
                    this.rooms[roomid][0].peerid === peerid) {
                    socket.join(roomid);
                    socket.emit(Channels_1.SET_UP_CALL);
                }
                else {
                    socket.emit(Channels_1.ROOM_ERROR, {
                        code: 2,
                        message: "You may not belong to this room",
                    });
                    return;
                }
            }));
            /* User joined the call */
            socket.on(Channels_1.JOINED_CALL, ({ roomid, peerid }) => {
                console.log(`User ${peerid} joined the room`);
                /* Contact other sockets connected */
                socket.broadcast.emit(Channels_1.USER_CONNECTED, { peerid });
            });
            /* Connect to chat rooms */
            socket.on(Channels_1.CONNECT_TO_CHATS, ({ token }) => {
                /* Decode and verify token */
                jwt.verify(token, process.env.secret, (err, decoded) => {
                    if (err) {
                        socket.emit(Channels_1.CHAT_ERROR, { ok: false, message: "Invalid token" });
                        return;
                    }
                    if (!this.chatSockets[decoded.id])
                        this.chatSockets[decoded.id] = [];
                    this.chatSockets[decoded.id].push(socket.id);
                });
            });
            /* Sent a message */
            socket.on(Channels_1.CHAT_MESSAGE, (req) => __awaiter(this, void 0, void 0, function* () {
                /* Verify token */
                jwt.verify(req.token, process.env.secret, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        socket.emit(Channels_1.CHAT_ERROR, { ok: false, message: "Invalid token" });
                        return;
                    }
                    /* Store message in the db */
                    try {
                        yield Database_1.recordMessage(decoded.id, req.receiver_id, req.message);
                    }
                    catch (e) {
                        socket.emit(Channels_1.CHAT_ERROR, {
                            ok: false,
                            message: "Error recording the message in the db",
                        });
                        return;
                    }
                    socket
                        .to([
                        ...this.chatSockets[decoded.id],
                        ...this.chatSockets[req.receiver_id],
                    ])
                        .emit(Channels_1.NEW_MESSAGE, {
                        sender_id: decoded.id,
                        message: req.message,
                    });
                }));
            }));
            /* Handle a sudden disconnection */
            socket.on("disconnect", () => {
                /* Check if the socket belonged to any queue an remove it */
                this.matchMaking.removePerson(socket.id);
                /* Remove it from the chat sockets */
                const userid = Object.keys(this.chatSockets).find((key) => this.chatSockets[Number(key)].find((socketid) => socketid === socket.id));
                if (userid) {
                    const index = this.chatSockets[Number(userid)].findIndex((socketid) => socketid === socket.id);
                    this.chatSockets[Number(userid)].splice(index, 1);
                }
            });
        });
    }
    /* Create a socket room and communicate those sockets they're match */
    communicateMatch(match) {
        /* Create random unique Id for the socket room */
        const roomId = uuid_1.v4();
        this.rooms[roomId] = [
            { peerid: match[0].peerid, user: match[0].user },
            { peerid: match[1].peerid, user: match[1].user },
        ];
        /* Communicate room to sockets */
        this.io
            .to(match[0].socketid)
            .to(match[1].socketid)
            .emit(Channels_1.ROOM_FOUND, { roomId });
    }
    /* Start listening to requests */
    listen(callback) {
        this.httpServer.listen(this.port, () => {
            callback(this.port);
        });
    }
    /* Get socket.io server instance */
    getServer() {
        return this.io;
    }
}
exports.default = Server;
//# sourceMappingURL=Server.js.map