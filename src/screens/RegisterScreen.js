import React from "react";
import Toast from 'react-native-toast-message';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

import { Text, SafeAreaView, StyleSheet } from 'react-native'
import { firebaseAuth, createUserWithEmailAndPassword, updateProfile } from "../../firebase";

export default function RegisterScreen({ navigation }) {

    const [displayName, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleRegistration = () => {

        let errorMessage = '';

        if (displayName === '') errorMessage = 'Please enter a display name';
        if (email === '') errorMessage = 'Please enter an email';
        if (password === '') errorMessage = 'Please enter a password';
        if (password !== confirmPassword) errorMessage = 'Passwords do not match';

        if (errorMessage !== '') {
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        }

        createUserWithEmailAndPassword(firebaseAuth, email, password).then(credentials => {
            const user = credentials.user;
        
            updateProfile(user, { displayName: displayName }).then(() => {
                navigation.navigate('Dashboard');
            });
        }).catch(error => {
            let errorMessage = error.code === 'auth/email-already-in-use' ? 'Email already in use' :
                error.code === 'auth/invalid-email' ? 'Invalid email' :
                error.code === 'auth/weak-password' ? 'Password is too weak' :
                'Something went wrong';

            // Possible sentry error logging here

            console.log(error.code + error);
    
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        })
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
                    autoComplete="off"
                />

                <Input
                    placeholder="Confirm Password"
                    onChangeText={ setConfirmPassword }
                    value={ confirmPassword }
                    secureTextEntry
                    autoComplete="off"
                />

                <Button
                    mode="contained"
                    onPress={ handleRegistration }
                >
                    Register!
                </Button>

                <Button
                    mode="outlined"
                    onPress={ () => navigation.navigate('MainScreen') }
                >
                    Main Menu
                </Button>

                <Toast />
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