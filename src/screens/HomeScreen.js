import React, { useRef } from "react";

import Background from "../components/Background";
import Button from "../components/Button";

import { Text, View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import Header from "../components/Header";
import Nav from "../components/Nav";
import CardItem from "../components/CardItem";

import { theme } from '../theme';
import { matches, handleSwipe } from '../helpers/matches';

import { Animated, PanResponder } from 'react-native';

export default function HomeScreen({ navigation }) {

    const [swipe, setSwipe] = React.useState('');
    const user = matches[0];

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
                console.log(gestureState.dx);
                if (gestureState.dx > 150) {
                    setSwipe("right");
                } else if (gestureState.dx < -150) {
                    setSwipe("left");
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

            { user ? matchCard(user, pan, panResponder, rotate) : undefinedMatches(pan, panResponder, rotate) }

            <Nav
                navigation={navigation}
                page='HomeScreen'
            />
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: '70%',
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
                <Text style={styles.heading}>{user.name}</Text>
                <Text style={styles.heading}>{user.age}</Text>
            </View>
            <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            <View style={styles.children}></View>
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

const undefinedMatches = (pan, panResponder, rotate) => {
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
            <Text style={[styles.heading, styles.noMatches]}>No more matches</Text>
        </Animated.View>
    )
}