import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements'

import { theme } from '../theme'

export default function Header({ navigation }) {
    return (
        <View style={styles.container}>
            <Text 
                style={styles.text}
                onPress={() => navigation.navigate('HomeScreen')}
            >
                Slider
            </Text>
            <View style={styles.icons}>
                <Icon
                    name='bell'
                    type='material-community'
                    color={theme.colors.primary}
                    size={30}
                />

                <Icon
                    name='menu'
                    type='material-community'
                    color={theme.colors.primary}
                    size={30}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        height: '10%',

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
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});