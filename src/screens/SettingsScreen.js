import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, KeyboardAvoidingView } from "react-native";

import { collection, setDoc, updateDoc, doc, firebaseFirestore } from "../../config/firebase";

import { CheckBox } from "react-native-elements";

import Button from "../components/Button";
import Background from "../components/Background";
import Header from "../components/Header";
import Toast from 'react-native-toast-message';
import Slider from '@react-native-community/slider';
import Input from "../components/Input";

import { useRoute } from '@react-navigation/native';

import dInterest from '../data/interests.json';
import dRelationship from '../data/relationshipType.json';

import * as Global from "../helpers/globals";
import * as Utils from '../helpers/utils';

export default function SettingsScreen({ navigation }) {

    const route = useRoute();
    const currentSlide = route.params ? route.params.currentSlide : 1;

    const [userDocument, setUserDocument] = useState();
    const [name, setName] = useState({ first_name: '', last_name: '' });
    const [gender, setGender] = useState('');
    const [orientation, setOrientation] = useState('');
    const [likes, setLikes] = useState([]);
    const [dislikes, setDislikes] = useState([]);
    const [relationshipType, setRelationshipType] = useState('');
    const [ageRange, setAgeRange] = useState({ min: 18, max: 99 });
    const [bio, setBio] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const userDocument = await Global.getClientDocument();
            setUserDocument(userDocument);
            
            setName({ first_name: userDocument.name.split(" ")[0], last_name: userDocument.name.split(" ")[1] });
            setGender(userDocument.gender);
            setOrientation(userDocument.attraction);
            setLikes(userDocument.getLikes());
            setDislikes(userDocument.getDislikes());
            setRelationshipType(userDocument.goal);
            setAgeRange({ min: userDocument.age_range[0], max: userDocument.age_range[1] });
            setBio(userDocument.bio);
        };

        fetchData();
    }, []);

    const displaySettings = (data) => {
        return (
            <View>
                {data.map((item, index) => {
                    return (
                        <TouchableOpacity key={index} style={styles.row} onPress={() => navigation.navigate('Profile', { screen: 'SettingsScreen', params: { currentSlide: index+2 } })}>
                            <Text style={styles.text}>{item}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }

    const settings = ['Name', 'Gender', 'Orientation', 'Interests', 'Dislikes', 'Relationship Type', 'Age Range', 'Bio'];

    if (currentSlide == 1) {
        return (
            <Background>
                <Header navigation={navigation}/>
                <View style={styles.container}>
                    <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>Edit Settings</Text>
                    <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 10 }}>Select an option below to edit</Text>
                    <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>Scroll to View</Text>
                    <ScrollView
                                style={{ flexGrow: 0, height: '65%', width: '80%', paddingTop: 10 }}
                                contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
                    >
                        { displaySettings(settings, navigation) }
                    </ScrollView>
                    <Button mode="contained" style={{ marginTop: 10, width: '80%' }} onPress={() => navigation.navigate('Profile', { screen: 'ProfileScreen' })}>
                        Go back
                    </Button>
                </View>
            </Background>
        );
    } else {
        return (
            <Background>
                <KeyboardAvoidingView style={styles.secondaryContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    { displayData(currentSlide, userDocument, navigation, name, setName, gender, setGender, orientation, setOrientation, likes, setLikes, dislikes, setDislikes, relationshipType, setRelationshipType, ageRange, setAgeRange, bio, setBio) }
                </KeyboardAvoidingView>
            </Background>
        );
    }
}

const updateProfile = async (userId, setting, data) => {
    const indexedData = ["likes", "dislikes", "relationshipType", "ageRange", "description", "attraction"].includes(setting);
    const dataToUpload = indexedData ? { match_data: { [setting]: data }} : { [setting]: data };

    const profileRef = doc(firebaseFirestore, 'users', userId);

    try {
        await setDoc(profileRef, dataToUpload, { merge: true })

    } catch (e) {
        console.error('Error updating document:', e);
    }
}

const displayData = (currentSlide, userDocument, navigation, name, setName, gender, setGender, orientation, setOrientation, likes, setLikes, dislikes, setDislikes, relationshipType, setRelationshipType, ageRange, setAgeRange, bio, setBio) => {

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

                                const fullName = name.first_name.charAt(0).toUpperCase() + name.first_name.slice(1).toLowerCase() + ' '
                                        + name.last_name.charAt(0).toUpperCase() + name.last_name.slice(1).toLowerCase()

                                updateProfile(userDocument.id, "name", fullName).then(() => {
                                    navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                });
                            }
                        }>
                            Save Setting
                        </Button>
                    </View>
                );
            }
        },
        3: {
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
                                        updateProfile(userDocument.id, "gender", value.toUpperCase()).then(() => {
                                            setGender(value.toUpperCase());
                                            navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                        });
                                    }}
                                >
                                    { value }
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
        
                                        updateProfile(userDocument.id, "attraction", value.toUpperCase()).then(() => {
                                            setOrientation(value.toUpperCase());
                                            navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                        });
                                    }}
                                >
                                    { value }
                                </Button>
                            );
                        })}
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
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                if (likes.length === 0) return console.log('Need at least one dislike');
                                const aLikes = Utils.findKeysByValues(dInterest, likes);

                                updateProfile(userDocument.id, "likes", aLikes.map(like => parseInt(like))).then(() => {
                                    navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                });
                            }}
                        >
                            Save Setting
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
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                if (dislikes.length === 0) return console.log('Need at least one dislike');
                                const aDislikes = Utils.findKeysByValues(dInterest, dislikes);

                                updateProfile(userDocument.id, "dislikes", aDislikes.map(dislike => parseInt(dislike))).then(() => {
                                    navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                });
                            }}
                        >
                            Save Setting
                        </Button>
                    </View>
                );
            },
        },    
        7: {
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
                                            containerStyle={{ width: '100%', backgroundColor: relationshipType == key ? 'lightblue' : 'transparent', borderWidth: 1, borderColor: '#ccc', borderRadius: 5 }}
                                            textStyle={{ textAlign: 'center' }}
                                            checked={relationshipType == key}
                                            onPress={() => setRelationshipType(key)}
                                        />
                                    </View>
                                );
                            })}
                        </ScrollView>
                        <Text style={{ textAlign: 'center', marginBottom: 10 }}>Scroll down to view more options</Text>
                        <Button
                            style={{ marginTop: 10, width: '100%' }}
                            mode="contained"
                            onPress={() => {
                                updateProfile(userDocument.id, "relationshipType", relationshipType).then(() => {
                                    navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                });
                            }}
                        >
                            Save Setting
                        </Button>
                    </View>
                );
            },
        },
        8: {
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

                                updateProfile(userDocument.id, "ageRange", [ageRange.min, ageRange.max]).then(() => {
                                    navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                });
                            }}
                        >
                            Save Setting
                        </Button>
                    </View>
                );
            },
        },
        9: {
            title: 'Please provide a description of yourself',
            description: 'This helps us find the best matches for you.',
            screen: (dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                        <Text style={{ marginBottom: 5 }}>1/300</Text>
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
                                updateProfile(userDocument.id, "description", bio).then(() => {
                                    navigation.navigate('Profile', { screen: 'SettingsScreen' });
                                });
                            }}
                        >
                            Save Setting
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
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    secondaryContainer: {
        flex: 1,
        padding: 20,
        width: '100%',
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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