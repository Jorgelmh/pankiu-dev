import { Match } from './Match';

/**
 *  =========================
 *     Model Socket Rooms
 *  =========================
 */
/* Will be used for chatting rooms */
export default interface SocketRoom{
    [id: string] : Match
}