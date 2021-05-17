import PatientSearch from "./PatientSearch";
import CounselorSearch from "./CounselorSearch";

/**
 *  =================================================
 *   Abstract model for both patients and counselor
 *  =================================================
 */
/*
    id -> socket.io id
*/
export type PersonSearch = PatientSearch | CounselorSearch;
