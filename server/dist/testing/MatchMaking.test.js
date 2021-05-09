"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MatchMaking_1 = require("../matchmaking/MatchMaking");
const PatientSearch_1 = require("../interfaces/search/PatientSearch");
const Patient_1 = require("../interfaces/entities/Patient");
/**
 *  ====================================
 *         TEST MATCHMAKING QUEUE
 *  ====================================
 */
const testingPeople = [
  {
    id: "1",
    user: {
      mood: Patient_1.Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
  },
  {
    id: "2",
    user: {
      mood: Patient_1.Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
  },
  {
    id: "3",
    user: {
      mood: Patient_1.Mood.Happy,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.other_people,
  },
  {
    id: "4",
    user: {
      mood: Patient_1.Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.counselor_or_happy,
  },
  {
    id: "5",
    user: {
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
  },
  {
    id: "6",
    user: {
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
  },
  {
    id: "7",
    user: {
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
  },
  {
    id: "8",
    user: {
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.counselor_or_happy,
  },
  {
    id: "9",
    user: {
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.counselor_or_happy,
  },
  {
    id: "10",
    user: {
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
  },
  {
    id: "11",
    user: {
      username: "TestUser",
      mood: Patient_1.Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.only_counselor,
  },
  {
    id: "12",
    user: {
      username: "TestUser",
      mood: Patient_1.Mood.Happy,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.other_people,
  },
  {
    id: "13",
    user: {
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
  },
  {
    id: "14",
    user: {
      username: "TestUser",
      mood: Patient_1.Mood.Happy,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: PatientSearch_1.searchParam.other_people,
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
  for (let i = 5; i < testingPeople.length; i++)
    matchMaking.addPerson(testingPeople[i]);
  expect(matchMaking.getPatientQueue()[0]).toEqual(testingPeople[10]);
  expect(matchMaking.getPatientQueue()[1]).toEqual(testingPeople[13]);
  expect(matchMaking.getPatientQueue().length).toBe(2);
  expect(matchMaking.getCounselorQueue().length).toBe(0);
  done();
});
//# sourceMappingURL=MatchMaking.test.js.map
