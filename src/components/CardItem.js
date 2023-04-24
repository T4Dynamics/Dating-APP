import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { theme } from '../theme'
import { Icon } from 'react-native-elements'

export default function CardItem({ children }) {
    return (
      	<View style={[styles.container]}>
            <Icon
                name='star'
                type='material-community'
                color={theme.colors.primary}
                size={20}
            />
            <Text>
                {children}
            </Text>
        </View>
  	)
}

const styles = StyleSheet.create({
  	container: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: 'white',
		padding: 10,
		borderRadius: 10,
        margin: 5,
	},
})