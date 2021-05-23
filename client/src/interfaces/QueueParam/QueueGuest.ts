/**
 *  ===============================
 *      MODEL A GUEST'S REQUEST
 *  ===============================
 */

import { Mood } from "../entities/Patient";
import { searchParam } from "../search/PatientSearch";
import { Language } from "./Language";

export default interface QueueGuest {
  peerid: string;
  name: string;
  param: searchParam;
  mood: Mood;
  language: Language[];
}
