import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import { theme } from '../theme'

export default function Card({ children }) {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Jane Doe</Text>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
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
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    text: {
        fontSize: 18,
        textAlign: 'center',
    },
    children: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});