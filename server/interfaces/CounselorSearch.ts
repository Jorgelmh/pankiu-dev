/**
 * ============================
 *    Model counselor's data
 * ============================
 */

import Counselor from "./entities/Counselor";

/* id -> socket.io id */
export default interface CounselorSearch{
    id: string,
    user: Counselor
}