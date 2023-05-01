import React from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Input } from "react-native-elements";

import Message from "../components/Message";

const dummyData = [
    {id: '1', user: 'Sarah', message: 'Hello!'}, 
    {id: '2', user: 'Megan', message: 'I know right!'},
    {id: '3', user: 'Sarah', message: 'Babe!'}, 
    {id: '4', user: 'Hannah', message: 'You so cute!'},
    {id: '5', user: 'Jude', message: 'Cheers mush'}, 
    {id: '6', user: 'Joanna', message: 'Yeah I used to go ther...'},
    {id: '7', user: 'Rose', message: 'Hello!'}, 
    {id: '8', user: 'Gale', message: 'Im old enough to be your granmother!'},
    {id: '9', user: 'Sarah', message: 'Hello!'},
    {id: '10', user: 'Megan', message: 'I know right!'},
    {id: '11', user: 'Sarah', message: 'Babe!'},
]

export default function MessagesScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Messages</Text>
            <FlatList 
                data={dummyData}
                renderItem={({item}) => <Message message={item.message} user={item.user} />}
                keyExtractor={item => item.id}
                style={styles.messageContainer}
                ListHeaderComponent={<Input placeholder="Search" style={styles.search} />}
                
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height * .75,
        top: 100,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
    },
    search: {
        padding: 15,
        backgroundColor: '#F6F6F6',
        borderRadius: 10,
        borderBottomWidth: 0,
        marginVertical: 10,
    },
    messageContainer: {
        flexGrow: 0,
        marginTop: 20,
        flexDirection: 'column',
        gap: 20,
    }
});

