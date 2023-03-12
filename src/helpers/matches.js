import * as dummyMatches from '../data/dummy.json';
import User from '../models/User.js';

const matches = [];

const handleSwipe = (user, side) => {
    if (side === 'left') {
        console.log('left');
    } else if (side === 'right') {
        console.log('right');
    }

    matches.shift();
}

const getMatches = async () => {
    if (matches.length > 0) return;
    await dummyMatches['default']['dummyData'].forEach((person) => {
        matches.push(new User(person));
    });
}

export { handleSwipe, getMatches, matches }