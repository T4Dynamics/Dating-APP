import * as dummyMatches from '../data/dummy.json';
import User from '../models/User.js';

import { collection, getDocs, firebaseFirestore } from '../../config/firebase';

import * as Globals from '../helpers/globals';

const handleSwipe = (user, side) => {
    if (side === 'left') {
        console.log('left');
    } else if (side === 'right') {
        console.log('right');
    }

    Globals.matches.shift();
}

const getMatches = async (userId) => {
    if (Globals.matches.length > 0) return;

    const collectionRef = collection(firebaseFirestore, 'users');
    const snapshot = await getDocs(collectionRef);

    snapshot.forEach((doc) => {
        if (doc.id !== userId) {
            console.log(doc.id, '=>', doc.data());
            Globals.matches.push(new User(doc.data()));
        }
    });
}

export { handleSwipe, getMatches }