import React, { useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();

export default function useAuth() {
    const [user, setUser] = React.useState<User | null>(null);

    useEffect(() => {
        const unsubscribeAuthChanged = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return unsubscribeAuthChanged;
    }, []);

    return { user };
}