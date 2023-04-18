import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';

export const userId = "";
export const userName = "";
export let userDocument = {};
export let matchesLoaded = false;
export let matches = [];

export let profileBuilder = [];

const storeClientData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
    }
}

const getClientData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            const valueJson = JSON.parse(value);
            return valueJson;
        }
    } catch (e) {
        console.log(e);
    }
}

const getClientDocument = async () => {
    try {
        const value = await AsyncStorage.getItem('@user_document');
        if (value !== null) {
            const valueJson = JSON.parse(value);
            const user = new User(JSON.parse(valueJson));

            return user;
        }
    } catch (e) {
        console.log(e);
    }
}



export { storeClientData, getClientData, getClientDocument }

