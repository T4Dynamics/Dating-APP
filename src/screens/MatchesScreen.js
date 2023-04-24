import { useEffect, useState } from 'react'
import { View, Text } from "react-native";

import { collection, getDocs, query, where, firebaseFirestore, doc, getDoc } from '../../config/firebase';
import * as Global from '../helpers/globals';
import Background from '../components/Background';

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

        const potentialMatches = [];
        const confirmedMatches = [];

        await Promise.all(potentialMatchesSnapshot.docs.map(async (document) => {
            const data = document.data();

            if (data.user_like === 'LIKE' && data.match_like === 'NONE') {
                potentialMatches.push(data);
            } else if (data.user_like === 'LIKE' && data.match_like === 'LIKE') {
                const otherUserRef = data.user_ref;
                const userDoc = await getDoc(otherUserRef);

                if (userDoc.exists()) confirmedMatches.push(userDoc.data());
            }
        }));

        return { 
            potentialMatches, 
            confirmedMatches 
        };
    };

    console.log('matches', matches);

    return (
        <Background>
            <Text>Matches Screen</Text>
            <Text>You have {matches.length} new matches</Text>
            {matches.length > 0 && <Text>{matches[0].user_ref.path}</Text>}
        </Background>
    );
}