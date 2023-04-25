import React from "react";
import { firebaseAuth, signOut, collection, getDocs, firebaseFirestore } from "../../config/firebase";

import Background from "../components/Background";
import Button from "../components/Button";

import * as Global from "../helpers/globals";

export default function ProfileScreen({ navigation }) {
    const test = async () => {
        const temp = await getDocs(collection(firebaseFirestore, 'matches'));
        temp.forEach(doc => {
            console.log(doc.id, '=>', doc);
        });
    }

    const handleLogout = () => {
        signOut(firebaseAuth).then(() => {
            Global.clearAllData();
            Global.matches = [];
            Global.profileBuilder = {};
            
            navigation.navigate('Main', { screen: 'MainScreen' });
        }).catch(error => {
            console.log(error);
        });
    }


    return (
        <Background>
            <Button mode="contained" onPress={ test } > Test </Button>
            <Button mode="contained" onPress={ handleLogout } > Logout </Button>
        </Background>
    );
}

