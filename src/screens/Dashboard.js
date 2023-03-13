import React from "react";

import Background from "../components/Background";
import Button from "../components/Button";

import { Text } from 'react-native'
import { firebaseAuth, signOut, collection, getDocs, firebaseFirestore } from "../../firebase";

export default function Dashboard({ navigation }) {

    const test = async () => {
        const temp = await getDocs(collection(firebaseFirestore, 'matches'));
        temp.forEach(doc => {
            console.log(doc.id, '=>', doc);
        });
    }

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
            <Button
                mode="contained"
                onPress={ () => navigation.navigate('HomeScreen') }
            >
                Home
            </Button>
            <Button
                mode="contained"
                onPress={ test }
            >
                Test
            </Button>
        </Background>
    );
}