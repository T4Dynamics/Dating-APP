import { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";

import Slider from '@react-native-community/slider';
import Toast from 'react-native-toast-message';

import Button from "../components/Button";
import Background from "../components/Background";

export default function SwipeSettingScreen({ navigation }) {

    const [distance, setDistance] = useState({ min: 0, max: 99 });

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
                    <Text>Min Distance: {distance.min}</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={18}
                        maximumValue={99}
                        step={1}
                        value={distance.min}
                        onValueChange={(value) => setDistance({ ...distance, min: value })}
                        minimumTrackTintColor="#2f95dc"
                        maximumTrackTintColor="#ccc"
                    />
                </View>
                <View>
                    <Text>Max Distance: {distance.max}</Text>
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={18}
                        maximumValue={99}
                        step={1}
                        value={distance.max}
                        onValueChange={(value) => setDistance({ ...distance, max: value })}
                        minimumTrackTintColor="#2f95dc"
                        maximumTrackTintColor="#ccc"
                    />
                </View>
                <Button style={{ marginTop: 10 }} mode="contained" onPress={ () => saveDistance()}> Save </Button>
                <Button style={{ marginTop: 10 }} mode="outlined" onPress={ () => navigation.navigate('Main', { screen: 'SwipeScreen' }) }> Go Back </Button>
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
        maxWidth: 340,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
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
