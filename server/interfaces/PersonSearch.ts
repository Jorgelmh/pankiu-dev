import Patient from './PatientSearch'
import Counselor from './CounselorSearch'

/**
 *  =================================================
 *   Abstract model for both patients and counselor
 *  =================================================
 */
/*
    id -> socket.io id
*/
export type PersonSearch = Patient | Counselor