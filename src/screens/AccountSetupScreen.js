import React from "react";

import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Button from "../components/Button";
import Background from "../components/Background";

import * as Global from '../helpers/globals';
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

    const [age, setAge] = React.useState('');

    const data = {
        1: {
            title: 'What is your date of birth?',
            description: 'This helps us find the best matches for you.',
            screen: (title, description, navigation) => {
                return (
                    <View>
                        <Text>{title}</Text>
                        <Text>{description}</Text>
                        <Input
                            placeholder="Email"
                            onChangeText={ setAge }
                            value={ age }
                        />
                        <Button 
                            title='Next'
                            onPress={() => {
                                Global.profileBuilder = { age: age };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1  } });
                            }}
                        />
                    </View>
                );
            },
        },
        2: {
            title: 'What is your gender?',
            description: 'This helps us find the best matches for you.',
            screen: (title, description, navigation) => {
                return (
                    <View>
                        <Text>{title}</Text>
                        <Text>{description}</Text>
                        <Button 
                            title='Male'
                            mode="outlined"
                            onPress={() => {
                                Global.profileBuilder = { ...Global.profileBuilder, gender: 'MALE' };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        />
                        <Button 
                            title='Female'
                            mode="outlined"
                            onPress={() => {
                                Global.profileBuilder = { ...Global.profileBuilder, gender: 'FEMALE' };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        />
                        <Button 
                            title='Other'
                            mode="outlined"
                            onPress={() => {
                                Global.profileBuilder = { ...Global.profileBuilder, gender: 'OTHER' };
                                navigation.navigate('Main', { screen: 'AccountSetupScreen', params: { currentSlide: currentSlide + 1 } });
                            }}
                        />
                    </View>
                );
            },
        },
        3: {
            title: 'Test',
            description: 'This helps us find the best matches for you.',
            screen: (title, description, navigation) => {
                return (
                    <View>
                        <Text>{title}</Text>
                        <Text>{description}</Text>
                        <Button 
                            title='Next'
                            mode={outlined}
                            onPress={() => console.log(Global.profileBuilder)}
                        />
                    </View>
                );
            },
        },
    }

    return data[currentSlide].screen(data[currentSlide].title, data[currentSlide].description, navigation);
}

