import Patient from './entities/Patient'

export enum searchParam {only_counselor, counselor_or_happy, other_people}

/**
 *  ==========================
 *      Model Patients'data
 *  ==========================
 */
/* 
    id -> socket.io id
    param -> search param for matchmaking
*/
export default interface PatientSearch{
    id: string,
    user: Patient
    param: searchParam,
}