import React, { useEffect } from "react";
import Toast from 'react-native-toast-message';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

import { fireAuth, signInWithEmailAndPassword, onAuthStateChanged } from '../../firebase';

import { Text } from 'react-native'

export default function LoginScreen({ navigation }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <Background>
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
            <Toast />
        </Background>
    );
}