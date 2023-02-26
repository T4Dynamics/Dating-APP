import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile} from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';


//import { REACT_APP_API_KEY, REACT_APP_AUTH_DOMAIN, REACT_APP_PROJECT_ID, REACT_APP_STORAGE_BUCKET, REACT_APP_MESSAGING_SENDER_ID, REACT_APP_APP_ID} from '@env'

//import * as dotenv from 'dotenv'
//dotenv.config()

let r;

const firebaseConfig = {
    apiKey: "AIzaSyAEbS93yb7ERaMkrrZy2KiONv69acGO4F4",
    authDomain: "bu-datingapp.firebaseapp.com",
    projectId: "bu-datingapp",
    storageBucket: "bu-datingapp.appspot.com",
    messagingSenderId: "738694565034",
    appId: "1:738694565034:web:4412b7bd38d05999ed14d3",
};

let firebaseApp;
let firebaseAuth;

if (getApps.length === 0) {
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