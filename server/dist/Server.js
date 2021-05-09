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
    this.matchMaking = new MatchMaking_1.default();
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
      console.log(`User ${socket.id} has connected to the room`);
      /* Patient queuing for matchmaking -> Uses token to get users data */
      socket.on(Channels_1.QUEUE_USER, (search) =>
        __awaiter(this, void 0, void 0, function* () {
          let person;
          /* If it's got a param that means this is a patient queue request */
          if ("param" in search) {
            /* Decode and model the user */
            const user = yield AuthToken_1.decodePatientJWT(search.token);
            person = {
              id: socket.id,
              user,
              param: search.param,
            };
          } else {
            const user = yield AuthToken_1.decodeCounselorJWT(search.token);
            person = {
              id: socket.id,
              user,
            };
          }
          /* Add patient to queue and look for a match */
          const match = this.matchMaking.addPerson(person);
          if (match) this.communicateMatch(match);
        })
      );
      /* Add socket to a room */
      socket.on(Channels_1.CONNECT_TO_ROOM, (roomid) => {
        /* Check that the user belongs to here */
        if (
          this.rooms[roomid][0].id === socket.id ||
          this.rooms[roomid][1].id === socket.id
        )
          socket.join(roomid);
      });
    });
  }
  /* Create a socket room and communicate those sockets they're match */
  communicateMatch(match) {
    /* Create random unique Id for the socket room */
    const roomId = uuid_1.v4();
    this.rooms[roomId] = match;
    /* Communicate room to sockets */
    this.io
      .to(match[0].id)
      .to(match[1].id)
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
