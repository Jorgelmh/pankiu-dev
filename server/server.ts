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
import { CONNECT_TO_ROOM, QUEUE_USER, ROOM_FOUND } from "./sockets/Channels";

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

  private readonly port = 3000;

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
      console.log(`User ${socket.id} has connected to the room`);

      /* Patient queuing for matchmaking -> Uses token to get users data */
      socket.on(QUEUE_USER, async (search: QueuePatient | QueueCounselor) => {
        let person: PersonSearch;

        /* If it's got a param that means this is a patient queue request */
        if ("param" in search) {
          /* Decode and model the user */
          const user: Patient = await decodePatientJWT(search.token);
          person = {
            id: socket.id,
            user,
            param: search.param,
          };
        } else {
          const user: Counselor = await decodeCounselorJWT(search.token);
          person = {
            id: socket.id,
            user,
          };
        }

        /* Add patient to queue and look for a match */
        const match = this.matchMaking.addPerson(person);

        if (match) this.communicateMatch(match);
      });

      /* Add socket to a room */
      socket.on(CONNECT_TO_ROOM, (roomid: string) => {
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
  private communicateMatch(match: Match): void {
    /* Create random unique Id for the socket room */
    const roomId = uuidv4();
    this.rooms[roomId] = match;

    /* Communicate room to sockets */
    this.io.to(match[0].id).to(match[1].id).emit(ROOM_FOUND, { roomId });
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
