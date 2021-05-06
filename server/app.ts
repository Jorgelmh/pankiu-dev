import Server from './server'

/* Create server instance */
const server = new Server()

server.listen((port: number) => {
    console.log(`Server running on port: ${port}`)
})