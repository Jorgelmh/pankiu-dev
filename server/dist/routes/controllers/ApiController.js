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
exports.fetchQuotes = exports.changeMood = exports.fetchMessages = exports.fetchChat = void 0;
const controller = require("../../db/Database");
const axios_1 = require("axios");
/**
 *  ==============================
 *        REST API Controllers
 *  ==============================
 */
/* Fetch the chats of a specific user (only returns the last message) */
const fetchChat = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    let chats;
    try {
      /* Fetch chats from the db */
      chats = yield controller.getChats(user.id);
    } catch (e) {
      res.json({
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
  });
exports.fetchChat = fetchChat;
/* Fetch every message of a chat between two users */
const fetchMessages = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    const otherUserId = Number(req.params.uid);
    /* Get messages */
    let messages;
    try {
      /* Fetch messages from the db */
      messages = yield controller.getMessages(user.id, otherUserId);
    } catch (e) {
      res.json({
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
  });
exports.fetchMessages = fetchMessages;
/* Change the mood of a patient */
const changeMood = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    const newMood = req.body.mood;
    try {
      /* Change the mood stores in the db */
      yield controller.changeMood(user.id, newMood);
    } catch (e) {
      res.json({
        ok: false,
        message: "An error has ocurred while changing your mood",
      });
    }
    res.json({
      ok: true,
    });
  });
exports.changeMood = changeMood;
/* Fetch multiple quotes from type.fit -> total length of 1643 */
const fetchQuotes = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get quotes from the API */
    const listOfQuotes = (yield axios_1.default.get(
      "https://type.fit/api/quotes"
    )).data;
    const randomIndex = Math.floor(Math.random() * 1638);
    /* Splice array to get only five random entries */
    const quotes = listOfQuotes.splice(randomIndex, 5);
    res.json(quotes);
  });
exports.fetchQuotes = fetchQuotes;
//# sourceMappingURL=ApiController.js.map
