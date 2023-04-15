import React from 'react'
import { StyleSheet } from 'react-native'
import { Button as PaperButton } from 'react-native-paper'

import { theme } from '../theme'

const styles = StyleSheet.create({
	button: {
		contained: {
			paddingVertical: 4,
			borderRadius: 4,
			color: 'white',
			backgroundColor: theme.colors.button.primary
		},
		outlined: {
			paddingVertical: 3,
			borderStyle: 'solid',
			borderColor: theme.colors.button.primary,
			borderRadius: 4, 
			borderWidth: 2
		}
	},
	text: {
		fontWeight: 'bold',
		fontSize: 15,
		lineHeight: 26,
		contained: {
			color: 'white'
		},
		outlined: {
			color: theme.colors.button.primary
		}
	},
})

export default function Button({ mode, style, ...props }) {
    return (
      	<PaperButton
        	style={[
        	  	style ? style : styles.button,
				mode === 'outlined' ? styles.button.outlined : styles.button.contained,
        	]}
			labelStyle={[
				style ? style : styles.text,
				mode === 'outlined' ? styles.text.outlined : styles.text.contained,
		  	]}
			mode={mode}
			{...props}
      	/>
  	)
}
