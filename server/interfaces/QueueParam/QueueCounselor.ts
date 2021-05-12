import { Language } from "./Language";

/**
 *  ==============================================
 *      MODEL A QUEUE REQUEST FOR A COUNSELOR
 *  ==============================================
 */
export default interface QueueCounselor {
  peerid: string;
  token: string;
  language: Language[];
}
