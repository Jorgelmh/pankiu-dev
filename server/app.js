"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
/* Create server instance */
const server = new server_1.default();
server.listen((port) => {
    console.log(`Server running on port: ${port}`);
});
//# sourceMappingURL=app.js.map