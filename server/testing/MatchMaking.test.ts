import MatchMaking from "../matchmaking/MatchMaking";
import { searchParam } from "../interfaces/search/PatientSearch";
import { Mood } from "../interfaces/entities/Patient";
import { PersonSearch } from "../interfaces/search/PersonSearch";
import { Language } from "../interfaces/QueueParam/Language";

/**
 *  ====================================
 *         TEST MATCHMAKING QUEUE
 *  ====================================
 */

const testingPeople: PersonSearch[] = [
  {
    socketid: "1",
    peerid: "1",
    user: {
      id: 1,
      mood: Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.only_counselor,
    language: [Language.English],
  },
  {
    socketid: "2",
    peerid: "1",
    user: {
      id: 2,
      mood: Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.only_counselor,
    language: [Language.English],
  },
  {
    socketid: "3",
    peerid: "1",
    user: {
      id: 3,
      mood: Mood.Happy,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.other_people,
    language: [Language.English],
  },
  {
    socketid: "4",
    peerid: "1",
    user: {
      id: 4,
      mood: Mood.Depressed,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.counselor_or_happy,
    language: [Language.English],
  },
  {
    socketid: "5",
    peerid: "1",
    user: {
      id: 5,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language.English],
  },
  {
    socketid: "6",
    peerid: "1",
    user: {
      id: 6,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language.English],
  },
  {
    socketid: "7",
    peerid: "1",
    user: {
      id: 7,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language.English],
  },
  {
    socketid: "8",
    peerid: "1",
    user: {
      id: 8,
      username: "TestUser",
      mood: Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.counselor_or_happy,
    language: [Language.English],
  },
  {
    socketid: "9",
    peerid: "1",
    user: {
      id: 9,
      username: "TestUser",
      mood: Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.counselor_or_happy,
    language: [Language.English],
  },
  {
    socketid: "10",
    peerid: "1",
    user: {
      id: 10,
      username: "TestUser",
      mood: Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.only_counselor,
    language: [Language.English],
  },
  {
    socketid: "11",
    peerid: "1",
    user: {
      id: 11,
      username: "TestUser",
      mood: Mood.Depressed,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.only_counselor,
    language: [Language.English],
  },
  {
    socketid: "12",
    peerid: "1",
    user: {
      id: 12,
      username: "TestUser",
      mood: Mood.Happy,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.other_people,
    language: [Language.English],
  },
  {
    socketid: "13",
    peerid: "1",
    user: {
      id: 13,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language.English],
  },
  {
    socketid: "14",
    peerid: "1",
    user: {
      id: 14,
      username: "TestUser",
      mood: Mood.Happy,
      isAdmin: false,
      email: "example@mail.com",
    },
    param: searchParam.other_people,
    language: [Language.English],
  },
  {
    socketid: "15",
    peerid: "1",
    user: {
      id: 15,
      username: "TestUser",
      mood: Mood.Depressed,
      isAdmin: false,
      email: "exmaple@mail.com",
    },
    param: searchParam.only_counselor,
    language: [Language.Spanish],
  },
  {
    socketid: "16",
    peerid: "1",
    user: {
      id: 16,
      username: "TestUser",
      isAdmin: false,
      email: "example@mail.com",
      rate: 1,
    },
    language: [Language.Spanish],
  },
];

/* Creating the testing instance */
let matchMaking: MatchMaking;
beforeAll(() => {
  matchMaking = new MatchMaking();
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
