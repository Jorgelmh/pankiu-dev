import socketIOClient, {Socket} from 'socket.io-client'

/**
 *  =========================================
 *     IMPLEMENTATION OF SOCKET.IO CLIENT
 *  =========================================
 */
/* Use it to implement the logic that sends messages to the server */
export default class SocketClient{

    /* Socket.io server address */
    private readonly ENDPOINT = 'http://127.0.0.1:3000/'
    private socketIO : Socket

    /* Creates and initializes a socket */
    public constructor(){
        this.socketIO = socketIOClient(this.ENDPOINT)
    }

    
}