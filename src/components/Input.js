import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

import { theme } from '../theme'

export default function Input({ placeholder, style, ...props }) {

    return (
        <View style={[styles.view, style]}>
            <TextInput
                placeholder = {placeholder}
                focusColor="blue"
                style = {[styles.input, style]}
                {...props}  
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: theme.colors.accent,
        borderRadius: 4,
        height: 48,
        width: 300,
        marginVertical: 10,
        padding: 10,
    },
})