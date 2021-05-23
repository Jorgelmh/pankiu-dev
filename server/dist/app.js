"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Server_1 = require("./Server");
/* Load configs */
require("./config/remote");
/* Create server instance */
const server = new Server_1.default();
server.listen((port) => {
    console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=app.js.map