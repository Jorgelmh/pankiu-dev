"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiController_1 = require("./controllers/ApiController");
const AuthToken_1 = require("../middlewares/AuthToken");
/**
 *  ===================================
 *              API Routes
 *  ===================================
 */
class API {
  constructor(app) {
    this.app = app;
    this.registerRoutes();
  }
  /* Add the routes and controllers to the express server */
  registerRoutes() {
    /* Fetch chats for a given user */
    this.app.get(
      "/api/chats",
      AuthToken_1.AuthToken,
      ApiController_1.fetchChat
    );
    /* Get messages of a specific chat */
    this.app.get(
      "/api/messages/:uid",
      AuthToken_1.AuthToken,
      ApiController_1.fetchMessages
    );
    /* Change the mood of a patient on the database */
    this.app.post(
      "/api/changemood",
      AuthToken_1.AuthToken,
      ApiController_1.changeMood
    );
    /* Return random motivaltional phrase */
    this.app.get("/api/quotes", ApiController_1.fetchQuotes);
  }
}
exports.default = API;
//# sourceMappingURL=API.js.map
