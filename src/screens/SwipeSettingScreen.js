import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";

import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';

import Button from "../components/Button";
import Background from "../components/Background";

export default function SwipeSettingScreen({ navigation }) {
    const [distance, setDistance] = useState(50);

    const saveDistance = async () => {
        if (distance.min > distance.max) return Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Min distance cannot be greater than max distance',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });

        Toast.show({
            type: 'success',
            text1: 'Success',
            text2: 'Distance saved',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });
    }

    return (
        <Background>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Text style={styles.title}>Settings Screen</Text>
            <View style={styles.inputContainer}>
                <View>
                    <Text>Max Distance: {distance}</Text>
                    <Slider
                        style={{ width: '100%', height: 40, marginBottom: 30 }}
                        minimumValue={0}
                        maximumValue={99}
                        step={1}
                        value={distance}
                        onValueChange={(value) => setDistance(value)}
                        minimumTrackTintColor="#000"
                        maximumTrackTintColor="#ccc"
                    />
                </View>
                <Button mode="contained" onPress={ 
                    () => {
                        saveDistance();
                        navigation.navigate('Main', { screen: 'SwipeScreen' })
                    }
                }> Save </Button>
            </View>
            </KeyboardAvoidingView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        width: '100%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'column',
    },
    inputContainer: {
        justifyContent: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
    },
});
