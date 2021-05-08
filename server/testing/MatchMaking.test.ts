import MatchMaking from '../matchmaking/MatchMaking'
import { searchParam } from '../interfaces/search/PatientSearch'
import { Mood } from '../interfaces/entities/Patient'
import PatientSearch from '../interfaces/search/PatientSearch'
import { PersonSearch } from '../interfaces/search/PersonSearch'

const person = {
    id: '1',
        user: {
            mood: Mood.Depressed,
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.only_counselor
}

const testingPeople : PersonSearch[] = [
    {
        id: '1',
        user: {
            mood: Mood.Depressed,
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.only_counselor
    },
    {
        id: '2',
        user: {
            mood: Mood.Depressed,
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.only_counselor
    },
    {
        id: '3',
        user: {
            mood: Mood.Happy,
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.other_people
    },
    {
        id: '4',
        user: {
            mood: Mood.Depressed,
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.counselor_or_happy
    },
    {
        id: '5',
        user: {
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com',
            rate: 1
        },
    },
    {
        id: '6',
         user: {
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com',
            rate: 1
        }
    },
    {
        id: '7',
         user: {
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com',
            rate: 1
        }
    },
    {
        id: '8',
        user: {
            username: 'TestUser',
            mood: Mood.Depressed,
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.counselor_or_happy
    },
    {
        id: '9',
        user: {
            username: 'TestUser',
            mood: Mood.Depressed,
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.counselor_or_happy
    },
    {
        id: '10',
        user:{
            username: 'TestUser',
            mood: Mood.Depressed,
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.only_counselor
    },
    {
        id: '11',
        user: {
            username: 'TestUser',
            mood: Mood.Depressed,
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.only_counselor
    },
    {
        id: '12',
        user: {
            username: 'TestUser',
            mood: Mood.Happy,
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.other_people
    },
    {
        id: '13',
        user: {
            username: 'TestUser',
            isAdmin: false,
            email: 'example@mail.com',
            rate: 1
        }
    },
    {
        id: '14',
        user: {
            username: 'TestUser',
            mood: Mood.Happy,
            isAdmin: false,
            email: 'example@mail.com'
        },
        param: searchParam.other_people
    }
]

/* Creating the testing instance */
let matchMaking: MatchMaking
beforeAll(() => {
    matchMaking = new MatchMaking()
})

test('Adding people to the Queue', done => {

    /* Adding to people who can't be matched */
    expect(matchMaking.addPerson(testingPeople[0])).toBeNull()
    expect(matchMaking.addPerson(testingPeople[1])).toBeNull()

    /* Check that both people have been correctly stored in their corresponding queue */
    expect(matchMaking.getPatientQueue().length).toBe(2)
    expect(matchMaking.getCounselorQueue().length).toBe(0)
    done()
})

test('Matching with happy people', done => {
    /* Adding two people who can be match together */
    expect(matchMaking.addPerson(testingPeople[2])).toBeNull()
    expect(matchMaking.addPerson(testingPeople[3])).toEqual([testingPeople[2], testingPeople[3]])
    done()
})

test('Adding a counselor', done => {
    /* Counselor should be match with the oldest person in the queue */
    expect(matchMaking.addPerson(testingPeople[4])).toEqual([testingPeople[4], testingPeople[0]])
    done()
})

test('Checking the system with more users', done => {
    /* Adding the rest to check what it ends up with */
    for(let i = 5; i < testingPeople.length; i++)
        matchMaking.addPerson(testingPeople[i])
    
    expect(matchMaking.getPatientQueue()[0]).toEqual(testingPeople[10])
    expect(matchMaking.getPatientQueue()[1]).toEqual(testingPeople[13])

    expect(matchMaking.getPatientQueue().length).toBe(2)
    expect(matchMaking.getCounselorQueue().length).toBe(0)
    done()
})