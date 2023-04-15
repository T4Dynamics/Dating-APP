import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import * as Globals from '../helpers/globals';

export default function Header({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Welcome back, { Globals.userName }!
            </Text>
            <View 
                style={styles.icons}
                onStartShouldSetResponder={() => navigation.navigate('Profile', { screen: 'SettingsScreen' })}
            >
                <Icon
                    name='cog'
                    type='material-community'
                    color={'#121212'}
                    size={30}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: '5%',
        width: '90%',
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    icons: {
        width: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'regular',
    },
});