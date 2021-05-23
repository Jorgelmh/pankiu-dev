import socketIOClient, { Socket } from 'socket.io-client'
import { searchParam } from '../interfaces/search/PatientSearch'
import { QUEUE_USER, ROOM_FOUND, QUEUE_GUEST } from '../interfaces/Channels'
import { v4 as uuidv4 } from 'uuid'
import { Mood } from '../interfaces/entities/Patient'
import QueueGuest from '../interfaces/QueueParam/QueueGuest'
import { Language } from '../interfaces/QueueParam/Language'
import QueuePatient from '../interfaces/QueueParam/QueuePatient'
import QueueCounselor from '../interfaces/QueueParam/QueueCounselor'

/**
 *  ============================================================
 *     IMPLEMENTATION OF SOCKET.IO CLIENT (MATCHMAKING QUEUE)
 *  ============================================================
 */
/* Use it to implement the Matchmaking communication process */
export default class SocketQueue {
  private socketIO: Socket

  /* Creates and initializes a socket */
  public constructor(private redirectToRoom: (roomId: string) => void) {
    this.socketIO = socketIOClient()
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
    const uid = uuidv4()
    localStorage.setItem('guestid', uid)

    /* Model a patient's Queue request */
    const patient: QueuePatient = {
      peerid: uid,
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
    localStorage.setItem('guestid', uid)

    /* Guest request */
    const guest: QueueGuest = {
      peerid: uid,
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
    /* Create and record the temporary id */
    const uid = uuidv4()
    localStorage.setItem('guestid', uid)

    /* Model a Counselor's Queue request */
    const counselor: QueueCounselor = {
      peerid: uid,
      token,
      language,
    }

    this.socketIO.emit(QUEUE_USER, counselor)
  }

  /* Set up socket listeners */
  public handleMessages(): void {
    /* When a room has been found */
    this.socketIO.on(ROOM_FOUND, ({ roomId }) => {
      /* Connect socket to chat */
      this.redirectToRoom(roomId)
    })
  }

  public getSocket(): Socket {
    return this.socketIO
  }
}
