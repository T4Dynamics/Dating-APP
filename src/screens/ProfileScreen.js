import { useEffect, useState } from 'react'

import { useRoute } from '@react-navigation/native';
import { firebaseAuth, signOut, collection, getDocs, firebaseFirestore } from "../../config/firebase";

import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity} from "react-native";
import { Icon } from 'react-native-elements'

import Background from "../components/Background";
import Button from "../components/Button";
import Header from "../components/Header";

import * as Global from "../helpers/globals";

export default function ProfileScreen({ navigation }) {

    const route = useRoute();
    const data = route ? route.params : null;

    const [userDocument, setUserDocument] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setUserDocument(await Global.getClientDocument());
        };

        fetchData();
    }, []);

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

    const name = userDocument ? userDocument.name : 'Loading...';
    const firstName = name.split(' ')[0];

    const headerScreenData = { parent: 'Profile', child: 'SettingsScreen' };

    return (
        <Background>
            <Header navigation={navigation} screen={headerScreenData}/>
            <ScrollView
                style={{ flexGrow: 0, height: '80%', paddingTop: 10 }}
                contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                <View style={styles.container} onStartShouldSetResponder={() => navigation.navigate('Profile', { screen: 'ProfileScreen'})}>
                    <Image source={require('../assets/blank_user.png')} style={styles.userImage} />
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile', { screen: 'ProfileScreen'})}>
                        <Icon
                            name='pencil'
                            type='material-community'
                            color={'#fff'}
                            size={18}
                        />
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 18}}>{ userDocument ? firstName + ', ' + userDocument.age : 'Loading...' }</Text>
                <Button mode="contained" onPress={ handleLogout } > Logout </Button>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: 50,
    },
    button: {
        position: 'absolute',
        top: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: 32,
        height: 32,
        borderRadius: 100,
    },
});

