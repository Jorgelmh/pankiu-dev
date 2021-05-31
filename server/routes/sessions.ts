import { Application } from "express";
import { AuthToken } from "../middlewares/AuthToken";
import {
  register,
  login,
  updateDetails,
  changeMood
} from "./controllers/SessionController";

/**
 *  ========================
 *       SESSION API
 *  ========================
 */
export default class Session {
  constructor(private app: Application) {
    this.registerRoutes();
  }

  private registerRoutes(): void {
    /* Register a new user */
    this.app.post("/sessions/register", register);

    /* Login a suer and return a session */
    this.app.post("/sessions/login", login);

    /* Authenticate a token */
    this.app.get("/sessions/validate", AuthToken);

    /* Update user's information */
    this.app.put("/sessions/update", AuthToken, updateDetails);

    /* Change the mood of a patient on the database */
    this.app.put("/sessions/changemood", AuthToken, changeMood);
  }
}
