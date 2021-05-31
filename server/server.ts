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
import Patient from "./interfaces/entities/Patient";
import Counselor from "./interfaces/entities/Counselor";
import QueuePatient from "./interfaces/QueueParam/QueuePatient";
import QueueCounselor from "./interfaces/QueueParam/QueueCounselor";
import QueueGuest from "./interfaces/QueueParam/QueueGuest";
import {
  QUEUE_USER,
  ROOM_FOUND,
  ENTER_ROOM,
  QUEUE_GUEST,
  SET_UP_CALL,
  USER_CONNECTED,
  JOINED_CALL,
  ROOM_ERROR,
  QUEUE_ERROR,
  CHAT_MESSAGE,
  CHAT_ERROR,
  NEW_MESSAGE,
  CONNECT_TO_CHATS,
} from "./sockets/Channels";
import PatientSearch from "./interfaces/search/PatientSearch";
import API from "./routes/API";
import Session from "./routes/sessions";
import * as jwt from "jsonwebtoken";
import { recordMessage } from "./db/Database";
import SendMessage from "./interfaces/chats/SendMessage";

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
  private chatSockets: { [id: number]: string[] };
  private readonly port = parseInt(process.env.PORT || "3000");

  constructor() {
    this.initialize();
    this.registerRoutes();
    this.registerChannels();
  }

  /* Create server instances */
  private initialize(): void {
    this.app = express();

    /* Add middlewares */
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());

    this.httpServer = createServer(this.app);
    this.io = new SocketIOServer(this.httpServer);
    this.matchMaking = new MatchMaking();
    this.rooms = {};
    this.chatSockets = {}
  }

  /* Handle all routes of the sever: Further route objects will be added on the way */
  private registerRoutes(): void {
    /* Serve the static files of the Front-End application */
    this.app.use(
      express.static(path.join(__dirname, "..", "..", "client/build"))
    );

    /**
     *  ============================
     *      REGISTER THE REST API
     *  ============================
     */
    new API(this.app);

    /**
     *  ===============================
     *     REGISTER THE SESSION API
     *  ===============================
     */
    new Session(this.app);

    /* Map all other requests to the REACT app */
    this.app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "..", "..", "client/build/index.html"));
    });
  }

  /* Register message passing channels */
  private registerChannels(): void {
    this.io.on("connection", (socket) => {
      console.log(`Socket id ${socket.id} has connected`);

      /* Patient queuing for matchmaking -> Uses token to get users data */
      socket.on(QUEUE_USER, async (search: QueuePatient | QueueCounselor) => {

        let person: PersonSearch;
        jwt.verify(search.token, process.env.secret, (err, decoded: any) => {
          /* If there's an error with the session token */
          if (err) {
            return socket.emit(QUEUE_ERROR, { message: "The token is invalid" });
          }

          /* Check whether the user is already in the queue */
          if (!this.matchMaking.canQueue(decoded.id)) return;

          /* Check whether it is a patient or a counselor */
          if ("param" in search) {
            person = {
              socketid: socket.id,
              peerid: search.peerid,
              user: <Patient>decoded,
              param: search.param,
              language: search.language,
            };
          } else {
            person = {
              peerid: search.peerid,
              socketid: socket.id,
              user: <Counselor>decoded,
              language: search.language,
            };
          }

          /* Add patient to queue and look for a match */
          const match = this.matchMaking.addPerson(person);

          if (match) this.communicateMatch(match);
        });
      });

      /* Queue guest user with a random identifier as ID */
      socket.on(QUEUE_GUEST, (search: QueueGuest) => {
        /* Create a temporary patient */
        const person: PatientSearch = {
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
        if (match) this.communicateMatch(match);
      });

      /* Enter Video Chat room -> Patient */
      socket.on(ENTER_ROOM, async ({ roomid, peerid }) => {
        if (
          this.rooms[roomid][1].peerid === peerid ||
          this.rooms[roomid][0].peerid === peerid
        ) {
          socket.join(roomid);
          socket.emit(SET_UP_CALL);
        } else {
          socket.emit(ROOM_ERROR, {
            code: 2,
            message: "You may not belong to this room",
          });
          return;
        }
      });

      /* User joined the call */
      socket.on(JOINED_CALL, ({ peerid, roomid }) => {
        console.log(`User ${peerid} joined the room`);
        /* Contact other sockets connected */
        socket.broadcast.to(roomid).emit(USER_CONNECTED, { peerid });
      });

      /* Connect to chat rooms */
      socket.on(CONNECT_TO_CHATS, ({ token }) => {
        /* Decode and verify token */
        jwt.verify(token, process.env.secret, (err: any, decoded: any) => {
          if (err) {
            socket.emit(CHAT_ERROR, { ok: false, message: "Invalid token" });
            return;
          }

          if (!this.chatSockets[decoded.id]) this.chatSockets[decoded.id] = [];

          this.chatSockets[decoded.id].push(socket.id);
        });
      });

      /* Sent a message */
      socket.on(CHAT_MESSAGE, async (req: SendMessage) => {
        /* Verify token */
        jwt.verify(req.token, process.env.secret, async (err, decoded: any) => {
          if (err) {
            socket.emit(CHAT_ERROR, { ok: false, message: "Invalid token" });
            return;
          }
          /* Store message in the db */
          try {
            await recordMessage(decoded.id, req.receiver_id, req.message);
          } catch (e) {
            socket.emit(CHAT_ERROR, {
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
            .emit(NEW_MESSAGE, {
              sender_id: decoded.id,
              message: req.message,
            });
        });
      });

      /* Handle a sudden disconnection */
      socket.on("disconnect", () => {
        /* Check if the socket belonged to any queue an remove it */
        this.matchMaking.removePerson(socket.id);

        /* Remove it from the chat sockets */
        const userid = Object.keys(this.chatSockets).find((key: string) =>
          this.chatSockets[Number(key)].find(
            (socketid: string) => socketid === socket.id
          )
        );

        if (userid) {
          const index = this.chatSockets[Number(userid)].findIndex(
            (socketid: string) => socketid === socket.id
          );
          this.chatSockets[Number(userid)].splice(index, 1);
        }
      });
    });
  }

  /* Create a socket room and communicate those sockets they're match */
  private communicateMatch(match: Match): void {

    /* Create random unique Id for the socket room */
    const roomId = uuidv4();

    this.rooms[roomId] = [
      { peerid: match[0].peerid, user: match[0].user },
      { peerid: match[1].peerid, user: match[1].user },
    ];

    /* Communicate room to sockets */
    this.io
      .to(match[0].socketid)
      .to(match[1].socketid)
      .emit(ROOM_FOUND, { roomId });
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

  /* Get Express application instance */
  public getExpressApp(): Application{
    return this.app
  }
}
