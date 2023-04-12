import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

import Constants from 'expo-constants';

import { getReactNativePersistence } from 'firebase/auth/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAEbS93yb7ERaMkrrZy2KiONv69acGO4F4",
  authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
  projectId: Constants.manifest?.extra?.firebaseProjectId,
  storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
  appId: Constants.manifest?.extra?.firebaseAppId,
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