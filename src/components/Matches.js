import React from 'react'
import { StyleSheet, View, Text } from 'react-native'

import { theme } from '../theme'
import { Icon } from 'react-native-elements'

export default function Matches({ matchData, index, children }) {
    return (
      	<View style={[styles.container]}>
            <Text>
                {matchData.name}
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
        width: '90%',
        height: '10%',
	},
})