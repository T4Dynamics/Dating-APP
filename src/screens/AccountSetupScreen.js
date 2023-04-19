import React from "react";

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckBox } from "react-native-elements";

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
            <View>
                { displayData(currentSlide, navigation) }
            </View>
        </Background>
    );
}

const displayData = (currentSlide, navigation) => {

    let [age, setAge] = React.useState('');
    let [orientation, setOrientation] = React.useState('');
    let [likes, setLikes] = React.useState([]);
    let [dislikes, setDislikes] = React.useState([]);

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
            title: 'What is your age?',
            description: 'This helps us find the best matches for you.',
            screen: (title, description, dArr, navigation) => {
                return (
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
                        <Input
                            placeholder="Age"
                            onChangeText={ setAge }
                            value={ age }
                        />
                        <Button 
                            key={ 'age' }
                            style={{ marginTop: 10 }}
                            mode="contained"
                            onPress={() => {
                                Global.profileBuilder = { age: age };
                                if (age.length === 0) return console.log('Age is empty');
                                if (age < 18) return console.log('Age is less than 18');
                                
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        >
                            Next
                        </Button>
                    </View>
                );
            },
        },
        2: {
            title: 'What is your gender?',
            description: 'This helps us find the best matches for you.',
            dArr: ['Male', 'Female', 'Other'],
            screen: (title, description, dArr, navigation) => {
                return (
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
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
        3: {
            title: 'What is your sexual orientation?',
            description: 'This helps us find the best matches for you.',
            screen: (title, description, dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            { dOrientation.map((e) => {
                                return (
                                    <View key={e} style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 5, marginBottom: 10 }}>
                                        <CheckBox
                                            key={ e }
                                            title={ e }
                                            checkedIcon='dot-circle-o'
                                            uncheckedIcon='circle-o'
                                            checked={ orientation === e }
                                            onPress={() => setOrientation(e)}
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        <Button
                            key={ 'orientation' }
                            style={{ marginTop: 10, width: '75%', alignSelf: 'center' }}
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
        4: {
            title: 'What are your interests?',
            description: 'Pick as many as you like up to 5. This helps us find the best matches for you.',
            screen: (title, description, dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
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
                            style={{ marginTop: 10, width: '75%', alignSelf: 'center' }}
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
        5: {
            title: 'What do you dislike?',
            description: 'Pick as many as you dislike up to 5. This helps us find the best matches for you.',
            screen: (title, description, dArr, navigation) => {
                return (
                    <View style={{ flex: 1, alignSelf: 'center', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
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
                            style={{ marginTop: 10, width: '75%', alignSelf: 'center' }}
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
        6: {
            title: 'Test',
            description: 'JSON Builder temporary screen',
            screen: (title, description, dArr, navigation) => {
                return (
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
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

    return data[currentSlide].screen(
        data[currentSlide].title,
        data[currentSlide].description,
        data[currentSlide].dArr,
        navigation
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
});