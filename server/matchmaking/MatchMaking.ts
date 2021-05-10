import Queue from "./Queue";
import { PersonSearch } from "../interfaces/search/PersonSearch";
import { searchParam } from "../interfaces/search/PatientSearch";
import { Mood } from "../interfaces/entities/Patient";
import { Match } from "../interfaces/Match";
import PatientSearch from "../interfaces/search/PatientSearch";
import CounselorSearch from "../interfaces/search/CounselorSearch";
import { Language } from "../interfaces/QueueParam/Language";

/**
 *  ==============================
 *       MATCHMAKING SYSTEM
 *  ==============================
 */
/* This class will manage the queue and search for matches before entering a chat room */
export default class MatchMaking {
  /* Different Queues for different roles */
  private patientsQueue: Queue<PatientSearch>;
  private counselorsQueue: Queue<CounselorSearch>;

  constructor() {
    /* Start empty queues */
    this.patientsQueue = new Queue<PatientSearch>();
    this.counselorsQueue = new Queue<CounselorSearch>();
  }

  /* Add person to their correspondent queue */
  public addPerson(person: PersonSearch): Match {
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
  public searchPatientsMatch(): Match {
    /* Search by language */
    const matchEnglish = this.findMatchLanguage(Language.English);
    if (matchEnglish) return matchEnglish;

    const matchSpanish = this.findMatchLanguage(Language.Spanish);
    if (matchSpanish) return matchSpanish;

    /* Match not found */
    return null;
  }

  /* Find match per language */
  public findMatchLanguage(language: Language): Match {
    /* Find both categories that are needed to match together */
    const happy = this.patientsQueue
      .getCollection()
      .find(
        (person: PatientSearch) =>
          person.user.mood == Mood.Happy && person.language.indexOf(language)
      );
    const notHappy = this.patientsQueue
      .getCollection()
      .find(
        (person: PatientSearch) =>
          person.user.mood != Mood.Happy &&
          person.param == searchParam.counselor_or_happy &&
          person.language.indexOf(language)
      );

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
  public searchMatch(): Match {
    const englishCounselor = this.counselorsQueue
      .getCollection()
      .findIndex((counselor) => counselor.language.indexOf(Language.English));
    const englishPatient = this.patientsQueue
      .getCollection()
      .findIndex((patient) => patient.language.indexOf(Language.English));

    /* Match found for english speakers */
    if (englishCounselor >= 0 && englishPatient >= 0) {
      const counselor = this.counselorsQueue.dequeue(englishCounselor);
      const patient = this.patientsQueue.dequeue(englishPatient);

      return [counselor, patient];
    }

    const counselorSpanish = this.counselorsQueue
      .getCollection()
      .findIndex((counselor) => counselor.language.indexOf(Language.Spanish));
    const patientSpanish = this.patientsQueue
      .getCollection()
      .findIndex((patient) => patient.language.indexOf(Language.Spanish));

    /* Match found for spanish speakers */
    if (counselorSpanish >= 0 && patientSpanish >= 0) {
      const counselor = this.counselorsQueue.dequeue(counselorSpanish);
      const patient = this.patientsQueue.dequeue(patientSpanish);

      return [counselor, patient];
    }
    return null;
  }

  /* Returns the queues for testing purposes */
  public getPatientQueue(): PatientSearch[] {
    return this.patientsQueue.getCollection();
  }

  public getCounselorQueue(): CounselorSearch[] {
    return this.counselorsQueue.getCollection();
  }
}
