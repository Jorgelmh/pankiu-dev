import socketIOClient, { Socket } from 'socket.io-client'
import User from '../../interfaces/entities/User'
import {
  ENTER_ROOM_COUNSELOR,
  ENTER_ROOM_PATIENT,
  SET_UP_CALL,
  USER_CONNECTED,
  JOINED_CALL,
} from '../../sockets/Channels'

import Peer from 'peerjs'

/**
 *  ==============================================
 *     SOCKET.IO CLIENT FOR A VIDEO CHAT ROOM
 *  ==============================================
 */
export default class SocketRoom {
  /* Socket.io client */
  private socketClient: Socket
  private readonly ENDPOINT = 'http://127.0.0.1:3000/'

  /* PeerJS connection */
  private peerClient: Peer

  constructor(
    private roomid: string,
    private peerId: number | string,
    private userVideo: HTMLVideoElement,
    private otherUserVideo: HTMLVideoElement
  ) {
    this.socketClient = socketIOClient(this.ENDPOINT)
    this.peerClient = new Peer(String(roomid))
  }

  /* Enter to socket.io room on the server */
  public enterSocketRoom(): void {
    /* Check if the user is logged in */
    const token = localStorage.getItem('token')
    if (token) {
      const user: User = JSON.parse(atob(token.split('.')[1]))

      /* If the user logged in is a Patient */
      if ('mood' in user)
        this.socketClient.emit(ENTER_ROOM_PATIENT, {
          token,
          roomid: this.roomid,
          guestId: null,
        })
      else
        this.socketClient.emit(ENTER_ROOM_COUNSELOR, {
          token,
          roomid: this.roomid,
        })
    }

    /* Otherwise it is a GUEST */
    const guestId = localStorage.getItem('guestID')
    if (guestId) {
      this.socketClient.emit(ENTER_ROOM_PATIENT, {
        token: null,
        roomid: this.roomid,
        guestId,
      })
    }
  }

  /* Handle socket messages */
  public handleMessages(): void {
    /* When the user has been confirmed to belong to the room we can stream */
    this.socketClient.on(SET_UP_CALL, () => {
      /* Get current users video stream */
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream: MediaStream) => {
          this.addVideoStream(this.userVideo, stream)
          this.peerClient.on('call', (call) => {
            call.answer(stream)
            call.on('stream', (otherUserStream: MediaStream) => {
              this.addVideoStream(this.otherUserVideo, otherUserStream)
            })
          })

          this.socketClient.on(USER_CONNECTED, ({ id }) => {
            this.connectToUser(String(id), stream)
          })
        })

      this.peerClient.on('open', () => {
        this.socketClient.emit(JOINED_CALL, this.peerId)
      })
    })
  }

  /* Add video stream */
  public addVideoStream(video: HTMLVideoElement, stream: MediaStream): void {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }

  /* Connect to the other user */
  public connectToUser(id: string, stream: MediaStream): void {
    const call = this.peerClient.call(id, stream)
    call.on('stream', (userVideoStream: MediaStream) => {
      this.addVideoStream(this.otherUserVideo, userVideoStream)
    })
  }
}
