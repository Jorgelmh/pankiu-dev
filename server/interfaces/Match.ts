import { PersonSearch } from './search/PersonSearch'
import Patient from './search/PatientSearch'
/**
 *  ====================================
 *      TUPLE THAT CONTAINS A MATCH
 *  ====================================
 */
/* Match can be either between two patients or patients with a counselor */
export type Match = [PersonSearch, Patient]