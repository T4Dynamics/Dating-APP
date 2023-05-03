import React from "react";
import { View, Text } from "react-native";

import Button from "../components/Button";
import Background from "../components/Background";

export default function SettingsScreen({ navigation }) {

    return (
        <Background>
            <Text>Settings Screen</Text>
            <Button mode="contained" onPress={ () => navigation.navigate('Profile', { screen: 'ProfileScreen' }) } > Back </Button>
        </Background>
    );
}

