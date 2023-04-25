import { useEffect, useState } from 'react'
import { View, Text } from "react-native";

import { collection, getDocs, query, where, firebaseFirestore, doc, getDoc } from '../../config/firebase';
import * as Global from '../helpers/globals';
import Background from '../components/Background';
import Matches from '../components/Matches';

export default function MatchesScreen({ navigation }) {
    const [matches, setMatches] = useState([]);
    const [confirmedMatches, setConfirmedMatches] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const userId = await Global.getClientData('@user_id');
            const potentialMatches = await fetchPotentialMatches(userId);

            setMatches(potentialMatches.potentialMatches);
            setConfirmedMatches(potentialMatches.confirmedMatches);
        };

        fetchData();
    }, []);

    const fetchPotentialMatches = async (userId) => {
        const potentialMatchesRef = collection(firebaseFirestore, 'potential_matches');
        const userRef = doc(firebaseFirestore, 'users', userId);
        const q = query(potentialMatchesRef, where("match_ref", "==", userRef));
        const potentialMatchesSnapshot = await getDocs(q);
      
        const promises = potentialMatchesSnapshot.docs.map(async (document) => {
            const data = document.data();
            
            if (data.user_like === 'LIKE' && data.match_like === 'NONE') {
                return data;
            } else if (data.user_like === 'LIKE' && data.match_like === 'LIKE') {
                const otherUserRef = data.user_ref;
                const userDoc = await getDoc(otherUserRef);
            
                if (userDoc.exists()) {
                    return userDoc.data();
                }
            }
        });
      
        const potentialMatches = [];
        const confirmedMatches = [];
      
        const resolvedPromises = await Promise.all(promises);
      
        resolvedPromises.forEach((promise) => {
            if (promise) {
                console.log(promise);
                if (promise.hasOwnProperty('name')) {
                    confirmedMatches.push(promise);
                } else {
                    console.log(promise);
                    potentialMatches.push(promise);
                }
            }
        });
      
        return { 
            potentialMatches, 
            confirmedMatches 
        };
    };

    return (
        <Background>
            <Text>Matches Screen</Text>
            <Text>You have {matches.length} new matches</Text>
            { confirmedMatches.map((match, index) => <Matches matchData={match} index={index}/> )}
        </Background>
    );
}