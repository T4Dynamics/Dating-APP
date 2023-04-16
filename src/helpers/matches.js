import * as dummyMatches from '../data/dummy.json';
import User from '../models/User.js';

import { collection, getDocs, firebaseFirestore } from '../../config/firebase';

import * as Global from '../helpers/globals';

const handleSwipe = (user, side) => {
    if (side === 'left') {
        console.log('left');
    } else if (side === 'right') {
        console.log('right');
    }

    Global.matches.shift();
}

const getMatches = async (userId) => {
    if (Global.matches.length > 0) return;

    const collectionRef = collection(firebaseFirestore, 'users');
    const snapshot = await getDocs(collectionRef);

    snapshot.forEach((doc) => {
        if (doc.id !== userId) {
            console.log(doc.id, '=>', doc.data());
            Global.matches.push(new User(doc.data()));
        }
    });
}

export { handleSwipe, getMatches }