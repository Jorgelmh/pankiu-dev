import PersonSearch from './PersonSearch'
import Patient from './PatientSearch'
/**
 *  ====================================
 *      TUPLE THAT CONTAINS A MATCH
 *  ====================================
 */
/* Match can be either between two patients or patients with a counselor */
export type Match = [PersonSearch, Patient]