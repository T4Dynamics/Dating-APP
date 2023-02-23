import React from "react";

import Background from "../components/Background";
import Button from "../components/Button";

import { Text } from 'react-native'

export default function Dashboard({ navigation }) {
    return (
        <Background>
            <Text>Dashboard</Text>
            <Button
                mode="contained"
                onPress={() => 
                    navigation.reset({
                        index: 0,
                        routes: [{ name: "Main" }],
                    })
                }
            >
                Logout
            </Button>
        </Background>
    );
}