"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const API_1 = require("../routes/API");
const sessions_1 = require("../routes/sessions");
const http_1 = require("http");
const request = require("supertest");
const seeds_1 = require("./seeds");
const Patient_1 = require("../interfaces/entities/Patient");
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
describe('POST /sessions/login -> Create a session', () => {
    test('Attempt to log in a patient', (done) => {
        /* Api request to log in a patient and record a token */
        request(app)
            .post('/sessions/login')
            .send({
            username: seeds_1.Patient.username,
            password: seeds_1.Patient.password
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            expect(response.body.ok).toBeDefined();
            token = response.body.token;
            done();
        });
    });
});
/* Use the token returned from the login attempt to consume the API */
describe('PUT /api/changemood -> update patients mood', () => {
    test('Attempt to change the mood with an unvalid token', (done) => {
        /* Api request to change the mood stored in the db */
        request(app)
            .put('/api/changemood')
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
            .put('/api/changemood')
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
//# sourceMappingURL=RestAPI.test.js.map