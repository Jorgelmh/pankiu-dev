/**
 *  ========================
 *       Model Message
 *  ========================
 */
export default interface Message {
  senderId: number;
  receiverId: number;
  text: string;
  date: string;
}
