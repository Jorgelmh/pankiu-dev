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
exports.recordMessage = exports.updateEmail = exports.updatePassword = exports.updateUsername = exports.authenticateUser = exports.registerCounselor = exports.registerPatient = exports.acceptFriendRequest = exports.getFriendRequests = exports.addFriend = exports.changeMood = exports.getMessages = exports.getChats = exports.getConnection = void 0;
const mysql = require("mysql2/promise");
const bcrypt = require("bcrypt");
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
    const rows = (yield conn.execute(
      `SELECT sender_id, receiver_id, message FROM messages WHERE sender_id=? AND 
        receiver_id=? UNION SELECT sender_id, receiver_id, message FROM messages WHERE sender_id=? AND receiver_id=? ORDER BY date`,
      [id, otherId, otherId, id]
    ))[0];
    const messages = [];
    /* Model rows from the query */
    rows.forEach((row) => {
      const message = {
        senderId: row.receiver_id,
        receiverId: row.sender_id,
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
    const [
      rows,
    ] = yield conn.execute(`UPDATE patients SET mood=? WHERE user_id=?`, [
      mood,
      id,
    ]);
    conn.end();
  });
exports.changeMood = changeMood;
/**
 *  ============================
 *         ADD A FRIEND
 *  ============================
 *
 *  @param id {number} - Id of user in session
 *  @param uid {number} - Id of the user that will receive the friend request
 *
 */
const addFriend = (id, uid) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    const [rows] = yield conn.execute(`INSERT INTO friends VALUES (?,?,?,?)`, [
      id,
      uid,
      0,
      new Date().toISOString().slice(0, 19).replace("T", " "),
    ]);
    conn.end();
  });
exports.addFriend = addFriend;
/**
 *  =======================================
 *       GET PENDING FRIEND REQUESTS
 *  =======================================
 *
 *  @param id {number} - Id of the user in session
 */
const getFriendRequests = (id) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    const rows = (yield conn.execute(
      `SELECT friends.sender_id, users.username FROM 
  friends, users WHERE friends.receiver_id=? AND friends.accepted=? AND users.id=friends.sender_id ORDER BY friends.date`,
      [id, 0]
    ))[0];
    const requests = [];
    /* Add rows returned from the query */
    rows.forEach((row) => {
      requests.push({
        id: row.sender_id,
        username: row.username,
      });
    });
    conn.end();
    return requests;
  });
exports.getFriendRequests = getFriendRequests;
/**
 *  =================================
 *       ACCEPT FRIEND REQUEST
 *  =================================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param oid {number} - Id of the user that sent the friend request
 */
const acceptFriendRequest = (id, oid) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Execute query to accept the friend request */
    yield conn.execute(
      `UPDATE friends accepted=1 WHERE receiver_id=? AND sender_id=?`,
      [id, oid]
    );
    conn.end();
  });
exports.acceptFriendRequest = acceptFriendRequest;
/**
 *  ==============================================
 *               USER MANAGEMENT
 *  ==============================================
 */
const registerUser = (email, username, password, conn) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Check if the username has already been taken */
    const rows = (yield conn.execute(`SELECT * FROM users WHERE username=?`, [
      username,
    ]))[0];
    if (rows.length) return "Username already taken";
    /* Check if the email has already been taken */
    const rows1 = (yield conn.execute(`SELECT * FROM users WHERE email=?`, [
      email,
    ]))[0];
    if (rows1.length) return "Email already taken";
    /* If both parameters are unique then encrypt password and save user */
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    /* Record user in the db */
    try {
      /* Try to record the user in db */
      yield conn.execute(
        `INSERT INTO users (username, email, password, isadmin) values (?,?,?,?)`,
        [username, email, hash, 0]
      );
    } catch (e) {
      console.log(e);
      conn.end();
      return "Error creating new user";
    }
    return null;
  });
/**
 *  =============================
 *       REGISTER NEW PATIENT
 *  =============================
 *
 *  @param username {string} - New username for logging in
 *  @param password {string} - New password with at least 8 characters
 *  @param email {string} - Valid email address
 *  @param mood {Mood} - initial mood
 */
const registerPatient = (username, password, email, mood) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Check username and email */
    const error = yield registerUser(email, username, password, conn);
    /* If email or username have been taken return the error message */
    if (error) return { id: null, message: error };
    /* New user id */
    let uid;
    try {
      const rows = (yield conn.execute(
        `SELECT id FROM users WHERE username=?`,
        [username]
      ))[0];
      uid = rows[0].id;
      yield conn.execute(`INSERT INTO patients (user_id, mood) VALUES (?,?)`, [
        uid,
        mood,
      ]);
    } catch (e) {
      conn.end();
      return { id: null, message: "Error creating new Patient" };
    }
    conn.end();
    return { id: uid, message: null };
  });
