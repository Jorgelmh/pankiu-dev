import * as express from 'express'
import API from '../routes/API'
import Session from '../routes/sessions'
import { createServer, Server } from "http";
import * as request from 'supertest'
import { Patient, Counselor } from './seeds'
import PatientModel, { Mood } from '../interfaces/entities/Patient'
import { recordMessage } from '../db/Database'
import CounselorModel from '../interfaces/entities/Counselor';

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
let token: string
let counselorToken: string
let idCounselor: number
let idPatient: number

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

    test('Attempt to log in a patient', (done) => {

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
            const user: PatientModel = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
            idPatient = user.id
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
            university: Counselor.university,
            graduated: false
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeTruthy()
            counselorToken = response.body.token
            /* Store session token */
            const user: CounselorModel = JSON.parse(Buffer.from(counselorToken.split('.')[1], 'base64').toString())
            idCounselor = user.id
            done()
        })
    })
    
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
            expect(response.body.ok).toBeTruthy()
            done()
        })
    })

    /* Check that the friend request appears on the counselor's notification */
    test('Friend request appears on the notification feed', (done) => {

        request(app)
        .get('/api/notification')
        .set('token', counselorToken)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeTruthy()
            expect(response.body.requests.length).toBe(1)
            done()
        })
    })

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
            expect(response.body.ok).toBeTruthy()
            done()
        })

    })

})
