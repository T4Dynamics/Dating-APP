import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native';

import { getTheme, theme } from '../theme'

export default function Background({ children }) {

    return (
        <ImageBackground
            source={require('../assets/background_dot.png')}
            resizeMode="repeat"
            style={[styles.background]}
        >
            {<SafeAreaView 
                style={[
                    styles.container,
                    { fontFamily: 'Judson-Regular' }
                ]} 
                behavior=""
            >
                {children}
            </SafeAreaView>}
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        backgroundColor: theme.colors.surface,
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
});