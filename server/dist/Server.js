"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
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
const AuthToken_1 = require("./middlewares/AuthToken");
const Channels_1 = require("./sockets/Channels");
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
    this.httpServer = http_1.createServer(this.app);
    this.io = new socket_io_1.Server(this.httpServer);
    this.matchMaking = new MatchMaking_1.default();
    this.rooms = {};
  }
  /* Handle all routes of the sever: Further route objects will be added on the way */
  registerRoutes() {
    /* Serve the static files of the Front-End application */
    this.app.use(express.static(path.join(__dirname, "../client/out")));
    /* Map all requests to the REACT app */
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/out/index.html"));
    });
  }
  /* Register message passing channels */
  registerChannels() {
    this.io.on("connection", (socket) => {
      console.log(`Socket id ${socket.id} has connected`);
      /* Patient queuing for matchmaking -> Uses token to get users data */
      socket.on(Channels_1.QUEUE_USER, (search) =>
        __awaiter(this, void 0, void 0, function* () {
          let person;
          /* If it's got a param that means this is a patient queue request */
          if ("param" in search) {
            /* Decode and model the user search */
            const user = yield AuthToken_1.decodePatientJWT(search.token);
            person = {
              socketid: socket.id,
              user,
              param: search.param,
              language: search.language,
            };
          } else {
            /* Model user search */
            const user = yield AuthToken_1.decodeCounselorJWT(search.token);
            person = {
              socketid: socket.id,
              user,
              language: search.language,
            };
          }
          /* Add patient to queue and look for a match */
          const match = this.matchMaking.addPerson(person);
          if (match) this.communicateMatch(match);
        })
      );
      /* Queue guest user with a random identifier as ID */
      socket.on(Channels_1.QUEUE_GUEST, (search) => {
        /* Create a temporary patient */
        const person = {
          socketid: socket.id,
          user: {
            id: search.id,
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
        if (match) this.communicateMatch(match);
      });
      /* Enter Video Chat room -> Patient */
      socket.on(Channels_1.ENTER_ROOM_PATIENT, ({ token, roomid, guestid }) =>
        __awaiter(this, void 0, void 0, function* () {
          /* Check the roomid exists */
          if (!this.rooms[roomid])
            socket.emit(Channels_1.ROOM_ERROR, {
              code: 1,
              message: "Room not found",
            });
          /* If a token is sent then treat it like an User */
          if (token) {
            const user = yield AuthToken_1.decodePatientJWT(token);
            /* Check the user belongs to the room */
            if (this.rooms[roomid][1].id === user.id) {
              socket.join(roomid);
              socket.emit(Channels_1.SET_UP_CALL, {
                id: this.rooms[roomid][0].id,
              });
            } else
              socket.emit(Channels_1.ROOM_ERROR, {
                code: 2,
                message: "You may not belong to this room",
              });
            return;
          }
          console.log(token, roomid, guestid);
          /* Then treat it like a guest */
          if (guestid) {
            if (this.rooms[roomid][1].id === guestid) {
              socket.join(roomid);
              socket.emit(Channels_1.SET_UP_CALL, {
                id: this.rooms[roomid][0].id,
              });
            } else
              socket.emit(Channels_1.ROOM_ERROR, {
                code: 2,
                message: "You may not belong to this room",
              });
            return;
          }
        })
      );
      /* Enter Video Chat room -> Counselor */
      socket.on(Channels_1.ENTER_ROOM_COUNSELOR, ({ token, roomid }) =>
        __awaiter(this, void 0, void 0, function* () {
          /* Model counselor */
          const user = yield AuthToken_1.decodeCounselorJWT(token);
          if (this.rooms[roomid][0].id === user.id) {
            socket.join(roomid);
            socket.emit(Channels_1.SET_UP_CALL, {
              id: this.rooms[roomid][1].id,
            });
          }
        })
      );
      /* User joined the call */
      socket.on(Channels_1.JOINED_CALL, ({ roomid, peerid }) => {
        /* Contact other sockets connected */
        socket.broadcast.emit(Channels_1.USER_CONNECTED, { peerid });
      });
    });
  }
  /* Create a socket room and communicate those sockets they're match */
  communicateMatch(match) {
    /* Create random unique Id for the socket room */
    const roomId = uuid_1.v4();
    this.rooms[roomId] = [match[0].user, match[1].user];
    /* Communicate room to sockets */
    this.io
      .to(match[0].socketid)
      .to(match[1].socketid)
      .emit(Channels_1.ROOM_FOUND, { roomId, room: this.rooms[roomId] });
    console.log(this.rooms[roomId]);
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
