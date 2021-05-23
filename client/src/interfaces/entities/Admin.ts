import User from "./User";

/**
 *  ============================
 *      Model Patients' data
 *  ============================
 */
export default interface Admin extends User {
  isAdmin: true;
}
