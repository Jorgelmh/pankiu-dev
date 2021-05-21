import Server from "./Server";

/* Load configs */
require("./config/remote");

/* Create server instance */
const server = new Server();

server.listen((port: number) => {
  console.log(`Server running on port: ${port}`);
});
