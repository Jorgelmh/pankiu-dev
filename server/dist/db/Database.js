"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeMood = exports.getMessages = exports.getChats = exports.getConnection = void 0;
const mysql = require("mysql2/promise");
/**
 *  ==============================
 *              CRUD
 *  ==============================
 */
/* Create a connection with the database */
const getConnection = () =>
  __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield mysql.createConnection({
      host: process.env.dbhost,
      user: process.env.dbuser,
      password: process.env.dbpassword,
      database: process.env.dbname,
      port: Number(process.env.dbport),
    });
    return conn;
  });
exports.getConnection = getConnection;
/**
 *  ================================
 *            FETCH CHATS
 *  ================================
 *
 * @param id {number} - Id of the user
 * @returns A list of user's chats
 */
const getChats = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    const rows = yield conn.execute(``, [id]);
    const chats = [];
    /* Model the entries retrieved from the db */
    rows.forEach((row) => {
      const chat = {
        uid: row.id,
        username: row.username,
        message: row.message,
      };
      chats.push(chat);
    });
    conn.end();
    return chats;
  });
exports.getChats = getChats;
/**
 *  =============================
 *          FETCH MESSAGES
 *  =============================
 *
 *  @param id {number} - Id stored in the JWT
 *  @param otherId {number} - The other person that has a chat with the person in session
 *  @returns A list of messages
 */
const getMessages = (id, otherId) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    const rows = yield conn.execute(``, [id, otherId]);
    const messages = [];
    /* Model rows from the query */
    rows.forEach((row) => {
      const message = {
        senderId: row.id_user1,
        receiverId: row.id_user2,
        text: row.message,
      };
      messages.push(message);
    });
    conn.end();
    return messages;
  });
exports.getMessages = getMessages;
/**
 *  ============================
 *          CHANGE MOOD
 *  ============================
 *
 *  @param id {number} - Id stored in the JWT
 *  @param mood {Mood} - New mood
 */
const changeMood = (id, mood) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    const [rows] = yield conn.execute(``, [id, mood]);
    conn.end();
  });
exports.changeMood = changeMood;
//# sourceMappingURL=Database.js.map
