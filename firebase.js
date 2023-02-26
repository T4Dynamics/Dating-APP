import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from "../.env";


const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
};

let firebaseApp;
let firebaseAuth;

if (Firebase.apps.length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} else {
    firebaseApp = getApp();
    firebaseAuth = getAuth();
}

const createUser = (displayName, email, password) => createUserWithEmailAndPassword(firebaseAuth, email, password).then(credentials => {
    const user = credentials.user;

    updateProfile(user, { displayName: displayName }).then(() => {
        console.log('User created successfully');
    }).catch(error => {
        let errorMessage = error.code === 'auth/email-already-in-use' ? 'Email already in use' :
            error.code === 'auth/invalid-email' ? 'Invalid email' :
            error.code === 'auth/weak-password' ? 'Password is too weak' :
            error.message;

        Toast.show({
            type: 'error',
            text1: 'Error',
            text2: errorMessage,
        });
    })
})

export { firebaseApp, firebaseAuth, createUser, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile };