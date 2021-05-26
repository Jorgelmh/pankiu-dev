import Server from '../server'
import {io as Client, Socket} from 'socket.io-client'
import { QUEUE_USER, QUEUE_GUEST, ROOM_FOUND, ROOM_ERROR, QUEUE_ERROR, SET_UP_CALL, ENTER_ROOM, USER_CONNECTED, JOINED_CALL } from '../sockets/Channels'
import { v4 as uuidv4 } from "uuid"
import QueuePatient from '../interfaces/QueueParam/QueuePatient'
import { searchParam } from '../interfaces/search/PatientSearch'
import { Language } from '../interfaces/QueueParam/Language'
import QueueCounselor from '../interfaces/QueueParam/QueueCounselor'
import QueueGuest from '../interfaces/QueueParam/QueueGuest'
import { Mood } from '../interfaces/entities/Patient'

/**
 *  ===================================================
 *      UNIT TESTING SOCKET SERVER FOR MATCHMAKING
 *  ===================================================
 * 
 *  The aim of these tests is to check whether the server is carrying out
 *  the appropiate logic to queue a patient and find a match
 */

let patientSocket: Socket
let counselorSocket: Socket
let guestSocket: Socket
let server: Server
let roomid: string
let patientPeerId: string
let counselorPeerId: string

const patientToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJKb3JnZSIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwibW9vZCI6IkRlcHJlc3NlZCIsImlhdCI6MTYyMjAzNzgyMX0.QLg6QLGrvU7hM0ih5rZPq1RImFI-zuLLxHxygxwhZS8'
const counselorToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJEYW1pYW5kIiwiZW1haWwiOiJleGFtcGxlMkBlbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwicmF0ZSI6NSwiaWF0IjoxNjIyMDM4NDU2fQ.xjM7kKJn4FbJwD3Yufo8wF5OvaSxmcly8cNO6TonygQ'

/* Create the server instance and the client */
beforeAll((done) => {

    require('../config/remote')

    /* Create server */
    server = new Server()
    server.listen((port) => {

        console.log(`Socket Server listening in port: ${port}`)

        /* Create client sockets */
        patientSocket = Client(`http://localhost:${3000}`)
        counselorSocket = Client(`http://localhost:${3000}`)
        guestSocket = Client(`http://localhost:${3000}`)
        
        counselorSocket.on('connect', done)
    })
})

/* Close the client and the server */
afterAll((done) => {
    server.getServer().close()
    patientSocket.close()
    counselorSocket.close()
    done()
})

describe('Queue users and wait for a match', () => {

    test('Queue Patient - Counselor with unvalid tokens', (done) => {

        /* Send a request with an invalid token */
        patientSocket.on(QUEUE_ERROR, ({message}) => {
            expect(message).toBe('The token is invalid')
            done()
        })

        /* Prepare queue requests */
        const patientParams: QueuePatient = {
            token: '',
            peerid: uuidv4(),
            param: searchParam.only_counselor,
            language: [Language.English]
        }

        const counselorParams: QueueCounselor = {
            token: '',
            peerid: uuidv4(),
            language: [Language.English]
        }

        /* Queue a patient and a counselor */
        patientSocket.emit(QUEUE_USER, patientParams)
        counselorSocket.emit(QUEUE_USER, counselorParams)
    })

    test('Queue Patient - Counselor and expect a match', (done) => {

        /* Prepare listener beforehands */
        patientSocket.on(ROOM_FOUND, ({roomId}) => {
             /* Check that a roomid has been returned */
            expect(roomId).toBeDefined()

            roomid = roomId
            done()
        })

        patientPeerId = uuidv4()
        counselorPeerId = uuidv4()

        /* Prepare queue requests */
        const patientParams: QueuePatient = {
            token: patientToken,
            peerid: patientPeerId,
            param: searchParam.only_counselor,
            language: [Language.English]
        }

        const counselorParams: QueueCounselor = {
            token: counselorToken,
            peerid: counselorPeerId,
            language: [Language.English]
        }

        /* Queue a patient and a counselor */
        patientSocket.emit(QUEUE_USER, patientParams)
        counselorSocket.emit(QUEUE_USER, counselorParams)
    })
    
})

/* When users are assigned a roomid they are redirect to /:roomid -> there they
 have to ask for permission to enter the room */
describe('Allow to set up a video chat', () => {

    test('Enter room -> patient should be able to set up the call', (done) => {

        /* Prepare listener for SET_UP call */
        patientSocket.on(SET_UP_CALL, () => {
            done()
        })

        counselorSocket.emit(ENTER_ROOM, {roomid, peerid: counselorPeerId})
        patientSocket.emit(ENTER_ROOM, {roomid, peerid: patientPeerId})
    })

    /* When the video chat app has been set up the socket should notify this to 
       the other socket in the room so that they can initiate a call*/
    test('Joined the call -> communicate that it is ready to be called', (done) => {

        counselorSocket.on(USER_CONNECTED, ({peerid}) => {

            /* This should the peerid of the patient */
            expect(peerid).toBe(patientPeerId)
            done()
        })

        patientSocket.emit(JOINED_CALL, {roomid, peerid: patientPeerId})
    })
})

/* Test matching between guests and counselors */
describe('Match a Guest with a Counselor', () => {

    /* At this moment the queue should be empty */
    test('Find a Guest-Counselor match', (done) => {
        guestSocket.on(ROOM_FOUND, ({ roomId }) => {
            expect(roomId).toBeDefined()
            done()
        })

        /* Prepare queue requests */
        const guestParams: QueueGuest = {
            peerid: uuidv4(),
            name: 'Guest user',
            param: searchParam.only_counselor,
            mood: Mood.Depressed,
            language: [Language.English]
        }

        const counselorParams: QueueCounselor = {
            token: counselorToken,
            peerid: counselorPeerId,
            language: [Language.English]
        }

        /* Queue both users */
        guestSocket.emit(QUEUE_GUEST, guestParams)
        counselorSocket.emit(QUEUE_USER, counselorParams)
    })

})