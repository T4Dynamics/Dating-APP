import React, {useRef} from "react";

// Components
import Background from "../components/Background";
import Header from "../components/Header";

import { StyleSheet, Text, Animated, PanResponder } from "react-native";
import { matches, handleSwipe } from '../helpers/matches';
import { theme } from '../theme';

export default function SwipeScreen({ navigation }) {

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

        </Background>
    );
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