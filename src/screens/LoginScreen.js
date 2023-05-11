import { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

import { firebaseAuth, signInWithEmailAndPassword, onAuthStateChanged, firebaseApp, firebaseFirestore } from '../../config/firebase';

import { Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                navigation.navigate('Main', { screen: 'SwipeScreen' });
            }
        });

        return unsubscribe;
    }, []);

    const handleLogin = () => {

        let errorMessage = '';

        if (email === '') errorMessage = 'Please enter an email';
        if (password === '') errorMessage = 'Please enter a password';

        if (errorMessage !== '') {
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        }

        signInWithEmailAndPassword(firebaseAuth, email, password).then(credentials => {
            const user = credentials.user;
        }).catch(error => {
            let errorMessage = error.code === 'auth/invalid-email' ? 'Invalid email' :
                error.code === 'auth/user-disabled' ? 'User disabled' :
                error.code === 'auth/user-not-found' ? 'User not found' :
                error.code === 'auth/wrong-password' ? 'Wrong password' :
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
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Text>Dashboard</Text>

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

                <Button
                    style={{ marginTop: 10, width: '100%' }}
                    mode="contained"
                    onPress={ handleLogin }
                >
                    Login!
                </Button>

                <Button
                    style={{ marginTop: 10, width: '100%' }}
                    mode="outlined"
                    onPress={ () => navigation.navigate('Main', { screen: 'MainScreen', params: { currentSlide: 4 } }) }
                >
                    Main Menu
                </Button>
            </KeyboardAvoidingView>
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
});