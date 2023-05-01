import React, {useRef} from "react";

// Components
import Background from "../components/Background";
import Header from "../components/Header";
import CardItem from "../components/CardItem";
import User from '../models/User.js';

import { StyleSheet, Text, Animated, PanResponder, View, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { Icon } from 'react-native-elements'

import { handleSwipe } from '../helpers/matches';
import * as Global from '../helpers/globals';

import { collection, getDocs, firebaseFirestore } from '../../config/firebase';

import { theme } from '../theme';

export default function SwipeScreen({ navigation }) {

    const [matches, setMatches] = React.useState([]);
    const [swipe, setSwipe] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            if (Global.matches.length === 0) {
                const collectionRef = collection(firebaseFirestore, 'users');
                const loggedInUserId = await Global.getClientData('@user_id');

                getDocs(collectionRef).then((snapshot) => {
                    snapshot.forEach((doc) => {
                        if (doc.id !== loggedInUserId) {
                            Global.matches.push(new User(doc.data()));
                            Global.storeClientData('@matches_loaded', "true");
                            setMatches(Global.matches);
                        }
                    });
                });
            }
        }

        fetchData();
    }, []);

    const user = Global.matches[0];

    if (swipe === 'left' || swipe === 'right') {
        handleSwipe(user, swipe);
        setSwipe('');
    }
    
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (event, gestureState) => {
                if (gestureState.dx > 150) {
                    if (Global.matches != 0) setSwipe("right");
                } else if (gestureState.dx < -150) {
                    if (Global.matches != 0) setSwipe("left");
                }
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;
    
    const rotate = pan.x.interpolate({
        inputRange: [-300, 0, 300],
        outputRange: ['-30deg', '0deg', '30deg'],
        extrapolate: 'clamp',
    });

    return (
        <Background>
            <Header
                navigation={navigation}
            />

            { 
                user ? matchCard(user, pan, panResponder, rotate) : 
                Global.matchesLoaded == false ? undefinedMatches(pan, panResponder, rotate, 'Loading...') :
                    undefinedMatches(pan, panResponder, rotate, 'No More Matches') 
            }

        </Background>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        marginHorizontal: Dimensions.get('window').width * 0.05,
        top: '15%',
        width: Dimensions.get('window').width * 0.9,
        height: Dimensions.get('window').height * 0.65,
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        backgroundColor: '#f2f2f2',
        padding: 15,
        borderRadius: 10,
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

const matchCard = (user, pan, panResponder, rotate) => {
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
                <Text style={styles.heading}>{user.firstName}</Text>
                <Text style={styles.heading}>{user.age}</Text>
            </View>
            <Text style={styles.text}>{user.description}</Text>
            <View style={styles.children}>
                { 
                    user.getLikes().map((e, index) => {
                        return (
                            <CardItem key={'item-' + index}>
                                <Text>{e}</Text>
                            </CardItem>
                        )
                    })
                }
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={() => handleSwipe(user, 'left')}>
                    <Icon
                        name='close'
                        type='material-community'
                        color='white'
                        style={[styles.icon, {backgroundColor: '#1a1a1a'}]}
                        size={50}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSwipe(user, 'right')}>
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