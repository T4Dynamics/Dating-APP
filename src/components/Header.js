import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import * as Global from '../helpers/globals';
import { theme } from '../theme';

export default function Header({ navigation }) {

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Slider
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
        width: '70%',
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
        fontSize: 36,
        fontWeight: 'regular',
        width: '100%',
        textAlign: 'center',
        fontFamily: theme.fonts.judson.bold,
        color: theme.colors.primary,
    },
});