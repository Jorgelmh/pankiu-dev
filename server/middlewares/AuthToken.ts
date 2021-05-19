import Counselor from "../interfaces/entities/Counselor";
import Patient, { Mood } from "../interfaces/entities/Patient";
import * as express from "express";
import * as jwt from "jsonwebtoken";

/**
 *  ==========================
 *      OPERATIONS ON JWT
 *  ==========================
 */

export const decodePatientJWT = async (token: string): Promise<Patient> => {
  const obj = {
    id: 1,
    username: "Example",
    email: "example@email.com",
    isAdmin: false,
    mood: Mood.Happy,
  };

  return obj;
};

export const decodeCounselorJWT = async (token: string): Promise<Counselor> => {
  const obj: Counselor = {
    id: 2,
    username: "Example",
    email: "example@email.com",
    isAdmin: false,
    rate: 5,
  };

  return obj;
};

/**
 *  ========================================
 *      MIDDLEWARE TO AUTHENTICATE JWT
 *  ========================================
 */
export const AuthToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  /* Get token from headers */
  const token = String(req.headers.token);

  /* Check whether a token has been sent along with the request */
  if (token) {
    jwt.verify(
      token,
      process.env.secret,
      (err: Error, decoded: Patient | Counselor) => {
        /* If the token expired or not valid anymore redirect to login */
        if (err) {
          res.json({
            ok: false,
            redirect: "/login",
          });
        } else {
          req.body.decoded = decoded;
          next();
        }
      }
    );
  } else {
    /* In case no token has been sent to this request */
    res.json({
      ok: false,
      redirect: "/login",
    });
  }
};
