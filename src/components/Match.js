import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';

export default function Match({ data, navigation }) {

	const name = data ? `${data.matchData.name}` : undefined;
	const firstName = name ? name.split(' ')[0] : null;
	const textPreview = firstName ?? 'Likes';

	return (
		<TouchableOpacity style={[styles.container]} onPress={() => navigation.navigate('Matches', { screen: 'MessageScreen', params: { 
			matchId: data.potentialMatchDoc.user_ref._key.path.segments[6], 
			matchName: data.matchData.name,
			matchTimestamp: data.potentialMatchDoc.match_date,
			docRef: data.potentialMatchDoc.docRef
		}})}>

			<View style={[styles.card]}>
				<ImageBackground
					style={{ width: '100%', height: '100%',}}
					source={{ uri: data.matchData.url }}
				/>
			</View>
			<Text style={[styles.text]}>
				{ textPreview }
			</Text>
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
  	container: {
		flexDirection: 'column',
		alignItems: 'center',
		padding: 10,
        margin: 5,
        width: 100,
        height: '100%',
	},
	card: {
		width: '100%',
		height: 75,
		borderRadius: 15,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	text: {
		marginTop: 5,
		fontSize: 16,
		color: '#333',
		textAlign: 'center',
		overflow: 'hidden',
	},
})