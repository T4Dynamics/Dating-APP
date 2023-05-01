import React from "react";
import { Text, View, StyleSheet, FlatList, Dimensions } from "react-native";
import { Input } from "react-native-elements";

import { Icon } from 'react-native-elements'

import Background from "../components/Background";
import Input from '../components/Input';
import { ScrollView } from 'react-native-gesture-handler';

import * as Global from '../helpers/globals';

import Toast from 'react-native-toast-message';

export default function MessageScreen({ navigation }) {

    const route = useRoute();
    const data = route.params ? route.params : null;

    const name = data ? `${data.matchName}` : undefined;
	const firstName = name ? name.split(' ')[0] : null;
	const nameDisplay = firstName ?? 'Unknown';

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    let chatKey = `chat-${data.matchId}`;

    useEffect(() => {
        const loadMessages = async () => {

            const storedMessages = await Global.getClientData(chatKey);
            if (storedMessages) setMessages(JSON.parse(storedMessages));
        }

        loadMessages();
    }, []);

    const sendMessage = async () => {
        if (message === '') return Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Message cannot be empty',
            visibilityTime: 4000,
            autoHide: true,
            topOffset: 30,
            bottomOffset: 40,
        });

        const newMessage = {
            sender: 'user',
            content: message,
        };

        const updatedMessage = [...messages, newMessage];

        await Global.storeClientData(chatKey, JSON.stringify(updatedMessage));
        setMessages([...messages, { sender: 'user', content: message }]);
        setMessage('');
    }

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
    centeredText: {
        textAlign: "center",
        flex: 1,
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


