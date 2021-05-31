import * as express from 'express'
import Session from '../routes/sessions'
import { createServer, Server } from "http";
import * as request from 'supertest'
import { Patient, Counselor } from './seeds'
import PatientModel, { Mood } from '../interfaces/entities/Patient';

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
let token: string

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
            expect(response.body.ok).toBeTruthy()
            expect(response.body.token).toBeDefined()
            console.log(response.body.token)
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
            expect(response.body.ok).toBeTruthy()
            expect(response.body.token).toBeDefined()
            console.log(response.body.token)
            done()
        })
    ])
})

/* Test update username, password and email of a new user */
describe('PUT /sessions/update -> Modify random unique users', () => {

    /* Create a new random patient */
    test('Create a new random an unique Patient', (done) => {

        request(app)
        .post('/sessions/register')
        .send({
            username: `user_${Date.now()}`,
            password: '1234567',
            email: `${Date.now()}@example.com`,
            mood: Mood.Depressed
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeTruthy()
            /* Store session token */
            token = response.body.token
            done()
        })
    })

    /* Try to change the new patient's username */
    test('Try to change the username to an already existing one', (done) => {

        request(app)
        .put('/sessions/update')
        .set('token', token)
        .send({
            username: Patient.username
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeFalsy()
            expect(response.body.message).toBe('An error has occurred while changing your username, probably the new username is already taken')
            done()
        })
    })

    /* Try to change the new patient's email */
    test('Try to change the email to an already existing one', (done) => {

        request(app)
        .put('/sessions/update')
        .set('token', token)
        .send({
            email: Patient.email
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeFalsy()
            expect(response.body.message).toBe('An error has occurred while changing your email, probably the new email is already taken')
            done()
        })

    })

    /**
     *  =============================
     *      USE VALID VALUES 
     *  =============================
     */
    
    test('Change username, password and email for new unique values', (done) => {

        /* New values */
        const newPayload = {
            username: `user_${Date.now()}`,
            password: `12345678`,
            email: `${Date.now()}@example.com`
        }

        request(app)
        .put('/sessions/update')
        .set('token', token)
        .send(newPayload)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(response => {
            expect(response.body.ok).toBeTruthy()
            const user: PatientModel = JSON.parse(Buffer.from(response.body.token.split('.')[1], 'base64').toString())
            expect(user.username).toBe(newPayload.username)
            expect(user.email).toBe(newPayload.email)
            expect(user.id).toBeDefined()
            done()
        })
    })

})