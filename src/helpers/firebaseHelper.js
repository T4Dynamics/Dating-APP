import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from "firebase/auth";

export default FirebaseHelper = {

    constructor() {
        this.auth = getAuth();
    },

    register: async (email, password) => {
        const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
        return userCredential.user;
    },

    login: async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        return userCredential.user;
    },

    logout: async () => {
        await signOut(this.auth);
    },

    getCurrentUser: () => {
        return this.auth.currentUser;
    }
}