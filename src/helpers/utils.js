import * as Global from '../helpers/globals';

import { firebaseAuth, signOut } from "../../config/firebase";

const findKeysByValues = (jsonObj, values) => {
    const keys = [];
    for (const [key, value] of Object.entries(jsonObj)) {
        if (values.includes(value)) {
            keys.push(key);
        }
    }
    return keys;
}

export { findKeysByValues }