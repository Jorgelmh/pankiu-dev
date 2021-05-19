/**
 *  =======================================
 *      SOCKET PARAMS TO SEND A MESSAGE
 *  =======================================
 */
export default interface SendMessage {
  token: string;
  message: string;
  receiver_id: number;
}
