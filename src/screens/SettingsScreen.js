import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from "react-native";

import { collection, setDoc, doc, firebaseFirestore } from "../../config/firebase";

import Button from "../components/Button";
import Background from "../components/Background";
import Header from "../components/Header";

import * as Global from "../helpers/globals";
import { theme } from "../theme";

export default function SettingsScreen({ navigation }) {
    const [userDocument, setUserDocument] = useState();
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const userDocument = await Global.getClientDocument();
            setUserDocument(userDocument);
        };

        fetchData();
    }, []);

    const updateProfile = async () => {

    }

    const settings = ['Name', 'Gender', 'Orientation', 'Interests', 'Dislikes', 'Relationship Type', 'Age Range', 'Bio'];

    return (
        <Background>
            <Header navigation={navigation}/>
            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>Edit Settings</Text>
            <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 10 }}>Select an option below to edit</Text>
            <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>Scroll to View</Text>
            <ScrollView
                        style={{ flexGrow: 0, height: '65%', width: '80%', paddingTop: 10 }}
                        contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                { displayData(settings) }
            </ScrollView>
            <View style={styles.container}>
                <Button mode="contained" style={{ marginTop: 10, width: '100%' }} onPress={() => navigation.navigate('Profile', { screen: 'ProfileScreen' })}>
                    Go back
                </Button>
            </View>
        </Background>
    );
}

const displayData = (data) => {
    return (
        <View>
            {data.map((item, index) => {
                return (
                    <TouchableOpacity key={index} style={styles.row}>
                        <Text style={styles.text}>{item}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#F6F6F6',
        width: Dimensions.get('window').width * 0.8,
        textAlign: 'center',
        padding: 8,
        borderRadius: 10,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10
    }
});