import { useEffect, useState } from 'react'

import { useRoute } from '@react-navigation/native';
import { firebaseAuth, firebaseFirestore, EmailAuthProvider, signOut, doc, deleteDoc, signInWithCredential, getStorage, ref, uploadBytes, getDownloadURL, firebaseStorage } from "../../config/firebase";
import { Dimensions, Image, StyleSheet, View, Text, FlatList, ScrollView, Alert, TouchableOpacity } from "react-native";

import Button from "../components/Button";

import * as Global from "../helpers/globals";
import { StatusBar } from "expo-status-bar";
import Header from '../components/Header';
import Background from '../components/Background';
import * as ImagePicker from 'expo-image-picker';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

export default function ProfileScreen({ navigation }) {

    const route = useRoute();
    const data = route ? route.params : null;

    const [userDocument, setUserDocument] = useState(null);
    const [confirmationToggle, setConfirmationToggle] = useState(false);
    const [deleteToggle, setDeleteToggle] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [profileImageUrl, setProfileImageUrl] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');


    useEffect(() => {
        const fetchData = async () => {
            const userDocument = await Global.getClientDocument();

            setUserDocument(userDocument);
            setProfileImageUrl(userDocument.imageUrl);
        };

        fetchData();
    }, []);


    useEffect(() => {
        let timer;

        if (deleteToggle && countdown > 0) {
            timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
        } else if (deleteToggle && countdown === 0){
            setDeleteToggle(false);
            setConfirmationToggle(true);
        }

        return () => clearTimeout(timer);
    }, [deleteToggle, countdown]);

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry! We need access to your camera roll to make this work.');
                }
            }
        })();
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

    const handleDeleteAccount = async () => {
        if (deleteToggle) return;
        
        if (confirmationToggle) {
            const user = firebaseAuth.currentUser;
            const userDoc = doc(firebaseFirestore, 'users', user.uid);

            const reauthAndDelete = (password) => {
                const credential = EmailAuthProvider.credential(user.email, password);

                signInWithCredential(firebaseAuth, credential).then(() => {
                    setTimeout(() => {
                        user.delete().then(() => {
                            deleteDoc(userDoc).then(async () => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Success',
                                    text2: 'Account deleted',
                                });

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
                        }).catch(error => {
                            console.log(error);
                        });
                    }, 1000);
                }).catch(error => {
                    Alert.alert('Error', 'The password is incorrect. Please try again.', [{ text: 'OK', onPress: () => { requestPassword(); } }]);
                });
            };

            const requestPassword = () => {
                Alert.prompt('Password', 'Please enter your password to confirm deletion.', [
                    { text: 'Cancel', onPress: () => { setConfirmationToggle(false); } },
                    { text: 'Confirm', onPress: (password) => { reauthAndDelete(password); } }
                ]);
            }

            requestPassword();
        } else {
            setDeleteToggle(true);
            setCountdown(5);
        }
    }

    const handleImageUpload = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            const user = await Global.getClientDocument();
            const imageRef = ref(firebaseStorage, `images/${user.id}`);
            const response = await fetch(imageUri);
            const blob = await response.blob();

            await uploadBytes(imageRef, blob);

            const url = await getDownloadURL(imageRef);
            setProfileImageUrl(url);
        }
    }

    const name = userDocument ? userDocument.name : 'Loading...';
    const firstName = name.split(' ')[0];

    const headerScreenData = { parent: 'Profile', child: 'SettingsScreen' };

    return (
        <Background>
            <Header screen={headerScreenData} navigation={navigation} toggle={false} />
            <ScrollView
                    style={{ flexGrow: 1, paddingTop: 10, marginTop: Dimensions.get('window').height * .07, marginBottom: Dimensions.get('window').height * 0.12 }}
                    contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                >
                <StatusBar style="light" />
                <TouchableOpacity style={styles.userImage} onPress={handleImageUpload}>
                    <Image source={{uri: profileImageUrl}} style={styles.userImage} />
                </TouchableOpacity>
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
                    <Button style={{ marginTop: 10, backgroundColor: '#EE4B2B', color: 'white' }} mode="outlined" onPress={ handleDeleteAccount }> {confirmationToggle ? 'Confirm Deletion' : deleteToggle ? `Confirm Deletion in ${countdown}` : 'Delete Account'} </Button>
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
        paddingBottom: 30,
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