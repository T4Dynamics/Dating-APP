import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, sendPasswordResetEmail, EmailAuthProvider, signInWithCredential } from 'firebase/auth';
import { getFirestore, collection, addDoc, setDoc, getDoc, getDocs, doc, where, query, updateDoc, limit, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { getReactNativePersistence } from 'firebase/auth/react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

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
let firebaseFirestore;
let firebaseStorage;

if (getApps.length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
    firebaseFirestore = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
} else {
    firebaseApp = getApp();
    firebaseAuth = getAuth();
    firebaseFirestore = getFirestore();
    firebaseStorage = getStorage()
}

export { 

    //App
    firebaseApp, 

    //Auth
    firebaseAuth,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    updateProfile, 
    sendPasswordResetEmail,
    signInWithCredential,
    EmailAuthProvider,

    //Firestore
    firebaseFirestore, 
    collection, 
    addDoc,
    getDoc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    where,
    query,
    limit,

    //Storage
    firebaseStorage,
    ref,
    uploadBytes,
    getDownloadURL
};