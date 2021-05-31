"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const API_1 = require("../routes/API");
const sessions_1 = require("../routes/sessions");
const http_1 = require("http");
const request = require("supertest");
const seeds_1 = require("./seeds");
const Patient_1 = require("../interfaces/entities/Patient");
const Database_1 = require("../db/Database");
/**
 *  ==================================
 *       UNIT TESTING REST API
 *  ==================================
 *
 *  The aim of these tests is to check whether the API is correctly working
 */
/* Creating the driver app */
const app = express();
let server;
let token;
let counselorToken;
let idCounselor;
let idPatient;
/* Set up server */
beforeAll((done) => {
    /* Setting env config variables */
    require('../config/remote');
    app.use(express.json());
    /* Registering API routes for testing */
    new sessions_1.default(app);
    new API_1.default(app);
    server = http_1.createServer(app);
    server.listen(3000, () => {
        console.log('Testing server listening on port 3000');
    });
    done();
});
/* Close server connection */
afterAll((done) => {
    server.close();
    done();
});
/* Login and create a session token */
describe('POST /sessions/register -> Create a session', () => {
    test('Attempt to register a patient', (done) => {
        /* Api request to log in a patient and record a token */
        request(app)
            .post('/sessions/register')
            .send({
            username: `user_${Date.now()}`,
            password: '1234567',
            email: `${Date.now()}@example.com`,
            mood: Patient_1.Mood.Depressed
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            token = response.body.token;
            const user = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
            idPatient = user.id;
            done();
        });
    });
});
/* Use the token returned from the login attempt to consume the API */
describe('PUT /sessions/changemood -> update patients mood', () => {
    test('Attempt to change the mood with an unvalid token', (done) => {
        /* Api request to change the mood stored in the db */
        request(app)
            .put('/sessions/changemood')
            .set('token', 'sadsadasda')
            .send({
            mood: Patient_1.Mood.Happy
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeFalsy();
            expect(response.body.redirect).toBe('/login');
            done();
        });
    });
    test('Change the mood with a valid token', (done) => {
        /* Api request to change the mood stored in the db */
        request(app)
            .put('/sessions/changemood')
            .set('token', token)
            .send({
            mood: Patient_1.Mood.Happy
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            done();
        });
    });
});
/* Make a new friend in the app */
describe('POST /api/addfriends', () => {
    /* Create a new random counselor */
    test('Create a new counselor', (done) => {
        request(app)
            .post('/sessions/register')
            .send({
            username: `user_${Date.now()}`,
            password: '1234567',
            email: `${Date.now()}@example.com`,
            university: seeds_1.Counselor.university,
            graduated: false
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            counselorToken = response.body.token;
            /* Store session token */
            const user = JSON.parse(Buffer.from(counselorToken.split('.')[1], 'base64').toString());
            idCounselor = user.id;
            done();
        });
    });
    /* Send a friend request to the new counselor */
    test('Send a friend request to the new created counselor', (done) => {
        request(app)
            .post('/api/addfriends')
            .set('token', token)
            .send({
            uid: idCounselor
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            done();
        });
    });
    /* Check that the friend request appears on the counselor's notification */
    test('Friend request appears on the notification feed', (done) => {
        request(app)
            .get('/api/notification')
            .set('token', counselorToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            expect(response.body.requests.length).toBe(1);
            done();
        });
    });
    /* Accept the friend request */
    test('Accept the friend request', (done) => {
        request(app)
            .put('/api/acceptfriend')
            .set('token', counselorToken)
            .send({
            uid: idPatient
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            done();
        });
    });
});
/* Send a message to a friend */
describe('GET /api/messages/:uid -> Messages with new user', () => {
    /* Record a message on the db */
    test('Record a message in the chat', (done) => {
        Database_1.recordMessage(idPatient, idCounselor, 'Hello')
            .then(() => {
            done();
        });
    });
    /* Check the patient gets their message */
    test('Fetch message -> Patient', (done) => {
        request(app)
            .get(`/api/messages/${idCounselor}`)
            .set('token', token)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            expect(response.body.body.messages).toHaveLength(1);
            done();
        });
    });
    /* Check the counselor gets the patients message */
    test('Fetch message -> Counselor', (done) => {
        request(app)
            .get(`/api/messages/${idPatient}`)
            .set('token', counselorToken)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeTruthy();
            expect(response.body.body.messages).toHaveLength(1);
            done();
        });
    });
});
//# sourceMappingURL=RestAPI.test.js.map