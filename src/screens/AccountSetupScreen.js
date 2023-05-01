import { useState } from "react";

import {collection, doc, setDoc, firebaseAuth, signOut, firebaseFirestore } from "../../config/firebase";

import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import { CheckBox } from "react-native-elements";
import { useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Slider from '@react-native-community/slider';

import Button from "../components/Button";
import Background from "../components/Background";

import dInterest from '../data/interests.json';
import dRelationship from '../data/relationshipType.json';

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

    const [name, setName] = useState({ first_name: '', last_name: '' });
    const [dob, setDob] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [orientation, setOrientation] = useState('');
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [relationshipType, setRelationshipType] = useState('');
    const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
    const [distanceRange, setDistanceRange] = useState(5);
    const [bio, setBio] = useState('');


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
                            style={{ marginTop: 10, width: '100%' }}
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
            title: 'What is your name?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <Input
                            placeholder="First Name"
                            onChangeText={first_name => setName({ ...name, first_name })}
                            value={name.first_name ?? ''}
                            autoFocus
                            autoCorrect={false}
                        />
                        <Input
                            placeholder="Last Name"
                            onChangeText={last_name => setName({ ...name, last_name })}
                            value={name.last_name ?? ''}
                            style={{ marginTop: 10 }}
                            autoCorrect={false}
                        />
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                if (name.first_name.length < 3 || name.last_name.length < 3) return Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    text2: 'Please enter a valid name',
                                    visibilityTime: 3000,
                                    autoHide: true,
                                    topOffset: 30,
                                    bottomOffset: 40,
                                });
                    
                                Global.profileBuilder = {
                                    name: name.first_name.charAt(0).toUpperCase() + name.first_name.slice(1).toLowerCase() + ' '
                                        + name.last_name.charAt(0).toUpperCase() + name.last_name.slice(1).toLowerCase()
                                  };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', {
                                screen: 'AccountSetupScreen',
                                params: { currentSlide: currentSlide - 1 },
                            })}
                        >
                            Back
                        </Button>
                    </View>
                );
            }
        },
        3: {
            title: 'What is your date of birth?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Input
                                placeholder="Day"
                                onChangeText={(value) => setDob({ ...dob, day: value })}
                                value={dob.day ?? ''}
                                keyboardType="numeric"
                                maxLength={2}
                            />

                            <Input
                                placeholder="Month"
                                onChangeText={(value) => setDob({ ...dob, month: value })}
                                value={dob.month ?? ''}
                                keyboardType="numeric"
                                maxLength={2}
                            />
                            
                            <Input
                                placeholder="Year"
                                onChangeText={(value) => setDob({ ...dob, year: value })}
                                value={dob.year ?? ''}
                                keyboardType="numeric"
                                maxLength={4}
                            />
                        </View>
                        <Button 
                            key={ 'dob' }
                            style={{ marginTop: 10, width: '100%' }}
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

                                Global.profileBuilder = { ...Global.profileBuilder, age: calculatedAge };
                                
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        4: {
            title: 'What is your gender?',
            description: 'This helps us find the best matches for you.',
            dArr: ['Male', 'Female', 'Other'],
            screen: (dArr, navigation) => {
                return (
                    <View>
                        { dArr.map((value) => {
                            return (
                                <Button
                                    key={ value }
                                    style={{ marginTop: 10, width: '100%' }}
                                    mode={gender === value.toUpperCase() ? null : 'contained'}
                                    onPress={() => {
                                        setGender(value.toUpperCase());
                                        Global.profileBuilder = { ...Global.profileBuilder, gender: value.toUpperCase() };
                                        navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                                    }}
                                >
                                    { value }
                                </Button>
                            );
                        })}
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        5: {
            title: 'What is your sexual orientation?',
            description: 'This helps us find the best matches for you.',
            dArr: ['Straight', 'Gay', 'Bisexual'],
            screen: (dArr, navigation) => {
                return (
                    <View>
                        {dArr.map((value) => {
                            return (
                                <Button
                                    key={value}
                                    style={{ marginTop: 10, width: '100%' }}
                                    mode={orientation === value.toUpperCase() ? null : 'contained'}
                                    onPress={() => {
                                        let attraction;
                                        const selectedGender = Global.profileBuilder.gender;
        
                                        if (value === 'Straight') {
                                            attraction = selectedGender === 'MALE' ? 'FEMALE' : 'MALE';
                                        } else if (value === 'Gay') {
                                            attraction = selectedGender;
                                        } else {
                                            attraction = 'BOTH';
                                        }
        
                                        setOrientation(value.toUpperCase());
                                        Global.profileBuilder = { ...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), attraction: value.toUpperCase() }};
                                        navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                                    }}
                                >
                                    { value }
                                </Button>
                            );
                        })}
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        6: {
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
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                if (likes.length === 0) return console.log('Need at least one dislike');
                                const aLikes = Utils.findKeysByValues(dInterest, likes);
                                Global.profileBuilder = {...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), likes: aLikes.map(e => parseInt(e))}};
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },    
        7: {
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
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                if (dislikes.length === 0) return console.log('Need at least one dislike');
                                const aDislikes = Utils.findKeysByValues(dInterest, dislikes);
                                Global.profileBuilder = {...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), dislikes: aDislikes.map(e => parseInt(e))}};
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },    
        8: {
            title: 'What is your preferred relationship type?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView
                            style={{ flexGrow: 0, height: '75%', paddingTop: 10 }}
                            contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {Object.keys(dRelationship).map((key) => {
                                const label = dRelationship[key];
                                return (
                                    <View key={key} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, marginBottom: 10, width: '100%' }}>
                                        <CheckBox
                                            key={key}
                                            title={label}
                                            containerStyle={{ width: '100%', backgroundColor: relationshipType === key ? 'lightblue' : 'transparent', borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                                            textStyle={{ textAlign: 'center' }}
                                            checked={relationshipType === key}
                                            onPress={() => setRelationshipType(key)}
                                        />
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Scroll down to view more options</Text>
                        <Button
                            key={'orientation'}
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                Global.profileBuilder = {...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), relationshipType: parseInt(relationshipType)}};
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        9: {
            title: 'What is your preferred Age Range?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <View>
                            <Text>Min Age: {ageRange.min}</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={18}
                                maximumValue={99}
                                step={1}
                                value={ageRange.min}
                                onValueChange={(value) => setAgeRange({ ...ageRange, min: value })}
                                minimumTrackTintColor="#2f95dc"
                                maximumTrackTintColor="#ccc"
                            />
                        </View>
        
                        <View>
                            <Text>Max Age: {ageRange.max}</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={18}
                                maximumValue={99}
                                step={1}
                                value={ageRange.max}
                                onValueChange={(value) => setAgeRange({ ...ageRange, max: value })}
                                minimumTrackTintColor="#2f95dc"
                                maximumTrackTintColor="#ccc"
                            />
                        </View>
        
                        <Button
                            key={'ageRange'}
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                const { min, max } = ageRange;
                                const isValidRange = min <= max;
        
                                if (!isValidRange) return Toast.show({
                                    type: 'error',
                                    text1: 'Error',
                                    text2: 'Please enter a valid age range.',
                                    visibilityTime: 4000,
                                    autoHide: true,
                                    topOffset: 30,
                                    bottomOffset: 40,
                                });
        
                                Global.profileBuilder = {...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), ageRange: [ parseInt(min), parseInt(max) ]}};
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        10: {
            title: 'What is your preferred Distance Range?',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View>
                        <View>
                            <Text>Distance: { distanceRange } miles</Text>
                            <Slider
                                style={{ width: '100%', height: 40 }}
                                minimumValue={1}
                                maximumValue={99}
                                step={5}
                                value={distanceRange}
                                onValueChange={(value) => setDistanceRange(value)}
                                minimumTrackTintColor="#2f95dc"
                                maximumTrackTintColor="#ccc"
                            />
                        </View>
        
                        <Button
                            key={'distanceRange'}
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                Global.profileBuilder = {...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), distanceRange: parseInt(distanceRange)}};
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        11: {
            title: 'Please provide a description of yourself',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ marginBottom: 5 }}>{bio.length}/300</Text>
                        <Input
                            style={{ width: '100%', height: 150, padding: 10, marginBottom: 20 }}
                            multiline
                            numberOfLines={6}
                            maxLength={300}
                            onChangeText={setBio}
                            value={bio}
                            textAlignVertical="top"
                            placeholder="Write a brief bio here..."
                        />
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Optional, can be altered later...</Text>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                Global.profileBuilder = {...Global.profileBuilder, match_data: {...(Global.profileBuilder.match_data || {}), description: bio }};
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
                        </Button>
                    </View>
                );
            },
        },
        12: {
            title: 'You are all set!',
            description: 'You can now start using the app!',
            screen: (dArr, navigation) => {

                async function saveProfileData(profileData) {
                    try {
                        const profilesRef = collection(firebaseFirestore, 'users');
                        
                        const loggedInUserId = await Global.getClientData('@user_id');
                        const docRef = doc(profilesRef, loggedInUserId);
                        await setDoc(docRef, profileData);
                        
                        console.log('Document written with custom name:', loggedInUserId);
                    } catch (e) {
                        console.error('Error adding document:', e);
                    }
                }

                return (
                    <View>
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Please ensure all the details are up-to-date and correct! This is to give you the best opportunity to find your partner.</Text> 
                        <Button 
                            style={{ marginTop: 10, width: '100%' }}
                            title='Next'
                            mode="contained"
                            onPress={() => {
                                saveProfileData(Global.profileBuilder).then(() => {
                                    navigation.navigate('Main', { screen: 'SwipeScreen' });
                                    return Toast.show({
                                        type: 'success',
                                        text1: 'Success',
                                        text2: 'Your profile has been created!',
                                        visibilityTime: 4000,
                                        autoHide: true,
                                        topOffset: 30,
                                        bottomOffset: 40,
                                    });
                                })}
                            }
                        >
                            Submit
                        </Button>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="outlined"
                            onPress={() => navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide - 1 } })}
                        >
                            Back
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
        width: '100%',
    },
    buttonContainer: {
        justifyContent: 'flex-end',
    },
});