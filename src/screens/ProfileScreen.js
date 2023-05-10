import { useEffect, useState } from 'react'

import { useRoute } from '@react-navigation/native';
import { firebaseAuth, signOut } from "../../config/firebase";
import { Dimensions, Image, StyleSheet, View, Text, FlatList, ScrollView } from "react-native";

import Button from "../components/Button";

import * as Global from "../helpers/globals";
import { StatusBar } from "expo-status-bar";
import Header from '../components/Header';
import Background from '../components/Background';

const interests = [
    "Basketball",
    "Football",
    "Video Games",
    "Hiking",
    "Being a BU Ambassador",
    "Rent Boy",
    "Hot Chocolate",
]

export default function ProfileScreen({ navigation }) {

    const route = useRoute();
    const data = route ? route.params : null;

    const [userDocument, setUserDocument] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const userDocument = await Global.getClientDocument();
            setUserDocument(userDocument);
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
            <Header screen={headerScreenData} navigation={navigation} toggle={false} />
            <ScrollView
                    style={{ flexGrow: 0, height: '100%', paddingTop: 10, marginTop: Dimensions.get('window').height * .07, marginBottom: Dimensions.get('window').height * 0.12 }}
                    contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                <StatusBar style="light" />
                <Image source={require('../assets/demo-image.jpg')} style={styles.userImage} />
                <View style={styles.profileContent}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.firstName}>{ firstName }</Text>
                        <Text style={[styles.firstName, { fontSize: 18}]}>{ userDocument ? userDocument.getAge() : '' }</Text>
                    </View>
                    <Text style={styles.label}>Your Bio </Text>
                    <Text style={styles.bio}>{ userDocument ? userDocument.description : ''}</Text>
                    <Text style={styles.label}>Your Interests </Text>
                    <View style={styles.interestContainer}>
                        <FlatList
                            data={userDocument ? userDocument.getLikes() : []}
                            renderItem={({ item }) => (
                                <Text style={styles.interest}>{item}</Text>
                            )}
                            keyExtractor={item => item}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                        />
                    </View>
                    <Text style={styles.label}>Your Dislikes </Text>
                    <View style={styles.interestContainer}>
                        <FlatList
                            data={userDocument ? userDocument.getDislikes() : []}
                            renderItem={({ item }) => (
                                <Text style={styles.interest}>{item}</Text>
                            )}
                            keyExtractor={item => item}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                        />
                    </View>
                    <View style={styles.horizontalButtons}>
                        <Button style={{ marginTop: 10 }} mode="contained" onPress={() => navigation.navigate(screen.parent, { screen: screen.child })}> Edit Profile </Button>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button style={{ marginTop: 10 }} mode="outlined" onPress={ handleLogout }> Logout </Button>
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    userImage: {
        top: 0,
        position: 'absolute',
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height * .5,
    },
    profileContent: {
        textAlign: 'left',
        width: Dimensions.get('window').width,
        marginTop: Dimensions.get('window').height * .5,
        padding: 15,
    },
    label: {
        fontSize: 20,
        color: 'gray',
    },
    bio: {
        margin: 5,
        fontSize: 18,
        letterSpacing: .6,
        lineHeight: 20,
    },
    firstName: {
        fontSize: 40,
    },
    buttonContainer: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    interestContainer: {
        marginVertical: 10,
    },
    interest: {
        backgroundColor: '#1a1a1a',
        padding: 10,
        marginRight: 2,
        marginHorizontal: 10,
        borderRadius: 5,
        color: 'white',
        fontWeight: 'bold',
    },
    horizontalButtons: {
        display: 'flex',
    }
});