import { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';

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

        const q1 = query(potentialMatchesRef, where("user_ref", "==", userRef));
        const q2 = query(potentialMatchesRef, where("match_ref", "==", userRef));
        
        const potentialMatchesSnapshot1 = await getDocs(q1);
        const potentialMatchesSnapshot2 = await getDocs(q2);

        const potentialMatchesSnapshot = [...potentialMatchesSnapshot1.docs, ...potentialMatchesSnapshot2.docs];
      
        const promises = potentialMatchesSnapshot.map(async (document) => {
            const data = document.data();
            
            if (data.user_like === 'LIKE' && data.match_like === 'NONE') {
                console.log('potential match', data);
                return data;
            } else if (data.user_like === 'LIKE' && data.match_like === 'LIKE') {
                const otherUserRef = data.user_ref._key.path.segments[6] == userId ? data.match_ref : data.user_ref;
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
            <Header navigation={navigation} screen='ProfileScreen' toggle={true}/>
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

                <TouchableOpacity style={[styles.premiumContainer]} onPress={() => navigation.navigate('Profile', { screen: 'SubscriptionScreen' })}>
                    <Text>
                        Slider Premium
                    </Text>
                </TouchableOpacity>

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
        width: '100%',
        ...Platform.select({
            android: {
                marginTop: Dimensions.get('window').height * .10, 
            },
        }),
    },
    premiumContainer: {
        width: '90%',
        height: '10%',
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
});