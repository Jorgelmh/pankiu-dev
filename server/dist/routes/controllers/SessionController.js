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
exports.updateDetails = exports.login = exports.register = void 0;
const db = require("../../db/Database");
const jwt = require("jsonwebtoken");
/**
 *  =======================================
 *          SESSION API CONTROLLERS
 *  =======================================
 */
/* Register a new user in the app */
const register = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get new user's data */
    const password = req.body.password;
    const username = req.body.username;
    const email = req.body.email;
    /* Error message in case there's a problem or id if everything works fine */
    let response;
    /* Register new patient on the db */
    if (req.body.mood) {
      /* Store error message from db */
      response = yield db.registerPatient(
        username,
        password,
        email,
        req.body.mood
      );
    } else {
      /* If no mood is sent then this is a counselor */
      response = yield db.registerCounselor(
        username,
        password,
        email,
        req.body.university,
        req.body.graduated
      );
    }
    if (response.message) {
      res.json({
        ok: false,
        message: response.message,
      });
    } else {
      /* Data that will be stored in the session token */
      let payload;
      if (req.body.mood) {
        /* Payload for a patient session */
        payload = {
          id: response.id,
          username,
          email,
          isAdmin: false,
          mood: req.body.mood,
        };
      } else {
        /* Payload for a counselor session */
        payload = {
          id: response.id,
          username,
          email,
          isAdmin: false,
          rate: 5,
        };
      }
      jwt.sign(payload, process.env.secret, (err, token) => {
        /* If error return message */
        if (err) {
          return res.json({
            ok: false,
            message: "A problem has occurred when creating a session",
          });
        }
        res.json({
          ok: true,
          token,
        });
      });
    }
  });
exports.register = register;
/* Login a user and return a session token */
const login = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Get login credentials */
    const username = req.body.username;
    const password = req.body.password;
    let credentialsOk;
    try {
      /* Connect with the database */
      credentialsOk = yield db.authenticateUser(username, password);
    } catch (e) {
      return res.json({
        ok: false,
        message: "An error has occurred while connecting to the database",
      });
    }
    /* Check if a payload has been returned */
    if (credentialsOk) {
      /* Create a JWT for the session */
      jwt.sign(credentialsOk, process.env.secret, (err, token) => {
        if (err) {
          return res.json({
            ok: false,
            message: "An error has occurred while creating a session otken",
          });
        }
        return res.json({
          ok: true,
          token,
        });
      });
    } else {
      /* Invalid credentials because no payload was returned from authentication */
      return res.json({
        ok: false,
        message: "Invalid Credentials",
      });
    }
  });
exports.login = login;
/* Update user's details in the db */
const updateDetails = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    /* Model user's data */
    const user = req.body.decoded;
    /* Check what needs to be changed */
    if (req.body.username) {
      /* Make the connection with the db */
      try {
        yield db.updateUsername(user.id, req.body.username);
      } catch (e) {
        return res.json({
          ok: false,
          message:
            "An error has occurred while changing your username, probably the new username is already taken",
        });
      }
      /* Update JWT payload */
      user.username = req.body.username;
    }
    if (req.body.password) {
      /* Make the connection with the db */
      try {
        yield db.updatePassword(user.id, req.body.password);
      } catch (e) {
        return res.json({
          ok: false,
          message: "An error has occurred while changing your password",
        });
      }
    }
    if (req.body.email) {
      /* Make the connection with the db */
      try {
        yield db.updateEmail(user.id, req.body.email);
      } catch (e) {
        return res.json({
          ok: false,
          message:
            "An error has occurred while changing your email, probably the new email is already taken",
        });
      }
      /* Update JWT payload */
      user.email = req.body.email;
    }
    jwt.sign(user, process.env.secret, (err, token) => {
      /* Check if there's an error */
      if (err) {
        return res.json({
          ok: false,
          message: "Error while creating a new session token",
        });
      }
      return res.json({
        ok: true,
        token,
      });
    });
  });
exports.updateDetails = updateDetails;
//# sourceMappingURL=SessionController.js.map
