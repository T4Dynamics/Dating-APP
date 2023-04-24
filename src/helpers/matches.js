import User from '../models/User.js';

import { collection, getDocs, firebaseFirestore } from '../../config/firebase';

import * as Global from '../helpers/globals';

const handleSwipe = async (match, side) => {
    console.log('handleSwipe', match, side);
    const userId = await Global.getClientData('@user_id');

    if (side === 'left') {
        createMatch(match.id, userId, false);
    } else if (side === 'right') {
        createMatch(match.id, userId, true);
    }

    Global.matches.shift();
}

const createMatch = async (userId, profileId, likeType) => {
    try {
        const matchesRef = collection(firebaseFirestore, 'potential_matches');
        const newMatchRef = doc(matchesRef);
    
        const data = {
            match_ref: `/users/${userId}`,
            user_ref: `/users/${profileId}`,
            match_like: 'NONE',
            user_like: (likeType ? 'LIKE' : 'DISLIKE') ?? 'NONE',
        };
    
        await setDoc(newMatchRef, data);
        console.log('Match created with ID:', newMatchRef.id);
      } catch (e) {
        console.error('Error creating match:', e);
      }
}

export { handleSwipe }