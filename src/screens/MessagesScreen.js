import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";

import Message from "../components/Message";

export default function MessagesScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
           
            <View style={styles.messageContainer}>
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
                <Message />
            </View>
        </View>
    );
}
// This search should only be visible on the MessagesScreen once swiped down, need to figure this out. 
// <Input placeholder="Search" style={styles.search} />

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: '10%',
        left: '5%',
        width: '90%',
    },
    title: {
        fontSize: 28,
    },
    search: {
        padding: 10,
        backgroundColor: '#F6F6F6',
        borderRadius: 100,
        borderBottomWidth: 0,
        marginVertical: 10,
    },
    messageContainer: {
        top: 20,
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    }
});

