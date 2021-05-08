import { searchParam } from '../search/PatientSearch'
/**
 *  =========================================
 *      .MODEL QUEUE REQUEST FOR PATIENTS
 *  =========================================
 */
export default interface QueuePatient {
    token: string,
    param: searchParam
}