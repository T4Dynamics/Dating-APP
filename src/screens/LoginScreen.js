import React, { useEffect } from "react";
import Toast from 'react-native-toast-message';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

import { firebaseAuth, signInWithEmailAndPassword, onAuthStateChanged } from '../../firebase';

import { Text } from 'react-native'
import { SafeAreaView } from "react-navigation";

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                navigation.navigate('HomeScreen');
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
            <SafeAreaView>
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
                mode="contained"
                onPress={ handleLogin }
            >
                Login!
            </Button>

            <Button
                mode="outlined"
                onPress={ () => navigation.navigate('MainScreen', { currentSlide: 4 }) }
            >
                Main Menu
            </Button>

            <Toast />
            </SafeAreaView>
        </Background>
    );
}