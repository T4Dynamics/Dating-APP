import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { theme } from '../theme'
import { Icon } from 'react-native-elements'

export default function Nav({ page, navigation }) {
    return (
        <View style={styles.background}>
            <Icon
                name='home'
                type='material-community'
                color={ page === 'HomeScreen' ? 'black' : 'gray'}
                size={40}
                onPress={() => navigation.navigate('HomeScreen')}
            />

            <Icon
                name='heart'
                type='material-community'
                color={ page === 'MatchesScreen' ? 'black' : 'gray'}
                size={40}
            />

            <Icon
                name='message-text'
                type='material-community'
                color={ page === 'MessageScreen' ? 'black' : 'gray'}
                size={40}
            />

            <Icon
                name='account-circle'
                type='material-community'
                color={ page === 'ProfileScreen' ? 'black' : 'gray'}
                size={40}
                onPress={() => navigation.navigate('Dashboard')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        width: '80%',
        height: '10%',

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});