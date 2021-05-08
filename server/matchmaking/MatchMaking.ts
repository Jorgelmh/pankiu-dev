import Queue from './Queue'
import { PersonSearch } from '../interfaces/PersonSearch'
import Patient, { searchParam } from '../interfaces/PatientSearch'
import { Mood } from '../interfaces/entities/Patient'
import Counselor from '../interfaces/CounselorSearch'
import { Match } from '../interfaces/Match'
import PatientSearch from '../interfaces/PatientSearch'
import CounselorSearch from '../interfaces/CounselorSearch'

/**
 *  ==============================
 *       MATCHMAKING SYSTEM
 *  ==============================
 */
/* This class will manage the queue and search for matches before entering a chat room */
export default class MatchMaking {

    /* Different Queues for different roles */
    private patientsQueue: Queue<PatientSearch>
    private counselorsQueue: Queue<CounselorSearch>

    constructor(){
        /* Start empty queues */
        this.patientsQueue = new Queue<Patient>()
        this.counselorsQueue = new Queue<Counselor>()
    }

    /* Add person to their correspondent queue */
    public addPerson(person: PersonSearch): Match{

        /* Check if the person is a patient */
        if('param' in person){
            this.patientsQueue.queue(person)

            /* Search for matches between patients first */
            const matchTwoPatients = this.searchPatientsMatch()

            if(matchTwoPatients)
                return matchTwoPatients

        }else
            this.counselorsQueue.queue(person)
        

        /* Now, search for matches with counselors */
        const matchCounselorPatient = this.searchMatch()
        return matchCounselorPatient
    }

    /* Search the patients queue for a match between the oldest happy and not happy  */
    searchPatientsMatch(): Match{

        /* Find both categories that are needed to match together */
        const happy = this.patientsQueue.getCollection().find((person: PatientSearch) => person.user.mood == Mood.Happy)
        const notHappy = this.patientsQueue.getCollection().find((person: PatientSearch) => person.user.mood != Mood.Happy && person.param == searchParam.counselor_or_happy)

        if(happy && notHappy){

            /* Remove people match from the queue */
            const happyIndex = this.patientsQueue.getCollection().findIndex(({id}) => id == happy.id)
            this.patientsQueue.getCollection().splice(happyIndex,1)

            const notHappyIndex = this.patientsQueue.getCollection().findIndex(({id}) => id == notHappy.id)
            this.patientsQueue.getCollection().splice(notHappyIndex,1)

            return [happy, notHappy]
        }

        /* Match not found */
        return null
    }

    /* Seach for match between counselor and patients */
    public searchMatch(): Match{

        /* Check if there are people queuing */
        if(this.counselorsQueue.size() > 0 && this.patientsQueue.size() > 0){
            const counselor = this.counselorsQueue.dequeue()
            const patient = this.patientsQueue.dequeue()

            return [counselor, patient]
        }

        return null
    }

    /* Returns the queues for testing purposes */
    public getPatientQueue() : Patient[]{
        return this.patientsQueue.getCollection()
    }

    public getCounselorQueue() : Counselor[]{
        return this.counselorsQueue.getCollection()
    }

}