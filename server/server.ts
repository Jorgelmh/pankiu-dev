import * as express from "express";
import * as path from "path";
import { Application } from "express";
import { createServer, Server as HTTPServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import MatchMaking from "./matchmaking/MatchMaking";
import { PersonSearch } from "./interfaces/search/PersonSearch";
import SocketRoom from "./interfaces/SocketRoom";
import { v4 as uuidv4 } from "uuid";
import { Match } from "./interfaces/Match";
import { decodePatientJWT, decodeCounselorJWT } from "./middlewares/AuthToken";
import Patient from "./interfaces/entities/Patient";
import Counselor from "./interfaces/entities/Counselor";
import QueuePatient from "./interfaces/QueueParam/QueuePatient";
import QueueCounselor from "./interfaces/QueueParam/QueueCounselor";
import QueueGuest from "./interfaces/QueueParam/QueueGuest";
import {
  QUEUE_USER,
  ROOM_FOUND,
  ENTER_ROOM_PATIENT,
  ENTER_ROOM_COUNSELOR,
  QUEUE_GUEST,
  SET_UP_CALL,
  USER_CONNECTED,
  JOINED_CALL,
  ROOM_ERROR,
} from "./sockets/Channels";
import PatientSearch, { searchParam } from "./interfaces/search/PatientSearch";

/**
 *  ==========================
 *        SERVER CLASS
 *  ==========================
 */
/* Create the express and socket.io server */
export default class Server {
  private httpServer: HTTPServer;
  private app: Application;
  private io: SocketIOServer;
  private matchMaking: MatchMaking;
  private rooms: SocketRoom;
  private readonly port = parseInt(process.env.PORT || "3000");

  constructor() {
    this.initialize();
    this.registerRoutes();
    this.registerChannels();
  }

  /* Create server instances */
  private initialize(): void {
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);
    this.matchMaking = new MatchMaking();
    this.rooms = {};
  }

  /* Handle all routes of the sever: Further route objects will be added on the way */
  private registerRoutes(): void {
    /* Serve the static files of the Front-End application */
    this.app.use(express.static(path.join(__dirname, "../client/out")));

    /* Map all requests to the REACT app */
    this.app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../client/out/index.html"));
    });
  }

  /* Register message passing channels */
  private registerChannels(): void {
    this.io.on("connection", (socket) => {
      console.log(`Socket id ${socket.id} has connected`);

      /* Patient queuing for matchmaking -> Uses token to get users data */
      socket.on(QUEUE_USER, async (search: QueuePatient | QueueCounselor) => {
        let person: PersonSearch;

        /* If it's got a param that means this is a patient queue request */
        if ("param" in search) {
          /* Decode and model the user search */
          const user: Patient = await decodePatientJWT(search.token);
          person = {
            socketid: socket.id,
            user,
            param: search.param,
            language: search.language,
          };
        } else {
          /* Model user search */
          const user: Counselor = await decodeCounselorJWT(search.token);
          person = {
            socketid: socket.id,
            user,
            language: search.language,
          };
        }

        /* Add patient to queue and look for a match */
        const match = this.matchMaking.addPerson(person);

        if (match) this.communicateMatch(match);
      });

      /* Queue guest user with a random identifier as ID */
      socket.on(QUEUE_GUEST, (search: QueueGuest) => {
        /* Create a temporary patient */
        const person: PatientSearch = {
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
      socket.on(ENTER_ROOM_PATIENT, async ({ token, roomid, guestid }) => {
        /* Check the roomid exists */
        if (!this.rooms[roomid])
          socket.emit(ROOM_ERROR, { code: 1, message: "Room not found" });
        /* If a token is sent then treat it like an User */
        if (token) {
          const user = await decodePatientJWT(token);

          /* Check the user belongs to the room */
          if (this.rooms[roomid][1].id === user.id) {
            socket.join(roomid);
            socket.emit(SET_UP_CALL, { id: this.rooms[roomid][0].id });
          } else
            socket.emit(ROOM_ERROR, {
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
            socket.emit(SET_UP_CALL, { id: this.rooms[roomid][0].id });
          } else
            socket.emit(ROOM_ERROR, {
              code: 2,
              message: "You may not belong to this room",
            });
          return;
        }
      });

      /* Enter Video Chat room -> Counselor */
      socket.on(ENTER_ROOM_COUNSELOR, async ({ token, roomid }) => {
        /* Model counselor */
        const user = await decodeCounselorJWT(token);
        if (this.rooms[roomid][0].id === user.id) {
          socket.join(roomid);
          socket.emit(SET_UP_CALL, { id: this.rooms[roomid][1].id });
        }
      });

      /* User joined the call */
      socket.on(JOINED_CALL, ({ roomid, peerid }) => {
        /* Contact other sockets connected */
        socket.broadcast.emit(USER_CONNECTED, { peerid });
      });
    });
  }

  /* Create a socket room and communicate those sockets they're match */
  private communicateMatch(match: Match): void {
    /* Create random unique Id for the socket room */
    const roomId = uuidv4();
    this.rooms[roomId] = [match[0].user, match[1].user];

    /* Communicate room to sockets */
    this.io
      .to(match[0].socketid)
      .to(match[1].socketid)
      .emit(ROOM_FOUND, { roomId, room: this.rooms[roomId] });

    console.log(this.rooms[roomId]);
  }

  /* Start listening to requests */
  public listen(callback: (port: number) => void): void {
    this.httpServer.listen(this.port, () => {
      callback(this.port);
    });
  }

  /* Get socket.io server instance */
  public getServer(): SocketIOServer {
    return this.io;
  }
}
