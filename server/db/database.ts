import * as mysql from "mysql2/promise";
import { Connection } from "mysql2/promise";
import { RowDataPacket } from "mysql2/promise";
import Message from "../interfaces/chats/message";
import Chat from "../interfaces/chats/Chat";
import { Mood } from "../interfaces/entities/Patient";
import * as bcrypt from "bcrypt";
import FriendRequest from "../interfaces/FriendRequest";
import Counselor from "../interfaces/entities/Counselor";
import Patient from "../interfaces/entities/Patient";

/**
 *  ==============================
 *              CRUD
 *  ==============================
 */

/* Create a connection with the database */
export const getConnection = async (): Promise<Connection> => {
  const conn = await mysql.createConnection({
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: process.env.dbname,
    port: Number(process.env.dbport),
  });

  return conn;
};

/**
 *  ================================
 *            FETCH CHATS
 *  ================================
 *
 * @param id {number} - Id of the user
 * @returns A list of user's chats
 */
export const getChats = async (id: number): Promise<Chat[]> => {
  /* Get a connection */
  const conn = await getConnection();
  const rows = <RowDataPacket[]>await conn.execute(``, [id]);
  const chats: Chat[] = [];

  /* Model the entries retrieved from the db */
  rows.forEach((row) => {
    const chat: Chat = {
      uid: row.id,
      username: row.username,
      message: row.message,
    };

    chats.push(chat);
  });

  conn.end();
  return chats;
};

/**
 *  =============================
 *          FETCH MESSAGES
 *  =============================
 *
 *  @param id {number} - Id stored in the JWT
 *  @param otherId {number} - The other person that has a chat with the person in session
 *  @returns A list of messages
 */
export const getMessages = async (
  id: number,
  otherId: number
): Promise<Message[]> => {
  /* Get a connection */
  const conn = await getConnection();
  const rows = <RowDataPacket[]>await conn.execute(``, [id, otherId]);
  const messages: Message[] = [];

  /* Model rows from the query */
  rows.forEach((row) => {
    const message: Message = {
      senderId: row.id_user1,
      receiverId: row.id_user2,
      text: row.message,
    };

    messages.push(message);
  });

  conn.end();
  return messages;
};

/**
 *  ============================
 *          CHANGE MOOD
 *  ============================
 *
 *  @param id {number} - Id stored in the JWT
 *  @param mood {Mood} - New mood
 */
export const changeMood = async (id: number, mood: Mood) => {
  /* Get a connection */
  const conn = await getConnection();
  const [rows] = await conn.execute(``, [id, mood]);
  conn.end();
};

/**
 *  ============================
 *         ADD A FRIEND
 *  ============================
 *
 *  @param id {number} - Id of user in session
 *  @param uid {number} - Id of the user that will receive the friend request
 *
 */
export const addFriend = async (id: number, uid: number) => {
  /* Get a connection */
  const conn = await getConnection();
  const [rows] = await conn.execute(``, [id, uid]);
  conn.end();
};

/**
 *  =======================================
 *       GET PENDING FRIEND REQUESTS
 *  =======================================
 *
 *  @param id {number} - Id of the user in session
 */
export const getFriendRequests = async (
  id: number
): Promise<FriendRequest[]> => {
  /* Get a connection */
  const conn = await getConnection();
  const rows = <RowDataPacket[]>await conn.execute(``, [id]);
  const requests: FriendRequest[] = [];

  /* Add rows returned from the query */
  rows.forEach((row) => {
    requests.push({
      id: row.id,
      username: row.username,
    });
  });

  conn.end();
  return requests;
};

/**
 *  =================================
 *       ACCEPT FRIEND REQUEST
 *  =================================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param oid {number} - Id of the user that sent the friend request
 */
export const acceptFriendRequest = async (id: number, oid: number) => {
  /* Get a connection */
  const conn = await getConnection();

  /* Execute query to accept the friend request */
  await conn.execute(``, [id, oid]);
  conn.end();
};

/**
 *  ==============================================
 *               USER MANAGEMENT
 *  ==============================================
 */

