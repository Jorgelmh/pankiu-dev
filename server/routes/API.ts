import { Application } from "express";
import {
  fetchChat,
  fetchMessages,
  changeMood,
  fetchQuotes,
  addFriends,
  fetchNotifications,
  acceptFriend,
} from "./controllers/ApiController";
import { AuthToken } from "../middlewares/AuthToken";

/**
 *  ===================================
 *              API Routes
 *  ===================================
 */
export default class API {
  constructor(private app: Application) {
    this.registerRoutes();
  }

  /* Add the routes and controllers to the express server */
  private registerRoutes(): void {
    /* Fetch chats for a given user */
    this.app.get("/api/chats", AuthToken, fetchChat);

    /* Get messages of a specific chat */
    this.app.get("/api/messages/:uid", AuthToken, fetchMessages);

    /* Change the mood of a patient on the database */
    this.app.put("/api/changemood", AuthToken, changeMood);

    /* Return random motivaltional phrase */
    this.app.get("/api/quotes", fetchQuotes);

    /* Add friends */
    this.app.post("/api/addfriends", AuthToken, addFriends);

    /* Fetch notifications */
    this.app.get("/api/notification", AuthToken, fetchNotifications);

    /* Accept a friend request */
    this.app.put("/api/acceptfriend", AuthToken, acceptFriend);
  }
}
