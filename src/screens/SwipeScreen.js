import { useRef, useEffect, useState } from 'react';

// Components
import Background from "../components/Background";
import Header from "../components/Header";
import CardItem from "../components/CardItem";

import User from '../models/User.js';

import { StyleSheet, Text, Animated, PanResponder, View } from "react-native";
import { Icon } from 'react-native-elements'

import * as Global from '../helpers/globals';

import { collection, getDocs, firebaseFirestore, doc, setDoc, query, where, updateDoc } from '../../config/firebase';

import { theme } from '../theme';

export default function SwipeScreen({ navigation }) {

    const [matches, setMatches] = useState([]);
    const [match, setMatch] = useState(null);
    const [swipe, setSwipe] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            if (Object.keys(Global.matches).length === 0) {
                const loggedInUserId = await Global.getClientData('@user_id');
        
                const potentialMatchesRef = collection(firebaseFirestore, 'potential_matches');
                const potentialMatchesSnapshot = await getDocs(potentialMatchesRef);
        
                const swipedUserIds = new Set();
                potentialMatchesSnapshot.forEach((document) => {
                    const data = document.data();
                    console.log('matches', data);
                    if (data.user_id === loggedInUserId && (data.user_like === 'LIKE' || data.user_like === 'DISLIKE') && (data.match_like === 'LIKE' || data.match_like === 'DISLIKE')) {
                        const swipedUserId = data.match_ref.id;
                        swipedUserIds.add(swipedUserId);
                    }
                });
        
                const collectionRef = collection(firebaseFirestore, 'users');
                getDocs(collectionRef).then((snapshot) => {
                    const matches = {};
                    snapshot.forEach((doc) => {
                        const userId = doc.id;
                        if (userId !== loggedInUserId && !swipedUserIds.has(userId)) {
                            console.log('profiles', doc);
                            matches[userId] = new User(doc.data(), userId);
                        }
                    });
        
                    Global.storeClientData('@matches_loaded', "true");
                    setMatches(matches);
                });
            }
        };
        
        fetchData();
    }, []);
    
    useEffect(() => {
        const match = matches[Object.keys(matches)[0]];

        if (match) {
          setMatch(match);
        }
      }, [matches]);
    
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = 
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
              const {dx, dy} = gestureState;
              return dx > 2 || dx < -2 || dy > 2 || dy < -2;
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
              const {dx, dy} = gestureState;
              return dx > 2 || dx < -2 || dy > 2 || dy < -2;
            },
            onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {
              useNativeDriver: false,
            }),
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dx > 150) {
                    if (Object.keys(matches).length) setSwipe("right");
                } else if (gestureState.dx < -150) {
                    if (Object.keys(matches).length) setSwipe("left");
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        });
    
    const rotate = pan.x.interpolate({
        inputRange: [-300, 0, 300],
        outputRange: ['-30deg', '0deg', '30deg'],
        extrapolate: 'clamp',
    });

    const handleSwipe = async (match, side) => {
        const userId = await Global.getClientData('@user_id');
        createMatch(match, userId, likeType = side === 'right' ? true : false);
        setMatches(matches => {
            const { [match.id]: _, ...updatedMatches } = matches;
            return updatedMatches;
        });
    }
    
    const createMatch = async (match, userId, likeType) => {
        try {
            const matchRef = doc(firebaseFirestore, 'users', match.id);
            const userRef = doc(firebaseFirestore, 'users', userId);
    
            const q = query(collection(firebaseFirestore, 'potential_matches'), where('user_ref', '==', userRef), where('match_ref', '==', matchRef));
            const snapshot = await getDocs(q);

            console.log('snapshot', snapshot);
    
            const data = {
                match_ref: matchRef,
                user_ref: userRef,
                match_like: 'NONE',
                user_like: likeType ? 'LIKE' : 'DISLIKE',
            };
    
            if (!snapshot.empty) {
                data.match_like = likeType ? 'LIKE' : 'DISLIKE';
                const docId = snapshot.docs[0].id;
                await updateDoc(doc(firebaseFirestore, 'potential_matches', docId), data);
                console.log('Match updated with ID:', docId);
            } else {
                const newDocRef = doc(collection(firebaseFirestore, 'potential_matches'));
                await setDoc(newDocRef, data);
                console.log('Match created with ID:', newDocRef.id);
            }
        } catch (error) {
            console.error('Error creating or updating match:', error);
        }
    };

    if (swipe === 'left' || swipe === 'right') {
        console.log('swipe', swipe);
        handleSwipe(match, swipe);
        setSwipe('');
    }

    return (
        <Background>
            <Header
                navigation={navigation}
            />

            { 
                match ? matchCard(match, pan, panResponder, rotate) : 
                Global.matchesLoaded == false ? undefinedMatches(pan, panResponder, rotate, 'Loading...') :
                    undefinedMatches(pan, panResponder, rotate, 'No More Matches') 
            }

        </Background>
    );
}

const matchCard = (match, pan, panResponder, rotate) => {
    return (
        <Animated.View
            style={[
                pan.getLayout(), 
                styles.container, 
                {transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { rotate: rotate }
                ]}
            ]}
            {...panResponder.panHandlers}
        >
            <View style={styles.person}>
                <Text style={styles.heading}>{match.name}</Text>
                <Text style={styles.heading}>{match.age}</Text>
            </View>
            <Text style={styles.text}>{match.description}</Text>
            <View style={styles.children}>
                { 
                    match.getLikes().map((e, index) => {
                        return (
                            <CardItem key={'item-' + index}>
                                <Text>{e}</Text>
                            </CardItem>
                        )
                    })
                }
            </View>
            <View style={styles.row}>
                <Icon
                    name='thumb-down'
                    type='material-community'
                    color='red'
                    style={styles.icon}
                    size={50}
                />

                <Icon
                    name='thumb-up'
                    type='material-community'
                    color='green'
                    style={styles.icon}
                    size={50}
                />
            </View>
        </Animated.View>
    )
}

const undefinedMatches = (pan, panResponder, rotate, text) => {
    return (
        <Animated.View
            style={[
                pan.getLayout(), 
                styles.container, 
                {transform: [
                    { translateX: pan.x },
                    { translateY: pan.y },
                    { rotate: rotate }
                ]}
            ]}
            {...panResponder.panHandlers}
        >
            <Text style={[styles.heading, styles.noMatches]}>{ text }</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: '5%',
        top: '15%',
        width: '90%',
        height: '65%',
        padding: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.accent,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.4,
        shadowRadius: 2,  
        elevation: 3
    },
    row: {
        width: '75%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icons: {
        width: '30%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icon: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderBottomWidth: 0,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 2,
        shadowRadius: 2,
        elevation: 1,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        backgroundColor: 'white',
        borderRadius: 25,
        padding: 10,
    },
    person: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text: {
        width: '75%',
        fontSize: 14,
        textAlign: 'center',
    },
    children: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});