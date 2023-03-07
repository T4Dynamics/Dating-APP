import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { theme } from '../theme'
import { Icon } from 'react-native-elements'

export default function Nav({ }) {
    return (
        <View style={styles.background}>
            <Icon
                name='home'
                type='material-community'
                color={theme.colors.primary}
                size={40}
            />

            <Icon
                name='heart'
                type='material-community'
                color={theme.colors.primary}
                size={40}
            />

            <Icon
                name='message-text'
                type='material-community'
                color={theme.colors.primary}
                size={40}
            />

            <Icon
                name='account-circle'
                type='material-community'
                color={theme.colors.primary}
                size={40}
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