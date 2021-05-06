import * as express from 'express'
import * as path from 'path'
import {Application} from 'express'
import {createServer, Server as HTTPServer} from 'http'

/**
 *  ==========================
 *        SERVER OBJECT
 *  ==========================
 */
/* Creates the express server that will contain the logic of the system */
export default class Server{
    private httpServer: HTTPServer
    private app: Application

    private readonly port = 3000

    constructor(){
        this.initialize()
        this.registerRoutes()
    }

    /* Create server instances */
    private initialize():void{
        this.app = express()
        this.httpServer = createServer(this.app)
    }

    /* Handle all routes of the sever: Further route objects will be added on the way */
    private registerRoutes(): void{

        /* Serve the static files of the Front-End application */
        this.app.use(express.static(path.join(__dirname, 'client/build')))

        /* Map all requests that don't match with the REACTJS APP */
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname + '/client/build/index.html'))
        })
    }

    /* Start listening to requests */
    public listen(callback: (port: number) => void): void{
        this.httpServer.listen(this.port, () => {
            callback(this.port)
        })
    }
}

