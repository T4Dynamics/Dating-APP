import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

import { theme } from '../theme';

const styles = StyleSheet.create({
	buttonContained: {
		paddingVertical: 4,
		borderRadius: 4,
		color: 'white',
		backgroundColor: theme.colors.button.primary,
	},
	buttonOutlined: {
		paddingVertical: 3,
		borderStyle: 'solid',
		borderColor: theme.colors.button.primary,
		borderRadius: 4,
		borderWidth: 2,
	},
	textContained: {
		fontWeight: 'bold',
		fontSize: 15,
		lineHeight: 26,
		color: 'white',
	},
	textOutlined: {
		fontWeight: 'bold',
		fontSize: 15,
		lineHeight: 26,
		color: theme.colors.button.primary,
	},
});

export default function Button({ mode, style, ...props }) {
  	return (
    	<PaperButton
      		style={[
        		style ? style : mode === 'outlined' ? styles.buttonOutlined : styles.buttonContained,
      		]}
      		labelStyle={[
      		  	style ? style : mode === 'outlined' ? styles.textOutlined : styles.textContained,
      		]}
      		mode={mode}
      		{...props}
    	/>
  	);
}