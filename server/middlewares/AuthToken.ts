import Counselor from "../interfaces/entities/Counselor";
import Patient, { Mood } from "../interfaces/entities/Patient";
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
