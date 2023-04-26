import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native';

import { collection, getDocs, query, where, firebaseFirestore, doc, getDoc } from '../../config/firebase';
import * as Global from '../helpers/globals';
import Background from '../components/Background';
import Match from '../components/Match';
import Message from '../components/Message';
import Header from '../components/Header';

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
                    return {
                        potentialMatchDoc: data,
                        matchData: userDoc.data()
                    };
                }
            }
        });
      
        const potentialMatches = [];
        const confirmedMatches = [];
      
        const resolvedPromises = await Promise.all(promises);
      
        resolvedPromises.forEach((promise) => {
            if (promise) {
                if (promise.hasOwnProperty('matchData')) {
                    confirmedMatches.push(promise);
                } else {
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
            <Header navigation={navigation} screen='ProfileScreen'/>
            <View style={styles.container}>
                <Text>Matches</Text>
                <ScrollView
                    style={{ flexGrow: 0, height: '20%', width: '100%', paddingTop: 10 }}
                    horizontal={true}
                    contentContainerStyle={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                >
                    <Match likeAmount={matches.length}/>
                    { confirmedMatches.map((match, index) => !match.potentialMatchDoc.messaged ? <Match data={match} key={`match-${index}`} navigation={navigation}/> : null ) }
                </ScrollView>
                <Text>Messages</Text>
                <ScrollView
                    style={{ flexGrow: 0, height: '50%', paddingTop: 10 }}
                    contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                    { confirmedMatches.map((match, index) => match.potentialMatchDoc.messaged ? <Message data={match} key={`message-${index}`} navigation={navigation}/> : null ) }
                </ScrollView>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    }
});