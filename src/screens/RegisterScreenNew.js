import React from 'react';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

export default function RegisterScreenNew({ navigation }) {

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Register</Text>

                <Button
                    mode="outlined"
                    onPress={ () => navigation.navigate('MainScreen', { currentSlide: 4 }) }
                >
                    Main Menu
                </Button>/
            </SafeAreaView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 12,
    },
});