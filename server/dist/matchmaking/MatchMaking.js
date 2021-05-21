"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = require("./Queue");
const PatientSearch_1 = require("../interfaces/search/PatientSearch");
const Patient_1 = require("../interfaces/entities/Patient");
const Language_1 = require("../interfaces/QueueParam/Language");
/**
 *  ==============================
 *       MATCHMAKING SYSTEM
 *  ==============================
 */
/* This class will manage the queue and search for matches before entering a chat room */
class MatchMaking {
    constructor() {
        /* Start empty queues */
        this.patientsQueue = new Queue_1.default();
        this.counselorsQueue = new Queue_1.default();
    }
    /* Add person to their correspondent queue */
    addPerson(person) {
        /* Check if the person is a patient */
        if ("param" in person) {
            this.patientsQueue.queue(person);
            /* Search for matches between patients first */
            const matchTwoPatients = this.searchPatientsMatch();
            if (matchTwoPatients)
                return matchTwoPatients;
        }
        else
            this.counselorsQueue.queue(person);
        /* Now, search for matches with counselors */
        const matchCounselorPatient = this.searchMatch();
        return matchCounselorPatient;
    }
    /* Search the patients queue for a match between the oldest happy and not happy  */
    searchPatientsMatch() {
        /* Search by language */
        const matchEnglish = this.findMatchLanguage(Language_1.Language.English);
        if (matchEnglish)
            return matchEnglish;
        const matchSpanish = this.findMatchLanguage(Language_1.Language.Spanish);
        if (matchSpanish)
            return matchSpanish;
        /* Match not found */
        return null;
    }
    /* Find match per language */
    findMatchLanguage(language) {
        /* Find both categories that are needed to match together */
        const happy = this.patientsQueue
            .getCollection()
            .find((person) => person.user.mood == Patient_1.Mood.Happy && person.language.indexOf(language));
        const notHappy = this.patientsQueue
            .getCollection()
            .find((person) => person.user.mood != Patient_1.Mood.Happy &&
            person.param == PatientSearch_1.searchParam.counselor_or_happy &&
            person.language.indexOf(language));
        if (happy && notHappy) {
            /* Remove people match from the queue */
            const happyIndex = this.patientsQueue
                .getCollection()
                .findIndex(({ user }) => user.id === happy.user.id);
            this.patientsQueue.getCollection().splice(happyIndex, 1);
            const notHappyIndex = this.patientsQueue
                .getCollection()
                .findIndex(({ user }) => user.id === notHappy.user.id);
            this.patientsQueue.getCollection().splice(notHappyIndex, 1);
            return [happy, notHappy];
        }
        /* Match not found */
        return null;
    }
    /* Seach for match between counselor and patients */
    searchMatch() {
        const englishCounselor = this.counselorsQueue
            .getCollection()
            .findIndex((counselor) => counselor.language.indexOf(Language_1.Language.English));
        const englishPatient = this.patientsQueue
            .getCollection()
            .findIndex((patient) => patient.language.indexOf(Language_1.Language.English));
        /* Match found for english speakers */
        if (englishCounselor >= 0 && englishPatient >= 0) {
            const counselor = this.counselorsQueue.dequeue(englishCounselor);
            const patient = this.patientsQueue.dequeue(englishPatient);
            return [counselor, patient];
        }
        const counselorSpanish = this.counselorsQueue
            .getCollection()
            .findIndex((counselor) => counselor.language.indexOf(Language_1.Language.Spanish));
        const patientSpanish = this.patientsQueue
            .getCollection()
            .findIndex((patient) => patient.language.indexOf(Language_1.Language.Spanish));
        /* Match found for spanish speakers */
        if (counselorSpanish >= 0 && patientSpanish >= 0) {
            const counselor = this.counselorsQueue.dequeue(counselorSpanish);
            const patient = this.patientsQueue.dequeue(patientSpanish);
            return [counselor, patient];
        }
        return null;
    }
    /* Remove person from the queue when they disconnect */
    removePerson(socketId) {
        /* Check patient from patient queue */
        const patientIndex = this.patientsQueue
            .getCollection()
            .findIndex((entry) => entry.socketid === socketId);
        /* Remove disconnected person from queue */
        if (patientIndex >= 0) {
            this.patientsQueue.getCollection().splice(patientIndex, 1);
            return;
        }
        /* Check counselor queue */
        const counselorIndex = this.patientsQueue
            .getCollection()
            .findIndex((entry) => entry.socketid === socketId);
        /* Remove disconnected person from queue */
        if (counselorIndex >= 0) {
            this.patientsQueue.getCollection().splice(counselorIndex, 1);
            return;
        }
    }
    /* Check if the user id is not in any queue already */
    canQueue(id) {
        if (this.patientsQueue.canQueue(id) && this.counselorsQueue.canQueue(id))
            return true;
        else
            return false;
    }
    /* Returns the queues for testing purposes */
    getPatientQueue() {
        return this.patientsQueue.getCollection();
    }
    getCounselorQueue() {
        return this.counselorsQueue.getCollection();
    }
}
exports.default = MatchMaking;
//# sourceMappingURL=MatchMaking.js.map