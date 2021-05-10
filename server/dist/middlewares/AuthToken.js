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
exports.decodeCounselorJWT = exports.decodePatientJWT = void 0;
const Patient_1 = require("../interfaces/entities/Patient");
/**
 *  ==========================
 *      OPERATIONS ON JWT
 *  ==========================
 */
const decodePatientJWT = (token) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const obj = {
      id: 1,
      username: "Example",
      email: "example@email.com",
      isAdmin: false,
      mood: Patient_1.Mood.Happy,
    };
    return obj;
  });
exports.decodePatientJWT = decodePatientJWT;
const decodeCounselorJWT = (token) =>
  __awaiter(void 0, void 0, void 0, function* () {
    const obj = {
      id: 2,
      username: "Example",
      email: "example@email.com",
      isAdmin: false,
      rate: 5,
    };
    return obj;
  });
exports.decodeCounselorJWT = decodeCounselorJWT;
//# sourceMappingURL=AuthToken.js.map
