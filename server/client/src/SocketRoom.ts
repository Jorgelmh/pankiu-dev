import socketIOClient, { Socket } from 'socket.io-client'
import {
  CONNECT_TO_ROOM,
  QUEUE_USER,
  ROOM_FOUND,
  QUEUE_GUEST,
} from '../../sockets/Channels'

/**
 *  ==============================================
 *     SOCKET.IO CLIENT FOR A VIDEO CHAT ROOM
 *  ==============================================
 */
export default class SocketRoom {
  /* Socket.io client */
  private socketClient: Socket
  private readonly ENDPOINT = 'http://127.0.0.1:3000/'

  constructor(private roomid: string, private token: string) {
    this.socketClient = socketIOClient()
  }

  /* Enter to socket.io room on the server */
  public enterSocketRoom(): void {}

  /* Handle socket messages */
  public handleMessages(): void {}
}
