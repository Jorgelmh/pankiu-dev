/**
 *  ===================================
 *      Abstract model for a User
 *  ===================================
 */
/* Database id */
export default interface User {
  id: number | string;
  username: string;
  email: string;
  isAdmin: boolean;
}
