import { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';

import Background from "../components/Background";
import Button from "../components/Button";
import Input from "../components/Input";

import { sendPasswordResetEmail, firebaseAuth } from '../../config/firebase';

import { Text, StyleSheet, KeyboardAvoidingView } from 'react-native';

export default function ResetPasswordScreen({ navigation }) {

    const [email, setEmail] = useState('');

    const handleResetPassword = () => {
        if (email === '') {
            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please enter an email',
            });
        }

        sendPasswordResetEmail(firebaseAuth, email).then(() => {
            navigation.navigate('MainScreen', { currentSlide: 4 });
            
            return Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'An email has been sent to your email address',
            });
        }).catch((error) => {
            let errorMessage = error.code === 'auth/invalid-email' ? 'Invalid email' :
                'Something went wrong';

            return Toast.show({
                type: 'error',
                text1: 'Error',
                text2: errorMessage,
            });
        });
    }

    return (
        <Background>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <Text>Reset Password</Text>
                <Text>Enter your email to reset your password</Text>

                <Input
                        placeholder="Email"
                        onChangeText={ setEmail }
                        value={ email }
                />

                <Button
                    style={{ marginTop: 10, width: '100%' }}
                    mode="contained"
                    onPress={ handleResetPassword }
                >
                    Send Password Reset Email
                </Button>

                <Button
                    style={{ marginTop: 10, width: '100%' }}
                    mode="outlined"
                    onPress={ () => navigation.navigate('MainScreen', { currentSlide: 4 }) }
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