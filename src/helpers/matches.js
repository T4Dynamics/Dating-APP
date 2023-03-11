import * as dummyMatches from '../data/dummy.json';
import User from '../models/User.js';

const matches = [];

const match = (side, person, navigation) => {
    console.log(person);
    console.log(matches);
    if (matches.find(match => match === person)) {
        const index = matches.findIndex(match => match === person);
        matches.splice(index, 1);

        navigation.navigate('HomeScreen', {});

        console.log(matches);

        if (side === 'left') {
            console.log('left');
        } else {
            console.log('right');
        }
    }
}

const getMatches = async () => {
    if (matches.length > 0) return;
    await dummyMatches['default']['dummyData'].forEach((person) => {
        matches.push(new User(person));
    });
}

export { match, getMatches, matches }