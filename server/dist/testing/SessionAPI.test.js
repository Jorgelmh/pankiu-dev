"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const sessions_1 = require("../routes/sessions");
const http_1 = require("http");
const request = require("supertest");
const seeds_1 = require("./seeds");
/**
 *  ====================================
 *        UNIT TESTING SESSION API
 *  ====================================
 *
 *  The aim of these tests is to check that the /session/ APi routes
 *  are successfully working
 */
/* Creating the driver app */
const app = express();
let server;
beforeAll((done) => {
    /* Setting env config variables */
    require('../config/remote');
    app.use(express.json());
    /* Registering API routes to test and creating server */
    new sessions_1.default(app);
    server = http_1.createServer(app);
    server.listen(3000, () => {
        console.log('Testing server listening on port 3000');
    });
    done();
});
/* Close servers and connections */
afterAll((done) => {
    server.close();
    done();
});
/* Record a new patient and check whether it fails when trying to add the same values again */
describe('POST /sessions/register -> Creating a patient user', () => {
    test('Record a new Patient', (done) => {
        /* Api request to register a new patient */
        request(app)
            .post('/sessions/register')
            .send(seeds_1.Patient)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            console.log(response.body);
            expect(response.body.ok).toBeDefined();
            done();
        });
    });
    test('Try to record the same patient', (done) => {
        /* Api request to register a new patient */
        request(app)
            .post('/sessions/register')
            .send(seeds_1.Patient)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            console.log(response.body);
            expect(response.body.ok).toBeFalsy();
            expect(response.body.message).toBe('Username already taken');
            done();
        });
    });
});
/* Add a counselor and try to record it again to check that an error message is returned */
describe('POST /sessions/register -> Creating a counselor user', () => {
    test('Record a new counselor', (done) => {
        /* Api request to register a new patient */
        request(app)
            .post('/sessions/register')
            .send(seeds_1.Counselor)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            console.log(response.body);
            expect(response.body.ok).toBeDefined();
            done();
        });
    });
    test('Try to record the same counselor', (done) => {
        /* Api request to register a new patient */
        request(app)
            .post('/sessions/register')
            .send(seeds_1.Counselor)
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            console.log(response.body);
            expect(response.body.ok).toBeFalsy();
            expect(response.body.message).toBe('Username already taken');
            done();
        });
    });
});
/* Test login credentials with the API */
describe('POST /sessions/login -> Loging in a patient and a counselor', () => {
    test('Log In a patient', (done) => {
        /* Api request to log in a Patient */
        request(app)
            .post('/sessions/login')
            .send({
            username: seeds_1.Patient.username,
            password: seeds_1.Patient.password
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            console.log(response.body);
            expect(response.body.ok).toBeTruthy();
            expect(response.body.token).toBeDefined();
            done();
        });
    });
    test('Log in a counselor', (done) => [
        /* Api request to log in a Counselor */
        request(app)
            .post('/sessions/login')
            .send({
            username: seeds_1.Counselor.username,
            password: seeds_1.Counselor.password
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(response => {
            console.log(response.body);
            expect(response.body.ok).toBeTruthy();
            expect(response.body.token).toBeDefined();
            done();
        })
    ]);
});
//# sourceMappingURL=SessionAPI.test.js.map