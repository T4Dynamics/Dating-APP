import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { Icon } from 'react-native-elements'

import { theme } from '../theme'

export default function Card({ children, style, name, age }) {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                Animated.spring(pan, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;
    
    return (
        <Animated.View
            style={[pan.getLayout(), styles.container, style]}
            {...panResponder.panHandlers}
        >
            <View style={styles.person}>
                <Text style={styles.heading}>{name}</Text>
                <Text style={styles.heading}>{age}</Text>
            </View>
            <Text style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
            <View style={styles.children}>{children}</View>
            <View style={styles.row}>
                <Icon
                    name='thumb-down'
                    type='material-community'
                    color={theme.colors.primary}
                    size={50}
                />

                <Icon
                    name='thumb-up'
                    type='material-community'
                    color={theme.colors.primary}
                    size={50}
                />
            </View>
        </Animated.View>
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