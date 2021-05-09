"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Queue_1 = require("./Queue");
const PatientSearch_1 = require("../interfaces/search/PatientSearch");
const Patient_1 = require("../interfaces/entities/Patient");
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
      if (matchTwoPatients) return matchTwoPatients;
    } else this.counselorsQueue.queue(person);
    /* Now, search for matches with counselors */
    const matchCounselorPatient = this.searchMatch();
    return matchCounselorPatient;
  }
  /* Search the patients queue for a match between the oldest happy and not happy  */
  searchPatientsMatch() {
    /* Find both categories that are needed to match together */
    const happy = this.patientsQueue
      .getCollection()
      .find((person) => person.user.mood == Patient_1.Mood.Happy);
    const notHappy = this.patientsQueue
      .getCollection()
      .find(
        (person) =>
          person.user.mood != Patient_1.Mood.Happy &&
          person.param == PatientSearch_1.searchParam.counselor_or_happy
      );
    if (happy && notHappy) {
      /* Remove people match from the queue */
      const happyIndex = this.patientsQueue
        .getCollection()
        .findIndex(({ id }) => id == happy.id);
      this.patientsQueue.getCollection().splice(happyIndex, 1);
      const notHappyIndex = this.patientsQueue
        .getCollection()
        .findIndex(({ id }) => id == notHappy.id);
      this.patientsQueue.getCollection().splice(notHappyIndex, 1);
      return [happy, notHappy];
    }
    /* Match not found */
    return null;
  }
  /* Seach for match between counselor and patients */
  searchMatch() {
    /* Check if there are people queuing */
    if (this.counselorsQueue.size() > 0 && this.patientsQueue.size() > 0) {
      const counselor = this.counselorsQueue.dequeue();
      const patient = this.patientsQueue.dequeue();
      return [counselor, patient];
    }
    return null;
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
