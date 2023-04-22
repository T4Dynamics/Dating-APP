import AsyncStorage from '@react-native-async-storage/async-storage';
import User from '../models/User';

export let matches = [];
export let profileBuilder = [];

const storeClientData = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {}
}

const getClientData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            const valueJson = JSON.parse(value);
            return valueJson;
        }
    } catch (e) {}
}

const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
    } catch (e) {}
}

const getClientDocument = async () => {
    try {
        const value = await AsyncStorage.getItem('@user_document');
        if (value !== null) {
            const valueJson = JSON.parse(value);
            const user = new User(JSON.parse(valueJson));

            return user;
        }
    } catch (e) {}
}



export { storeClientData, getClientData, getClientDocument, clearAllData }

