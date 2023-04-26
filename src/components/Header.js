import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import * as Global from '../helpers/globals';
import { theme } from '../theme';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Header({ navigation, screen }) {

    return (
        <View style={styles.container}>
            <Text style={styles.text} onPress={() => navigation.navigate('Main', { screen: 'SwipeScreen'})}>
                Slider
            </Text>
            <TouchableOpacity 
                style={styles.icons}
                onPress={() => navigation.navigate(screen.parent, { screen: screen.child })}
            >
                <Icon
                    name='cog'
                    type='material-community'
                    color={'#121212'}
                    size={30}
                />
            </TouchableOpacity>
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