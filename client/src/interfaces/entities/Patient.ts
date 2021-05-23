import User from "./User";

export enum Mood {
  Normal = "Normal",
  Depressed = "Depressed",
  Anxious = "Anxious",
  Stressed = "Stressed",
  Lonely = "Lonely",
  Happy = "Happy",
}

/**
 *  ============================
 *      Model Patients' data
 *  ============================
 */

export default interface Patient extends User {
  mood: Mood;
}
