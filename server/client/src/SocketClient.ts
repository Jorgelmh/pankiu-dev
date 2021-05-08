import socketIOClient, {Socket} from 'socket.io-client'
import { searchParam } from '../../interfaces/search/PatientSearch'
import { CONNECT_TO_ROOM, QUEUE_USER, ROOM_FOUND } from '../../sockets/Channels'

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
    public constructor(private redirectToRoom : (roomId: string) => void){
        this.socketIO = socketIOClient(this.ENDPOINT)
        this.handleMessages()
    }

    /**
     *  ==========================
     *        QUEUE PATIENT
     *  ==========================
     * 
     * @desc Sends a message to add user to the Matchmaking queue
     * @param Token {string} - JWT of the current user
     * @param searchParam {searchParam} - Either counselort_only or counselor_or_happy
     */
    public queuePatient(token: string, searchParam: searchParam) : void{
        this.socketIO.emit(QUEUE_USER, { token, searchParam })
    }

    /**
     *  ==========================
     *       QUEUE COUNSELOR
     *  ==========================
     *  @desc Sends a message to add user to the Matchmaking queue
     *  @param Token {string} - JWT of the user
     */
    public queueCounselor(token: string): void{
        this.socketIO.emit(QUEUE_USER, {token})
    }

    /* Set up socket listeners */
    public handleMessages(): void{

        /* When a room has been found */
        this.socketIO.on(ROOM_FOUND, ({roomId}) => {
            this.socketIO.emit(CONNECT_TO_ROOM, roomId)
            this.redirectToRoom(roomId)
        })
    }

    public getSocket() : Socket {
        return this.socketIO
    }
    
}