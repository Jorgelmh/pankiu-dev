"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthToken_1 = require("../middlewares/AuthToken");
const SessionController_1 = require("./controllers/SessionController");
/**
 *  ========================
 *       SESSION API
 *  ========================
 */
class Session {
    constructor(app) {
        this.app = app;
        this.registerRoutes();
    }
    registerRoutes() {
        /* Register a new user */
        this.app.post("/sessions/register", SessionController_1.register);
        /* Login a suer and return a session */
        this.app.post("/sessions/login", SessionController_1.login);
        /* Authenticate a token */
        this.app.get("/sessions/validate", AuthToken_1.AuthToken);
        /* Update user's information */
        this.app.post("/sessions/update", AuthToken_1.AuthToken, SessionController_1.updateDetails);
    }
}
exports.default = Session;
//# sourceMappingURL=sessions.js.map