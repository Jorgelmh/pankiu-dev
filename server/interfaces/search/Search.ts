import { Language } from "../QueueParam/Language";
/**
 *  ===============================
 *      PARENT SEARCH INTERFACE
 *  ===============================
 */

export default interface Search {
  socketid: string;
  peerid: string;
  language: Language[];
}