const registerUser = async (
  email: string,
  username: string,
  password: string,
  conn: Connection
): Promise<string> => {
  /* Check if the username has already been taken */
  const rows = <RowDataPacket[]>(
    await conn.execute(`SELECT * FROM users WHERE username=?`, [username])
  );
  if (rows.length > 0) return "Username already taken";

  /* Check if the email has already been taken */
  const [emailDB] = await conn.execute(`SELECT * FROM users WHERE email=?`, [
    email,
  ]);
  if (!emailDB) return "Email already taken";

  /* If both parameters are unique then encrypt password and save user */
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  /* Record user in the db */
  try {
    /* Try to record the user in db */
    await conn.execute(
      `INSERT INTO users (username, email, password, state, isAdmin) values (?,?,?,?,?)`,
      [username, email, hash, "connected", false]
    );
  } catch (e) {
    conn.end();
    return "Error creating new user";
  }

  return null;
};

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
export const registerPatient = async (
  username: string,
  password: string,
  email: string,
  mood: Mood
): Promise<{ id: number; message: string }> => {
  /* Get a connection */
  const conn = await getConnection();

  /* Check username and email */
  const error = await registerUser(email, username, password, conn);

  /* If email or username have been taken return the error message */
  if (error) return { id: null, message: error };

  /* New user id */
  let uid: number;
  try {
    const rows = <RowDataPacket[]>(
      await conn.execute(`SELECT id FROM users WHERE username=?`, [username])
    );
    uid = Number(rows[0]);
    await conn.execute(`INSERT INTO patients (user_id, mood) VALUES (?,?)`, [
      uid,
      mood,
    ]);
  } catch (e) {
    conn.end();
    return { id: null, message: "Error creating new Patient" };
  }

  conn.end();
  return { id: uid, message: null };
};

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
export const registerCounselor = async (
  username: string,
  password: string,
  email: string,
  university: string,
  graduated: boolean
): Promise<{ id: number; message: string }> => {
  /* Get a connection */
  const conn = await getConnection();

  /* Check username and email */
  const error = await registerUser(email, username, password, conn);

  /* If email or username have been taken return the error message */
  if (error) return { id: null, message: error };

  let uid: number;
  try {
    /* Try to record the user in db */
    const rows = <RowDataPacket[]>(
      await conn.execute(`SELECT id FROM users WHERE username=?`, [username])
    );
    uid = Number(rows[0]);
    await conn.execute(
      `INSERT INTO counselors (user_id, university, graduated, rate) VALUES (?, ?, ?, ?)`,
      [uid, university, graduated, 5]
    );
  } catch (e) {
    conn.end();
    return { id: null, message: "Error creating new user" };
  }

  conn.end();
  return { id: uid, message: null };
};

/**
 *  ========================
 *         LOGIN USER
 *  ========================
 *
 *  @param username {string} - Username credential
 *  @param password {string} - Password credential
 */
export const authenticateUser = async (
  username: string,
  password: string
): Promise<Patient | Counselor> => {
  /* Get a connection */
  const conn = await getConnection();
  const rows = <RowDataPacket[]>(
    await conn.execute(
      `SELECT id, password, email, isAdmin FROM users WHERE username=?`,
      [username]
    )
  );

  /* Check if a suer with that username has been found */
  if (rows.length) {
    /* Encrypted password in the db */
    const passwordOK = bcrypt.compareSync(password, rows[0].password);

    /* If the password is ok figure out whether is a patient or counselor  */
    if (passwordOK) {
      /* Check if the user is a patient */
      const patient = <RowDataPacket[]>(
        await conn.execute(`SELECT mood FROM patients WHERE user_id=?`, [
          rows[0].id,
        ])
      );

      if (patient.length) {
        conn.end();
        return {
          id: rows[0].id,
          username,
          email: rows[0].email,
          isAdmin: rows[0].isAdmin,
          mood: patient[0].mood,
        };
      }

      /* If not a patient then fetch a counselor */
      const counselor = <RowDataPacket[]>(
        await conn.execute(`SELECT rate FROM counselors WHERE user_id=?`, [
          rows[0].id,
        ])
      );
      if (counselor.length) {
        conn.end();
        return {
          id: rows[0].id,
          username,
          email: rows[0].email,
          isAdmin: rows[0].isAdmin,
          rate: counselor[0].rate,
        };
      }
    }
  }

  conn.end();
  return null;
};

/**
 *  ===============================
 *          UPDATE USERNAME
 *  ===============================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param username {string} - new username
 */
export const updateUsername = async (id: number, username: string) => {
  /* Get a connection */
  const conn = await getConnection();

  /* Try to change the name */
  await conn.execute(`UPDATE users SET username=? WHERE id=?`, [username, id]);

  conn.end();
};

/**
 *  =============================
 *         UPDATE PASSWORD
 *  =============================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param password {string} - new password
 */
export const updatePassword = async (id: number, password: string) => {
  /* Get a connection */
  const conn = await getConnection();

  /* Encrypt new password */
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  /* Try to change the password stored in db */
  await conn.execute(`UPDATE users SET password=? WHERE id=?`, [hash, id]);

  conn.end();
};

/**
 *  =============================
 *          UPDATE EMAIL
 *  =============================
 *
 *  @param id {number} - Id of the user in session (JWT)
 *  @param email {string} - new email
 */
export const updateEmail = async (id: number, email: string) => {
  /* Get a connection */
  const conn = await getConnection();

  /* Try to change the email in the db */
  await conn.execute(`UPDATE users SET email=? WHERE id=?`, [email, id]);
  conn.end();
};
