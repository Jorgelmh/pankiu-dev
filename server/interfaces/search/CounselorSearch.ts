/**
 * ============================
 *    Model counselor's data
 * ============================
 */

import Counselor from "../entities/Counselor";
import { Language } from "../QueueParam/Language";

/* id -> socket.io id */
export default interface CounselorSearch {
  socketid: string;
  user: Counselor;
  language: Language[];
}
