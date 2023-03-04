import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { getReactNativePersistence } from 'firebase/auth/react-native';

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

export { firebaseApp, firebaseAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile };