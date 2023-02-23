import React from 'react'

import Background from '../components/Background'
import Button from '../components/Button'

import { Text } from 'react-native'

export default function MainScreen({ navigation }) {
    return (
        <Background>
            <Text>Dating Application</Text>
            <Button
                mode="contained"
                onPress={() => navigation.navigate('LoginScreen')}
            >
                Login
            </Button>
            <Button
                mode="outlined"
                onPress={() => navigation.navigate('RegisterScreen')}
            >
                Register
            </Button>
        </Background>
    )
}