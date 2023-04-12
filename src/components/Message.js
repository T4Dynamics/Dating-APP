import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

function Message(props) {
    return (
        <View style={styles.messageContainer}>
            <Image source={require('../assets/blank_user.png')}  style={styles.user_image} />
            <View style={styles.messageContent}>
                <Text>Username</Text>
                <Text>This is a message from the user</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        display: 'flex',
        flexDirection: 'row',
        minWidth: 100,
        marginVertical: 10,
    },
    user_image: {
        width: 70,
        height: 70,
        padding: 5,
        borderRadius: 100,
    },
    messageContent: {
        left: 12,
        paddingVertical: 15,
    }
});

export default Message;