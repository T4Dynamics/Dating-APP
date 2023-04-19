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