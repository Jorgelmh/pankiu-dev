"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptFriend = exports.fetchNotifications = exports.addFriends = exports.fetchQuotes = exports.fetchMessages = exports.fetchChat = void 0;
const db = require("../../db/Database");
const axios_1 = require("axios");
/**
 *  ==============================
 *        REST API Controllers
 *  ==============================
 */
/* Fetch the chats of a specific user (only returns the last message) */
const fetchChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    let chats;
    try {
        /* Fetch chats from the db */
        chats = yield db.getChats(user.id);
    }
    catch (e) {
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
});
exports.fetchChat = fetchChat;
/* Fetch every message of a chat between two users */
const fetchMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    const otherUserId = Number(req.params.uid);
    /* Get messages */
    let messages;
    try {
        /* Fetch messages from the db */
        messages = yield db.getMessages(user.id, otherUserId);
    }
    catch (e) {
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
});
exports.fetchMessages = fetchMessages;
/* Fetch multiple quotes from type.fit -> total length of 1643 */
const fetchQuotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Get quotes from the API */
    let listOfQuotes;
    /* In case the API is down */
    try {
        listOfQuotes = ((yield axios_1.default.get("https://type.fit/api/quotes")).data);
    }
    catch (e) {
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
});
exports.fetchQuotes = fetchQuotes;
/* Add another person to friends */
const addFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    /* Get other user id */
    const id = Number(req.body.uid);
    try {
        /* Add friend request to the database */
        yield db.addFriend(user.id, id);
    }
    catch (e) {
        return res.json({
            ok: false,
            message: "An error has ocurred while sending a friend request",
        });
    }
    res.json({
        ok: true,
    });
});
exports.addFriends = addFriends;
/* Fetch notifications for the user in session -> Currently only friend requests */
const fetchNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    let friendRequests;
    /* Get friend requests */
    try {
        friendRequests = yield db.getFriendRequests(user.id);
    }
    catch (e) {
        return res.json({
            ok: false,
            message: "An error has ocurred while fetching your friend requests",
        });
    }
    res.json({
        ok: true,
        requests: friendRequests,
    });
});
exports.fetchNotifications = fetchNotifications;
/* Accept a friend requests from other user */
const acceptFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /* Model user data */
    const user = req.body.decoded;
    /* User ID that sent the friend request to current user in session */
    const uid = Number(req.body.uid);
    try {
        /* Change the state of the friend request in the db */
        yield db.acceptFriendRequest(user.id, uid);
    }
    catch (e) {
        return res.json({
            ok: false,
            message: "An error has occurred while accepting the friend request",
        });
    }
    return res.json({
        ok: true,
    });
});
exports.acceptFriend = acceptFriend;
//# sourceMappingURL=ApiController.js.map