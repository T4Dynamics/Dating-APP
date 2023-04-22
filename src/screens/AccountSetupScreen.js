import React from "react";

import { firebaseAuth, signOut } from "../../config/firebase";

import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { CheckBox } from "react-native-elements";
import Toast from 'react-native-toast-message';
import { useRoute } from '@react-navigation/native';

import Button from "../components/Button";
import Background from "../components/Background";

import dOrientation from '../data/orientations.json';
import dInterest from '../data/interests.json';

import * as Global from '../helpers/globals';
import * as Utils from '../helpers/utils';

import Input from "../components/Input";

export default function SettingsScreen({ navigation }) {

    const route = useRoute();
    const currentSlide = route.params ? route.params.currentSlide : 1;

    return (
        <Background>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                { displayData(currentSlide, navigation) }
            </KeyboardAvoidingView>
        </Background>
    );
}

const displayData = (currentSlide, navigation) => {

    let [dob, setDob] = React.useState({ day: '', month: '', year: '' });
    let [orientation, setOrientation] = React.useState('');
    let [likes, setLikes] = React.useState([]);
    let [dislikes, setDislikes] = React.useState([]);

    const handleLogout = () => {
        signOut(firebaseAuth).then(() => {
            navigation.navigate('Main', { screen: 'MainScreen' });
            Global.clearAllData();
            Global.matches = [];
            Global.profileBuilder = {};
        }).catch(error => {
            console.log(error);
        });
    }

    const calculateAge = (day, month, year) => {
        const dobDate = new Date(year, month - 1, day);
        const ageDifference = Date.now() - dobDate.getTime();
        const ageDate = new Date(ageDifference);

        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const toggleInterest = (type, interest) => {
        if (type === 'likes' && likes.includes(interest)) {
            setLikes(likes.filter(e => e !== interest));
        } else if (type === 'likes' && !likes.includes(interest)) {
            if (likes.length < 5) setLikes([...likes, interest]);
        }

        if (type === 'dislikes' && dislikes.includes(interest)) {
            setDislikes(dislikes.filter(e => e !== interest));
        } else if (type === 'dislikes' && !dislikes.includes(interest)) {
            if (dislikes.length < 5) setDislikes([...dislikes, interest]);
        }
    }

    const interestStyle = (interest, type) => ({
        backgroundColor: type.includes(interest) ? '#2196F3' : '#fff',
        borderColor: type.includes(interest) ? '#2196F3' : '#000',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        margin: 5,
    });

    const data = {
        1: {
            title: 'Welcome to Slider!',
            description: 'Let\'s get to know you better.',
            dArr: ['Male', 'Female', 'Other'],
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>The next screens will ask you about you and your dating interest.</Text>
                        <Button
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Proceed to account setup
                        </Button>
                        <Button
                            style={{ marginTop: 10 }}
                            mode="outlined"
                            onPress={() => handleLogout()}
                        >
                            Return to login
                        </Button>
                    </View>
                );
            },
        },
        2: {
            title: 'What is your date of birth?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Input
                                placeholder="Day"
                                onChangeText={(value) => setDob({ ...dob, day: value })}
                                value={dob.day}
                                keyboardType="numeric"
                                maxLength={2}
                            />

                            <Input
                                placeholder="Month"
                                onChangeText={(value) => setDob({ ...dob, month: value })}
                                value={dob.month}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                            
                            <Input
                                placeholder="Year"
                                onChangeText={(value) => setDob({ ...dob, year: value })}
                                value={dob.year}
                                keyboardType="numeric"
                                maxLength={4}
                            />
                        </View>
                        <Button 
                            key={ 'dob' }
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                const { day, month, year } = dob;
                                const isValidDay = day >= 1 && day <= 31;
                                const isValidMonth = month >= 1 && month <= 12;
                                const isValidYear = year >= 1900 && year <= new Date().getFullYear();

                                if (!isValidDay || !isValidMonth || !isValidYear) return Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    text2: 'Please enter a valid date.',
                                    visibilityTime: 4000,
                                    autoHide: true,
                                    topOffset: 30,
                                    bottomOffset: 40,
                                });

                                const calculatedAge = calculateAge(day, month, year);
                                if (calculatedAge < 18) return Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    text2: 'You must be 18 or older to use this app.',
                                    visibilityTime: 4000,
                                    autoHide: true,
                                    topOffset: 30,
                                    bottomOffset: 40,
                                });

                                Global.profileBuilder = { age: calculatedAge };
                                
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                    </View>
                );
            },
        },
        3: {
            title: 'What is your gender?',
            description: 'This helps us find the best matches for you.',
            dArr: ['Male', 'Female', 'Other'],
            screen: (dArr, navigation) => {
                return (
                    <View>
                        { dArr.map((e) => {
                            return (
                                <Button
                                    key={ e }
                                    style={{ marginTop: 10 }}
                                    mode="contained"
                                    onPress={() => {
                                        Global.profileBuilder = { ...Global.profileBuilder, gender: e.toUpperCase() };
                                        navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                                    }}
                                >
                                    { e }
                                </Button>
                            );
                        })}
                    </View>
                );
            },
        },
        4: {
            title: 'What is your sexual orientation?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={{ flexGrow: 0, height: '75%', paddingTop: 10 }}
                            contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                        >
                            { dOrientation.map((e) => {
                                return (
                                    <View key={e} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, marginBottom: 10, width: '100%'}}>
                                        <CheckBox
                                            key={e}
                                            title={e}
                                            containerStyle={{ width: '100%', backgroundColor: orientation === e ? 'lightblue' : 'transparent', borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                                            textStyle={{ textAlign: 'center' }}
                                            checked={orientation === e}
                                            onPress={() => setOrientation(e)}
                                        />
                                    </View>
                                );
                            }) }
                        </ScrollView>
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Scroll down to view more options</Text>
                        <Button
                            key={'orientation'}
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                Global.profileBuilder = { ...Global.profileBuilder, orientation: orientation.toUpperCase() };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                    </View>
                );
            },
        },
        5: {
            title: 'What are your interests?',
            description: 'Pick as many as you like up to 5. This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            { Object.values(dInterest).map((e) => {
                                return (
                                    <TouchableOpacity
                                        key={e}
                                        style={interestStyle(e, likes)}
                                        onPress={() => toggleInterest('likes', e)}
                                        activeOpacity={likes.length >= 5 && !likes.includes(e) ? 1 : 0.2}
                                    >
                                        <Text style={{ color: likes.includes(e) ? '#fff' : '#000' }}>{e}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
        
                        <Button
                            key={ 'interests' }
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                if (likes.length === 0) return console.log('Need at least one dislike');
                                const aLikes = Utils.findKeysByValues(dInterest, likes);
                                Global.profileBuilder = { ...Global.profileBuilder, likes: aLikes.map(e => Number(e)) };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                    </View>
                );
            },
        },    
        6: {
            title: 'What do you dislike?',
            description: 'Pick as many as you dislike up to 5. This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            { Object.values(dInterest).filter(e => !likes.includes(e)).map((e) => {
                                return (
                                    <TouchableOpacity
                                        key={e}
                                        style={interestStyle(e, dislikes)}
                                        onPress={() => toggleInterest('dislikes', e)}
                                        activeOpacity={dislikes.length >= 5 && !dislikes.includes(e) ? 1 : 0.2}
                                    >
                                        <Text style={{ color: dislikes.includes(e) ? '#fff' : '#000' }}>{e}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
        
                        <Button
                            key={ 'interests' }
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                if (dislikes.length === 0) return console.log('Need at least one dislike');
                                const aDislikes = Utils.findKeysByValues(dInterest, dislikes);
                                Global.profileBuilder = { ...Global.profileBuilder, dislikes: aDislikes.map(e => Number(e)) };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                    </View>
                );
            },
        },    
        7: {
            title: 'Test',
            description: 'JSON Builder temporary screen',
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <Button 
                            style={{marginTop: 10}}
                            title='Next'
                            mode="contained"
                            onPress={() => console.log(Global.profileBuilder)}
                        >
                            Test JSON builder
                        </Button>
                    </View>
                );
            },
        },
    }

    return (
        <View style={styles.contentContainer}>
            <Text style={styles.title}>{data[currentSlide].title}</Text>
            <Text style={styles.description}>{data[currentSlide].description}</Text>
            <View style={styles.inputContainer}>
                {data[currentSlide].screen(data[currentSlide].dArr, navigation)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 100,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        justifyContent: 'flex-end',
    },
});