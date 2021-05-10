"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MatchMaking_1 = require("../matchmaking/MatchMaking");
const PatientSearch_1 = require("../interfaces/search/PatientSearch");
const Patient_1 = require("../interfaces/entities/Patient");
const Language_1 = require("../interfaces/QueueParam/Language");
/**
 *  ====================================
 *         TEST MATCHMAKING QUEUE
 *  ====================================
 */
const testingPeople = [
  {
    socketid: "1",
    user: {
      id: 1,
      mood: Patient_1.Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
    language: [Language_1.Language.English],
  },
  {
    socketid: "2",
    user: {
      id: 2,
      mood: Patient_1.Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
    language: [Language_1.Language.English],
  },
  {
    socketid: "3",
    user: {
      id: 3,
      mood: Patient_1.Mood.Happy,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.other_people,
    language: [Language_1.Language.English],
  },
  {
    socketid: "4",
    user: {
      id: 4,
      mood: Patient_1.Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.counselor_or_happy,
    language: [Language_1.Language.English],
  },
  {
    socketid: "5",
    user: {
      id: 5,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language_1.Language.English],
  },
  {
    socketid: "6",
    user: {
      id: 6,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language_1.Language.English],
  },
  {
    socketid: "7",
    user: {
      id: 7,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language_1.Language.English],
  },
  {
    socketid: "8",
    user: {
      id: 8,
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.counselor_or_happy,
    language: [Language_1.Language.English],
  },
  {
    socketid: "9",
    user: {
      id: 9,
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.counselor_or_happy,
    language: [Language_1.Language.English],
  },
  {
    socketid: "10",
    user: {
      id: 10,
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
    language: [Language_1.Language.English],
  },
  {
    socketid: "11",
    user: {
      id: 11,
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
    language: [Language_1.Language.English],
  },
  {
    socketid: "12",
    user: {
      id: 12,
      username: "TestUser",
      mood: Patient_1.Mood.Happy,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.other_people,
    language: [Language_1.Language.English],
  },
  {
    socketid: "13",
    user: {
      id: 13,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language_1.Language.English],
  },
  {
    socketid: "14",
    user: {
      id: 14,
      username: "TestUser",
      mood: Patient_1.Mood.Happy,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.other_people,
    language: [Language_1.Language.English],
  },
  {
    socketid: "15",
    user: {
      id: 15,
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "exmaple@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
    language: [Language_1.Language.Spanish],
  },
  {
    socketid: "16",
    user: {
      id: 16,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language_1.Language.Spanish],
  },
];
/* Creating the testing instance */
let matchMaking;
beforeAll(() => {
  matchMaking = new MatchMaking_1.default();
});
test("Adding people to the Queue", (done) => {
  /* Adding to people who can't be matched */
  expect(matchMaking.addPerson(testingPeople[0])).toBeNull();
  expect(matchMaking.addPerson(testingPeople[1])).toBeNull();
  /* Check that both people have been correctly stored in their corresponding queue */
  expect(matchMaking.getPatientQueue().length).toBe(2);
  expect(matchMaking.getCounselorQueue().length).toBe(0);
  done();
});
test("Matching with happy people", (done) => {
  /* Adding two people who can be match together */
  expect(matchMaking.addPerson(testingPeople[2])).toBeNull();
  expect(matchMaking.addPerson(testingPeople[3])).toEqual([
    testingPeople[2],
    testingPeople[3],
  ]);
  done();
});
test("Adding a counselor", (done) => {
  /* Counselor should be match with the oldest person in the queue */
  expect(matchMaking.addPerson(testingPeople[4])).toEqual([
    testingPeople[4],
    testingPeople[0],
  ]);
  done();
});
test("Checking the system with more users", (done) => {
  /* Adding the rest to check what it ends up with */
  for (let i = 5; i < testingPeople.length - 2; i++)
    matchMaking.addPerson(testingPeople[i]);
  expect(matchMaking.getPatientQueue()[0]).toEqual(testingPeople[10]);
  expect(matchMaking.getPatientQueue()[1]).toEqual(testingPeople[13]);
  expect(matchMaking.getPatientQueue().length).toBe(2);
  expect(matchMaking.getCounselorQueue().length).toBe(0);
  done();
});
test("Add and Match two Spanish speakers", (done) => {
  expect(matchMaking.addPerson(testingPeople[14])).toBeNull();
  expect(matchMaking.addPerson(testingPeople[15])).toEqual([
    testingPeople[15],
    testingPeople[14],
  ]);
  done();
});
//# sourceMappingURL=MatchMaking.test.js.map
