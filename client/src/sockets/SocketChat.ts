import socketIOClient, { Socket } from 'socket.io-client'
import {
  CHAT_ERROR,
  CHAT_MESSAGE,
  CONNECT_TO_CHATS,
  NEW_MESSAGE,
} from '../interfaces/Channels'
import SendMessage from '../interfaces/chats/SendMessage'
/**
 *  ===========================================================
 *      IMPLEMENTATION OF SOCKET.IO FOR RECEIVING MESSAGES
 *  ===========================================================
 */

export default class SocketChat {
  private socketIO: Socket

  /* Callback that'll be called everytime a message is received */
  constructor(
    private token: string,
    private callback: (
      err: string | null,
      id: number | null,
      message: string | null
    ) => void
  ) {
    this.socketIO = socketIOClient()
    this.handleMessages()
  }

  private handleMessages(): void {
    /* Conenct to chat system */
    this.socketIO.emit(CONNECT_TO_CHATS, { token: this.token })

    /* Receive a message */
    this.socketIO.on(
      NEW_MESSAGE,
      ({ sender_id, message }: { sender_id: number; message: string }) => {
        this.callback(null, sender_id, message)
      }
    )

    /* Receive an error */
    this.socketIO.on(CHAT_ERROR, ({ ok, message }) => {
      this.callback(message, null, null)
    })
  }

  /**
   *  ==================================
   *    SEND A MESSAGE TO OTHER USERS
   *  ==================================
   *
   * @param sender_id
   * @param receiver_id
   * @param message
   */
  public sendMessage(receiver_id: number, message: string): void {
    const body: SendMessage = {
      token: this.token,
      receiver_id: receiver_id,
      message,
    }

    /* Send a message to other socket */
    this.socketIO.emit(CHAT_MESSAGE, body)
  }
}