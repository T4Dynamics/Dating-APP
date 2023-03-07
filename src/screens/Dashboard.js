import React from "react";

import Background from "../components/Background";
import Button from "../components/Button";

import { Text } from 'react-native'
import { firebaseAuth, signOut } from "../../firebase";

export default function Dashboard({ navigation }) {

    const handleLogout = () => {
        signOut(firebaseAuth).then(() => {
            navigation.navigate('MainScreen');
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <Background>
            <Text>Dashboard</Text>
            <Button
                mode="contained"
                onPress={ handleLogout }
            >
                Logout
            </Button>
        </Background>
    );
}