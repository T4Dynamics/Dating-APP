import React from "react";
import Toast from 'react-native-toast-message';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

import { Text, SafeAreaView, StyleSheet } from 'react-native'
import { createUser } from "../../firebase";

export default function RegisterScreen({ navigation }) {

    const [displayName, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleRegisteration = () => {
        if (displayName === '') return Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Please enter a display name',
        });

        if (email === '') return Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Please enter an email',
        });

        if (password === '') return Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Please enter a password',
        });

        if (password !== confirmPassword) return Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Passwords do not match',
        });

        createUser(displayName, email, password);
    }

    return (
        <Background>
            <SafeAreaView style={styles.container}>
                <Text style={styles.title}>Register</Text>

                <Input 
                    placeholder="Display Name"
                    onChangeText={ setDisplayName }
                    value={ displayName }
                />

                <Input
                    placeholder="Email"
                    onChangeText={ setEmail }
                    value={ email }
                />

                <Input
                    placeholder="Password"
                    onChangeText={ setPassword }
                    value={ password }
                    secureTextEntry
                />

                <Input
                    placeholder="Confirm Password"
                    onChangeText={ setConfirmPassword }
                    value={ confirmPassword }
                    secureTextEntry
                />

                <Button
                    mode="contained"
                    onPress={ handleRegisteration }
                >
                    Register!
                </Button>
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