exports.registerPatient = registerPatient;
/**
 *  =============================
 *      REGISTER NEW COUNSELOR
 *  =============================
 *
 *  @param username {string} - New username for logging in
 *  @param password {string} - New password with at least 8 characters
 *  @param email {string} - Valid email address
 *  @param University {string} - University or college that the counselor attended or is currently attending
 *  @param graduate {boolean} - Graduated or currently attending
 */
const registerCounselor = (username, password, email, university, graduated) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Check username and email */
    const error = yield registerUser(email, username, password, conn);
    /* If email or username have been taken return the error message */
    if (error) return { id: null, message: error };
    let uid;
    try {
      /* Try to record the user in db */
      const rows = (yield conn.execute(
        `SELECT id FROM users WHERE username=?`,
        [username]
      ))[0];
      uid = rows[0].id;
      yield conn.execute(
        `INSERT INTO counselors (user_id, university, graduated, rate) VALUES (?, ?, ?, ?)`,
        [uid, university, graduated, 5]
      );
    } catch (e) {
      conn.end();
      return { id: null, message: "Error creating new user" };
    }
    conn.end();
    return { id: uid, message: null };
  });
exports.registerCounselor = registerCounselor;
/**
 *  ========================
 *         LOGIN USER
 *  ========================
 *
 *  @param username {string} - Username credential
 *  @param password {string} - Password credential
 */
const authenticateUser = (username, password) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    const rows = (yield conn.execute(
      `SELECT id, password, email, isadmin FROM users WHERE username=?`,
      [username]
    ))[0];
    /* Check if a userr with that username has been found */
    if (rows.length) {
      /* Encrypted password in the db */
      const passwordOK = bcrypt.compareSync(password, rows[0].password);
      /* If the password is ok figure out whether is a patient or counselor  */
      if (passwordOK) {
        /* Check if the user is a patient */
        const patient = (yield conn.execute(
          `SELECT mood FROM patients WHERE user_id=?`,
          [rows[0].id]
        ))[0];
        if (patient.length) {
          conn.end();
          return {
            id: rows[0].id,
            username,
            email: rows[0].email,
            isAdmin: !!rows[0].isadmin,
            mood: patient[0].mood,
          };
        }
        /* If not a patient then fetch a counselor */
        const counselor = (yield conn.execute(
          `SELECT rate FROM counselors WHERE user_id=?`,
          [rows[0].id]
        ))[0];
        if (counselor.length) {
          conn.end();
          return {
            id: rows[0].id,
            username,
            email: rows[0].email,
            isAdmin: !!rows[0].isadmin,
            rate: counselor[0].rate,
          };
        }
      }
    }
    conn.end();
    return null;
  });
exports.authenticateUser = authenticateUser;
/**
 *  ===============================
 *          UPDATE USERNAME
 *  ===============================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param username {string} - new username
 */
const updateUsername = (id, username) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Try to change the name */
    yield conn.execute(`UPDATE users SET username=? WHERE id=?`, [
      username,
      id,
    ]);
    conn.end();
  });
exports.updateUsername = updateUsername;
/**
 *  =============================
 *         UPDATE PASSWORD
 *  =============================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param password {string} - new password
 */
const updatePassword = (id, password) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Encrypt new password */
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    /* Try to change the password stored in db */
    yield conn.execute(`UPDATE users SET password=? WHERE id=?`, [hash, id]);
    conn.end();
  });
exports.updatePassword = updatePassword;
/**
 *  =============================
 *          UPDATE EMAIL
 *  =============================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param email {string} - new email
 */
const updateEmail = (id, email) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Try to change the email in the db */
    yield conn.execute(`UPDATE users SET email=? WHERE id=?`, [email, id]);
    conn.end();
  });
exports.updateEmail = updateEmail;
/**
 *  ==============================
 *          RECORD MESSAGE
 *  ==============================
 *
 *  @param sender_id {number} - Id of the user that sends the message
 *  @param receiver_id {number} - Id of the user that receives the message
 */
const recordMessage = (sender_id, receiver_id, message) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get a connection */
    const conn = yield exports.getConnection();
    /* Record the message in the db */
    yield conn.execute(
      `INSERT INTO messages (time, message, receiver_id, sender_id) VALUES (?, ?, ?, ?)`,
      [
        new Date().toISOString().slice(0, 19).replace("T", " "),
        message,
        receiver_id,
        sender_id,
      ]
    );
    conn.end();
  });
exports.recordMessage = recordMessage;
//# sourceMappingURL=Database.js.map
