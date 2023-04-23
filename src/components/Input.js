import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'

import { theme } from '../theme'

export default function Input({ placeholder, multiline, numberOfLines, style, ...props }) {

    return (
        <View style={[styles.view, style]}>
            <TextInput
                placeholder = { placeholder }
                multiline={multiline}
                numberOfLines={numberOfLines}
                focusColor="blue"
                style = {[styles.input, style]}
                {...props}  
            />
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        width: '100%',
    },
    input: {
        backgroundColor: theme.colors.accent,
        borderRadius: 4,
        height: 48,
        width: '100%',
        marginVertical: 10,
        padding: 10,
    },
    multilineInput: {
        height: 'auto',
    },
})