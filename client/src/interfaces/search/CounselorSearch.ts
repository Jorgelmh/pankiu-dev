/**
 * ============================
 *    Model counselor's data
 * ============================
 */

import Counselor from "../entities/Counselor";
import Search from "./Search";

/* id -> socket.io id */
export default interface CounselorSearch extends Search {
  user: Counselor;
}
