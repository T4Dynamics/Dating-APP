import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Input } from "react-native-elements";

export default function MessagesScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <Input placeholder="Search" style={styles.search} />
            <View style={styles.messageContainer}>
                
            </View>
        </View>
    );
}

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
        borderRadius: '100%',
        borderBottomWidth: 0,
        marginVertical: 10,
    },
    messageContainer: {
        left: '5%',
        backgroundColor: '#222',
    }
});

