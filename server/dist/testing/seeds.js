"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counselor = exports.Patient = void 0;
const Patient_1 = require("../interfaces/entities/Patient");
/**
 *  ============================
 *      TESTING USER'S DATA
 *  ============================
 */
exports.Patient = {
    username: 'Jorge',
    password: '12345678',
    email: 'example@email.com',
    mood: Patient_1.Mood.Depressed
};
exports.Counselor = {
    username: 'Damiand',
    password: '12345678',
    email: 'example2@email.com',
    university: 'UoS',
    graduated: false
};
//# sourceMappingURL=seeds.js.map