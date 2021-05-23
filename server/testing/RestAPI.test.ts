import * as express from 'express'
import API from '../routes/API'
import Session from '../routes/sessions'
import { createServer, Server } from "http";
import * as request from 'supertest'
import { Patient, Counselor } from './seeds'
import { Mood } from '../interfaces/entities/Patient'

/**
 *  ==================================
 *       UNIT TESTING REST API
 *  ==================================
 * 
 *  The aim of these tests is to check whether the API is correctly working
 */

/* Creating the driver app */
const app = express()
let server: Server
let token:string

/* Set up server */
beforeAll((done) => {

    /* Setting env config variables */
    require('../config/remote')
    app.use(express.json())

    /* Registering API routes for testing */
    new Session(app)
    new API(app)

    server = createServer(app)
    server.listen(3000, () => {
        console.log('Testing server listening on port 3000')
    })
    done()
})

/* Close server connection */
afterAll((done) => {
    server.close()
    done()
})

/* Login and create a session token */
describe('POST /sessions/login -> Create a session', () => {

    test('Attemp to log in a patient', (done) => {

        /* Api request to log in a patient and record a token */
        request(app)
        .post('/sessions/login')
        .send({
            username: Patient.username,
            password: Patient.password
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeDefined()
            token = response.body.token
            done()
        })
    })
})

/* Use the token returned from the login attempt to consume the API */
describe('PUT /api/changemood -> update patients mood' , () => {

    test('Attempt to change the mood with an unvalid token', (done) => {

        /* Api request to change the mood stored in the db */
        request(app)
        .put('/api/changemood')
        .set('token', 'sadsadasda')
        .send({
            mood: Mood.Happy
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeFalsy()
            expect(response.body.redirect).toBe('/login')
            done()
        })
    })

    test('Change the mood with a valid token', (done) => {

        /* Api request to change the mood stored in the db */
        request(app)
        .put('/api/changemood')
        .set('token', token)
        .send({
            mood: Mood.Happy
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeTruthy()
            done()
        })
    })
})