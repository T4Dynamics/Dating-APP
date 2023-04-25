import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';

function Message({ data, navigation, ...props }) {
    return (
        <TouchableOpacity style={[styles.container]} onPress={() => navigation.navigate('Matches', { screen: 'MessageScreen', params: { 
            matchId: data.potentialMatchDoc.user_ref._key.path.segments[6], 
            matchName: data.matchData.name 
        }})}>
            <View style={styles.leftContainer}>
                <Image source={require('../assets/blank_user.png')}  style={styles.userImage} />
            </View>
            <View style={styles.rightContainer}>
                <View style={styles.messageContent}>
                    <Text>{data.matchData.name}</Text>
                    <Text>This is a message from the user</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '90%',
        height: 75,
        marginBottom: 10,
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        padding: 10,
    },
    leftContainer: {
        width: '25%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightContainer: {
        width: '75%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userImage: {
        width: '100%',
        height: '100%',
        padding: 5,
        borderRadius: 100,
    },
    
    messageContent: {
        paddingVertical: 15,
    }
});

export default Message;