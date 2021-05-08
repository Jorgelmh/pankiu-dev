/**
 *  ===================================
 *      Abstract model for a User
 *  ===================================
 */

export default interface User {
    username: string,
    email: string,
    isAdmin: boolean,
}