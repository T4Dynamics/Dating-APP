import { useRef, useEffect, useState } from 'react';

// Components
import Background from "../components/Background";
import Header from "../components/Header";
import CardItem from "../components/CardItem";
import User from '../models/User.js';

import { StyleSheet, Text, Animated, PanResponder, View, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { Icon } from 'react-native-elements'

import * as Global from '../helpers/globals';
import * as advertisements from '../data/advertisements.json';

import { collection, getDocs, firebaseFirestore, doc, setDoc, query, where, updateDoc, limit, firebaseStorage, ref, getDownloadURL, getDoc  } from '../../config/firebase';

export default function SwipeScreen({ navigation }) {

    const [matches, setMatches] = useState([]);
    const [match, setMatch] = useState(null);
    const [swipe, setSwipe] = useState('');
    const [counter, setCounter] = useState(0);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (Object.keys(Global.matches).length === 0) {
                const loggedInUserId = await Global.getClientData('@user_id');
        
                const potentialMatchesRef = collection(firebaseFirestore, 'potential_matches');
                const potentialMatchesSnapshot = await getDocs(potentialMatchesRef);
        
                const swipedUserIds = new Set();
                const matchedUserIds = new Set();
        
                potentialMatchesSnapshot.forEach((document) => {
                    const data = document.data();
            
                    if (data.user_ref._key.path.segments[6] === loggedInUserId && (data.user_like === 'LIKE' || data.user_like === 'DISLIKE')) {
                        const swipedUserId = data.match_ref._key.path.segments[6];
                        swipedUserIds.add(swipedUserId);
            
                        if (data.match_like === 'LIKE' || data.match_like === 'DISLIKE') {
                            matchedUserIds.add(swipedUserId);
                        }
                    }
                });
        
                const collectionRef = collection(firebaseFirestore, 'users');
                const limitedQuery = query(collectionRef, limit(5));
                const snapshot = await getDocs(limitedQuery);
                const matches = {};
        
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const userId = doc.id;
            
                    if (
                        userId !== loggedInUserId &&
                        !swipedUserIds.has(userId) &&
                        !matchedUserIds.has(userId) &&
                        (data.match_like === 'undefined' || !data.match_like)
                    ) {
                        matches[userId] = new User(data, userId);
                    }
                });
        
                Global.storeClientData('@matches_loaded', "true");
                setMatches(matches);
            }
        };
      
        fetchData().then(() => {
            setLoading(false);
        });
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
                    else setCounter(counter => counter + 1);
                } else if (gestureState.dx < -150) {
                    if (Object.keys(matches).length) setSwipe("left");
                    else setCounter(counter => counter + 1);
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

        createMatch(match, userId, side === 'right' ? true : false);
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
    
            const data = {
                match_ref: matchRef,
                user_ref: userRef,
                match_like: 'NONE',
                user_like: likeType ? 'LIKE' : 'DISLIKE',
            };
    
            if (!snapshot.empty) {
                data.match_like = likeType ? 'LIKE' : 'DISLIKE';
                data.match_date = new Date().getTime();

                const docId = snapshot.docs[0].id;

                await updateDoc(doc(firebaseFirestore, 'potential_matches', docId), data);
            } else {
                const newDocRef = doc(collection(firebaseFirestore, 'potential_matches'));
                await setDoc(newDocRef, data);
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

    const headerScreenData = { parent: 'Profile', child: 'SwipeSettingScreen' }

    return (
        <Background>
            <Header navigation={navigation} screen={headerScreenData} toggle={true}/>

            { 
                loading ? <Text/> : counter == 5 ? advertisementCard(match, pan, panResponder, rotate) : match ? matchCard(match, pan, panResponder, rotate) : 
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
                <TouchableOpacity onPress={() => handleSwipe(match, 'left')}>
                    <Icon
                        name='close'
                        type='material-community'
                        color='white'
                        style={[styles.icon, {backgroundColor: '#1a1a1a'}]}
                        size={50}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSwipe(match, 'right')}>
                    <Icon
                        name='heart'
                        type='material-community'
                        color='white'
                        style={[styles.icon, {backgroundColor: '#C41E3A'}]}
                        size={50}
                    />
                </TouchableOpacity>
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

const advertisementCard = (match = null, pan, panResponder, rotate) => {
    const advert = advertisements["default"][Math.floor(Math.random() * advertisements["default"].length)];

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
            {...panResponder.panHandlers}s
        >
            <ImageBackground 
                source={{uri: advert.image}} 
                style={{...styles.advertContainer, flex: 1}}
                imageStyle={ styles.image }
                resizeMode='cover'
            >
                <View style={styles.person}>
                    <Text style={styles.heading}>{advert.name}</Text>
                </View>
                <Text style={styles.text}>{advert.description}</Text>
            </ImageBackground>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        marginHorizontal: Dimensions.get('window').width * 0.05,
        top: '15%',
        width: Dimensions.get('window').width * 0.9,
        maxWidth: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.65,
        maxHeight: Dimensions.get('window').height * 0.65,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
    },
    advertContainer: {
        width: Dimensions.get('window').width * 0.9,
        height: "80%",
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    image: {
        borderRadius: 10, 
        width: '80%', 
        height: '75%', 
        margin: Dimensions.get('window').width * 0.09, 
        elevation: 3, backgroundColor: '#f2f2f2', 
        marginTop: Dimensions.get('window').width * 0.15, 
        borderRadius: 10,
        opacity: 0.5,
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
        elevation: 1,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 25,
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