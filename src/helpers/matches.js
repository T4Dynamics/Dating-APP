import * as dummyMatches from '../data/dummy.json';
import User from '../models/User.js';

const matches = [];

const match = (side, person) => {
    console.log(side);
}

const getMatches = async () => {
    await dummyMatches['default']['dummyData'].forEach((person) => {
        matches.push(new User(person));
    });
}

export { match, getMatches, matches }