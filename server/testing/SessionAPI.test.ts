import * as express from 'express'
import Session from '../routes/sessions'
import { createServer, Server } from "http";
import * as request from 'supertest'
import { Patient, Counselor } from './seeds'

/**
 *  ====================================
 *        UNIT TESTING SESSION API
 *  ====================================
 * 
 *  The aim of these tests is to check that the /session/ APi routes
 *  are successfully working
 */

/* Creating the driver app */
const app = express()
let server: Server

beforeAll((done) => {
    
    /* Setting env config variables */
    require('../config/remote')
    app.use(express.json())

    /* Registering API routes to test and creating server */
    new Session(app)
    server = createServer(app)
    server.listen(3000, () => {
        console.log('Testing server listening on port 3000')
    })

    done()
})

/* Close servers and connections */
afterAll((done) => {
    server.close()
    done()
})

/* Record a new patient and check whether it fails when trying to add the same values again */
describe('POST /sessions/register -> Creating a patient user', () => {

    test('Record a new Patient', (done) => {

        /* Api request to register a new patient */
        request(app)
        .post('/sessions/register')
        .send(Patient)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            console.log(response.body)
            expect(response.body.ok).toBeDefined()
            done()
        })
    })

    test('Try to record the same patient', (done) => {
        /* Api request to register a new patient */
        request(app)
        .post('/sessions/register')
        .send(Patient)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            console.log(response.body)
            expect(response.body.ok).toBeFalsy()
            expect(response.body.message).toBe('Username already taken')
            done()
        })
    })
})

/* Add a counselor and try to record it again to check that an error message is returned */
describe('POST /sessions/register -> Creating a counselor user', () => {

    test('Record a new counselor', (done) => {
        /* Api request to register a new patient */
        request(app)
        .post('/sessions/register')
        .send(Counselor)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            console.log(response.body)
            expect(response.body.ok).toBeDefined()
            done()
        })
    })

    test('Try to record the same counselor', (done) => {
        /* Api request to register a new patient */
        request(app)
        .post('/sessions/register')
        .send(Counselor)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            console.log(response.body)
            expect(response.body.ok).toBeFalsy()
            expect(response.body.message).toBe('Username already taken')
            done()
        })
    })
})

/* Test login credentials with the API */
describe('POST /sessions/login -> Loging in a patient and a counselor', () => {

    test('Log In a patient', (done) => {
        /* Api request to log in a Patient */
        request(app)
        .post('/sessions/login')
        .send({
            username: Patient.username,
            password: Patient.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            console.log(response.body)
            expect(response.body.ok).toBeTruthy()
            expect(response.body.token).toBeDefined()
            done()
        })
    })

    test('Log in a counselor', (done) => [
        /* Api request to log in a Counselor */
        request(app)
        .post('/sessions/login')
        .send({
            username: Counselor.username,
            password: Counselor.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            console.log(response.body)
            expect(response.body.ok).toBeTruthy()
            expect(response.body.token).toBeDefined()
            done()
        })
    ])
})