"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const socket_io_client_1 = require("socket.io-client");
const Channels_1 = require("../sockets/Channels");
const uuid_1 = require("uuid");
const PatientSearch_1 = require("../interfaces/search/PatientSearch");
const Language_1 = require("../interfaces/QueueParam/Language");
const Patient_1 = require("../interfaces/entities/Patient");
/**
 *  ===================================================
 *      UNIT TESTING SOCKET SERVER FOR MATCHMAKING
 *  ===================================================
 *
 *  The aim of these tests is to check whether the server is carrying out
 *  the appropiate logic to queue a patient and find a match
 */
let patientSocket;
let counselorSocket;
let guestSocket;
let server;
let roomid;
let patientPeerId;
let counselorPeerId;
const patientToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJKb3JnZSIsImVtYWlsIjoiZXhhbXBsZUBlbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwibW9vZCI6IkRlcHJlc3NlZCIsImlhdCI6MTYyMjQ4MTI0Mn0.-cJtSVzOI02g_Sp5BZSyIAIWhgo4OoRvf_IXjVsbMlQ';
const counselorToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJEYW1pYW5kIiwiZW1haWwiOiJleGFtcGxlMkBlbWFpbC5jb20iLCJpc0FkbWluIjpmYWxzZSwicmF0ZSI6NSwiaWF0IjoxNjIyNDgxMDU4fQ.yqBJH_VqXqFB1vgebtkt5fmLsDyVw-5xp9HLzwck1EA';
/* Create the server instance and the client */
beforeAll((done) => {
    require('../config/remote');
    /* Create server */
    server = new server_1.default();
    server.listen((port) => {
        console.log(`Socket Server listening in port: ${port}`);
        /* Create client sockets */
        patientSocket = socket_io_client_1.io(`http://localhost:${3000}`);
        counselorSocket = socket_io_client_1.io(`http://localhost:${3000}`);
        guestSocket = socket_io_client_1.io(`http://localhost:${3000}`);
        counselorSocket.on('connect', done);
    });
});
/* Close the client and the server */
afterAll((done) => {
    server.getServer().close();
    patientSocket.close();
    counselorSocket.close();
    done();
});
describe('Queue users and wait for a match', () => {
    test('Queue Patient - Counselor with unvalid tokens', (done) => {
        /* Send a request with an invalid token */
        patientSocket.on(Channels_1.QUEUE_ERROR, ({ message }) => {
            expect(message).toBe('The token is invalid');
            done();
        });
        /* Prepare queue requests */
        const patientParams = {
            token: '',
            peerid: uuid_1.v4(),
            param: PatientSearch_1.searchParam.only_counselor,
            language: [Language_1.Language.English]
        };
        const counselorParams = {
            token: '',
            peerid: uuid_1.v4(),
            language: [Language_1.Language.English]
        };
        /* Queue a patient and a counselor */
        patientSocket.emit(Channels_1.QUEUE_USER, patientParams);
        counselorSocket.emit(Channels_1.QUEUE_USER, counselorParams);
    });
    test('Queue Patient - Counselor and expect a match', (done) => {
        /* Prepare listener beforehands */
        patientSocket.on(Channels_1.ROOM_FOUND, ({ roomId }) => {
            /* Check that a roomid has been returned */
            expect(roomId).toBeDefined();
            roomid = roomId;
            done();
        });
        patientPeerId = uuid_1.v4();
        counselorPeerId = uuid_1.v4();
        /* Prepare queue requests */
        const patientParams = {
            token: patientToken,
            peerid: patientPeerId,
            param: PatientSearch_1.searchParam.only_counselor,
            language: [Language_1.Language.English]
        };
        const counselorParams = {
            token: counselorToken,
            peerid: counselorPeerId,
            language: [Language_1.Language.English]
        };
        /* Queue a patient and a counselor */
        patientSocket.emit(Channels_1.QUEUE_USER, patientParams);
        counselorSocket.emit(Channels_1.QUEUE_USER, counselorParams);
    });
});
/* When users are assigned a roomid they are redirect to /:roomid -> there they
 have to ask for permission to enter the room */
describe('Allow to set up a video chat', () => {
    test('Enter room -> patient should be able to set up the call', (done) => {
        /* Prepare listener for SET_UP call */
        patientSocket.on(Channels_1.SET_UP_CALL, () => {
            done();
        });
        counselorSocket.emit(Channels_1.ENTER_ROOM, { roomid, peerid: counselorPeerId });
        patientSocket.emit(Channels_1.ENTER_ROOM, { roomid, peerid: patientPeerId });
    });
    /* When the video chat app has been set up the socket should notify this to
       the other socket in the room so that they can initiate a call*/
    test('Joined the call -> communicate that it is ready to be called', (done) => {
        counselorSocket.on(Channels_1.USER_CONNECTED, ({ peerid }) => {
            /* This should the peerid of the patient */
            expect(peerid).toBe(patientPeerId);
            done();
        });
        patientSocket.emit(Channels_1.JOINED_CALL, { roomid, peerid: patientPeerId });
    });
});
/* Test matching between guests and counselors */
describe('Match a Guest with a Counselor', () => {
    /* At this moment the queue should be empty */
    test('Find a Guest-Counselor match', (done) => {
        guestSocket.on(Channels_1.ROOM_FOUND, ({ roomId }) => {
            expect(roomId).toBeDefined();
            done();
        });
        /* Prepare queue requests */
        const guestParams = {
            peerid: uuid_1.v4(),
            name: 'Guest user',
            param: PatientSearch_1.searchParam.only_counselor,
            mood: Patient_1.Mood.Depressed,
            language: [Language_1.Language.English]
        };
        const counselorParams = {
            token: counselorToken,
            peerid: counselorPeerId,
            language: [Language_1.Language.English]
        };
        /* Queue both users */
        guestSocket.emit(Channels_1.QUEUE_GUEST, guestParams);
        counselorSocket.emit(Channels_1.QUEUE_USER, counselorParams);
    });
});
//# sourceMappingURL=SocketMM.test.js.map