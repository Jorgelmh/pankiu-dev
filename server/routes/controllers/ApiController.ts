import * as express from "express";
import User from "../../interfaces/entities/User";
import * as db from "../../db/Database";
import Message from "../../interfaces/chats/message";
import Chat from "../../interfaces/chats/Chat";
import { Mood } from "../../interfaces/entities/Patient";
import Quote from "../../interfaces/quotes/Quote";
import FriendRequest from "../../interfaces/FriendRequest";
import axios from "axios";

/**
 *  ==============================
 *        REST API Controllers
 *  ==============================
 */

/* Fetch the chats of a specific user (only returns the last message) */
export const fetchChat = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user data */
  const user: User = req.body.decoded;
  let chats: Chat[];

  try {
    /* Fetch chats from the db */
    chats = await db.getChats(user.id);
  } catch (e) {
    return res.json({
      ok: false,
      message: "An error has ocurred when fetching your chats",
    });
  }

  res.json({
    ok: true,
    body: {
      chats,
    },
  });
};

/* Fetch every message of a chat between two users */
export const fetchMessages = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user data */
  const user: User = req.body.decoded;
  const otherUserId = Number(req.params.uid);

  /* Get messages */
  let messages: Message[];

  try {
    /* Fetch messages from the db */
    messages = await db.getMessages(user.id, otherUserId);
  } catch (e) {
    return res.json({
      ok: false,
      message: "An error has ocurred ",
    });
  }

  res.json({
    ok: true,
    body: {
      messages,
    },
  });
};

/* Change the mood of a patient */
export const changeMood = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user data */
  const user: User = req.body.decoded;
  const newMood: Mood = req.body.mood;

  try {
    /* Change the mood stores in the db */
    await db.changeMood(user.id, newMood);
  } catch (e) {
    return res.json({
      ok: false,
      message: "An error has ocurred while changing your mood",
    });
  }

  res.json({
    ok: true,
  });
};

/* Fetch multiple quotes from type.fit -> total length of 1643 */
export const fetchQuotes = async (
  req: express.Request,
  res: express.Response
) => {
  /* Get quotes from the API */
  let listOfQuotes: Quote[];

  /* In case the API is down */
  try {
    listOfQuotes = <Quote[]>(
      (await axios.get("https://type.fit/api/quotes")).data
    );
  } catch (e) {
    return res.json({
      ok: false,
      message: "It seems the quote API is down",
    });
  }

  const randomIndex = Math.floor(Math.random() * 1638);

  /* Splice array to get only five random entries */
  const quotes = listOfQuotes.splice(randomIndex, 5);

  res.json({
    ok: true,
    quotes,
  });
};

/* Add another person to friends */
export const addFriends = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user data */
  const user: User = req.body.decoded;

  /* Get other user id */
  const id: number = Number(req.body.uid);

  try {
    /* Add friend request to the database */
    await db.addFriend(user.id, id);
  } catch (e) {
    return res.json({
      ok: false,
      message: "An error has ocurred while sending a friend request",
    });
  }

  res.json({
    ok: true,
  });
};

/* Fetch notifications for the user in session -> Currently only friend requests */
export const fetchNotifications = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user data */
  const user: User = req.body.decoded;
  let friendRequests: FriendRequest[];

  /* Get friend requests */
  try {
    friendRequests = await db.getFriendRequests(user.id);
  } catch (e) {
    return res.json({
      ok: false,
      message: "An error has ocurred while fetching your friend requests",
    });
  }

  res.json({
    ok: true,
    requests: friendRequests,
  });
};

/* Accept a friend requests from other user */
export const acceptFriend = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user data */
  const user: User = req.body.decoded;

  /* User ID that sent the friend request to current user in session */
  const uid: number = Number(req.body.uid);

  try {
    /* Change the state of the friend request in the db */
    await db.acceptFriendRequest(user.id, uid);
  } catch (e) {
    return res.json({
      ok: false,
      message: "An error has occurred while accepting the friend request",
    });
  }

  return res.json({
    ok: true,
  });
};
