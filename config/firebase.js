import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

import { getReactNativePersistence } from 'firebase/auth/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: Constants.manifest.extra.apiKey,
    authDomain: Constants.manifest.extra.authDomain,
    databaseURL: Constants.manifest.extra.databaseURL,
    projectId: Constants.manifest.extra.projectId,
    storageBucket: Constants.manifest.extra.storageBucket,
    messagingSenderId: Constants.manifest.extra.messagingSenderId,
    appId: Constants.manifest.extra.appId,
    databaseURL: Constants.manifest.extra.databaseURL,
};

let firebaseApp;
let firebaseAuth;
let firebaseFirestore;

if (getApps.length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
    firebaseFirestore = getFirestore(firebaseApp);
} else {
    firebaseApp = getApp();
    firebaseAuth = getAuth();
    firebaseFirestore = getFirestore();
}

export { 
    //App
    firebaseApp, 

    //Auth
    firebaseAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, signOut, 
    updateProfile, 

    //Firestore
    firebaseFirestore, 
    collection, 
    addDoc,
    getDocs
};