import socketIOClient, { Socket } from 'socket.io-client'
import { searchParam } from '../../interfaces/search/PatientSearch'
import {
  CONNECT_TO_ROOM,
  QUEUE_USER,
  ROOM_FOUND,
  QUEUE_GUEST,
} from '../../sockets/Channels'
import { v4 as uuidv4 } from 'uuid'
import { Mood } from '../../interfaces/entities/Patient'
import QueueGuest from '../../interfaces/QueueParam/QueueGuest'
import { Language } from '../../interfaces/QueueParam/Language'
import QueuePatient from '../../interfaces/QueueParam/QueuePatient'
import QueueCounselor from '../../interfaces/QueueParam/QueueCounselor'

/**
 *  ============================================================
 *     IMPLEMENTATION OF SOCKET.IO CLIENT (MATCHMAKING QUEUE)
 *  ============================================================
 */
/* Use it to implement the Matchmaking communication process */
export default class SocketQueue {
  /* Socket.io server address */
  private readonly ENDPOINT = 'http://127.0.0.1:3000/'
  private socketIO: Socket

  /* Creates and initializes a socket */
  public constructor(private redirectToRoom: (roomId: string) => void) {
    this.socketIO = socketIOClient(this.ENDPOINT)
    this.handleMessages()
  }

  /**
   *  ==========================
   *        QUEUE PATIENT
   *  ==========================
   *
   * @desc Sends a message to add user to the Matchmaking queue
   * @param Token {string} - JWT of the current user
   * @param param {param} - Either counselort_only or counselor_or_happy
   */
  public queuePatient(
    token: string,
    param: searchParam,
    language: Language[]
  ): void {
    /* Model a patient's Queue request */
    const patient: QueuePatient = {
      token,
      param,
      language,
    }

    this.socketIO.emit(QUEUE_USER, patient)
  }

  /**
   *  =============================
   *           QUEUE GUEST
   *  =============================
   *
   * @param name {string} - Temporary name of the user
   * @param mood {mood} - Current mood of the guest
   * @param param {param} - Param of search
   */
  public queueGuest(
    name: string,
    mood: Mood,
    param: searchParam,
    language: Language[]
  ): void {
    /* Create and record the temporary id */
    const uid = uuidv4()
    localStorage.setItem('guestID', uid)

    /* Guest request */
    const guest: QueueGuest = {
      id: uid,
      name,
      mood,
      param,
      language,
    }

    /* Create temporary user */
    this.socketIO.emit(QUEUE_GUEST, guest)
  }

  /**
   *  ==========================
   *       QUEUE COUNSELOR
   *  ==========================
   *  @desc Sends a message to add user to the Matchmaking queue
   *  @param Token {string} - JWT of the user
   */
  public queueCounselor(token: string, language: Language[]): void {
    /* Model a Counselor's Queue request */
    const counselor: QueueCounselor = {
      token,
      language,
    }

    this.socketIO.emit(QUEUE_USER, counselor)
  }

  /* Set up socket listeners */
  public handleMessages(): void {
    /* When a room has been found */
    this.socketIO.on(ROOM_FOUND, ({ roomId, room }) => {
      /* Connect socket to chat */
      this.socketIO.emit(CONNECT_TO_ROOM, roomId)
      this.redirectToRoom(roomId)
    })
  }

  public getSocket(): Socket {
    return this.socketIO
  }
}
