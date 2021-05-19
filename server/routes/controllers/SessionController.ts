import * as express from "express";
import * as db from "../../db/Database";
import * as jwt from "jsonwebtoken";
import Patient from "../../interfaces/entities/Patient";
import Counselor from "../../interfaces/entities/Counselor";
import User from "../../interfaces/entities/User";

/**
 *  =======================================
 *          SESSION API CONTROLLERS
 *  =======================================
 */

/* Register a new user in the app */
export const register = async (req: express.Request, res: express.Response) => {
  /* Get new user's data */
  const password: string = req.body.password;
  const username: string = req.body.username;
  const email: string = req.body.email;

  /* Error message in case there's a problem or id if everything works fine */
  let response;

  /* Register new patient on the db */
  if (req.body.mood) {
    /* Store error message from db */
    response = await db.registerPatient(
      username,
      password,
      email,
      req.body.mood
    );
  } else {
    /* If no mood is sent then this is a counselor */
    response = await db.registerCounselor(
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
    let payload: Patient | Counselor;

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
};

/* Login a user and return a session token */
export const login = async (req: express.Request, res: express.Response) => {
  /* Get login credentials */
  const username: string = req.body.username;
  const password: string = req.body.password;

  let credentialsOk: Patient | Counselor;

  try {
    /* Connect with the database */
    credentialsOk = await db.authenticateUser(username, password);
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
};

/* Update user's details in the db */
export const updateDetails = async (
  req: express.Request,
  res: express.Response
) => {
  /* Model user's data */
  const user: Patient | Counselor = req.body.decoded;

  /* Check what needs to be changed */
  if (req.body.username) {
    /* Make the connection with the db */
    try {
      await db.updateUsername(user.id, req.body.username);
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
      await db.updatePassword(user.id, req.body.password);
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
      await db.updateEmail(user.id, req.body.email);
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
};
