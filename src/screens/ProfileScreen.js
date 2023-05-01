import { useEffect, useState } from 'react'

import { useRoute } from '@react-navigation/native';
import { firebaseAuth, signOut } from "../../config/firebase";
import { Dimensions, Image, StyleSheet, View, Text, FlatList, ScrollView } from "react-native";

import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity} from "react-native";

import Background from "../components/Background";
import Button from "../components/Button";

import * as Global from "../helpers/globals";
import { StatusBar } from "expo-status-bar";

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
            <ScrollView>
                <StatusBar style="light" />
                <Image source={require('../assets/test-user-image.jpg')} style={styles.user_image} />
                <View style={styles.profileContent}>
                    <Text style={styles.firstName}>Rhys </Text>
                    <Text style={styles.label}>Your Bio </Text>
                    <Text style={styles.bio}>Hey girls, my name is Rhys. Yeah, you've probably heard of me. Kinda a big deal in the BU Ambassador space. </Text>
                    <Text style={styles.label}>Your Interests </Text>
                    <View style={styles.interestContainer}>
                        <FlatList
                            data={interests}
                            renderItem={({ item }) => (
                                <Text style={styles.interest}>{item}</Text>
                            )}
                            keyExtractor={item => item}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                        />
                    </View>
                    <View style={styles.horizontalButtons}>
                        <Button mode="contained" onPress={() => navigation.navigate('EditProfileScreen')}> Edit Profile </Button>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={ test }> Test </Button>
                    <Button mode="contained" onPress={ handleLogout }> Logout </Button>
                </View>
            </ScrollView>
        </Background>
    );
}

const styles = StyleSheet.create({
    user_image: {
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
})
