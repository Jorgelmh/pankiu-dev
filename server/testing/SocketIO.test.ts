import Server from '../Server'
import SocketClient from '../client/src/SocketClient'
import { searchParam } from '../interfaces/search/PatientSearch'
import { Server as SocketIOServer } from "socket.io"
import { CONNECT_TO_ROOM, QUEUE_USER, ROOM_FOUND } from '../sockets/Channels'
import QueuePatient from '../interfaces/QueueParam/QueuePatient'
import QueueCounselor from '../interfaces/QueueParam/QueueCounselor'

/**
 *  ====================================
 *        TEST SOCKET.IO SERVER
 *  ====================================
 */

describe("Tests Socket.io server", () => {

    let server: Server, client: SocketClient, ioServer: SocketIOServer 

    /* Create server and client instances */
    beforeAll(( done ) => {
        const redirect = (roomId: string) => console.log(roomId)

        server = new Server()

        server.listen(() => {
            client = new SocketClient(redirect)
            ioServer = server.getServer()
    
            /* Wait until the client has been connected */
            client.getSocket().on('connection', done)
        })  
    })

    /* Close server and client */
    afterAll(() => {
        server.getServer().close()
        client.getSocket().close()
    })

    test('Add client to queue', (done) => {

        const JWTtoken = 'randomtoken123'

        /* Check the message has been received */
        ioServer.on('connection', (socket) => {
            socket.on(QUEUE_USER, (search: QueuePatient | QueueCounselor) => {
                expect(search.token).toBe(JWTtoken)
                done()
            })
        })

        /* Add client to pacient queue */
        client.queuePatient(JWTtoken, searchParam.counselor_or_happy)
    })
})
