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

    const handleLogout = async () => {
        signOut(firebaseAuth).then(async () => {
            await Global.clearClientData('@user_id');
            await Global.clearClientData('@user_document');
            await Global.clearClientData('@user_name');
            await Global.clearClientData('@matches_loaded');
            
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

