import { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { Text, View, StyleSheet, TouchableOpacity, KeyboardAvoidingView } from "react-native";

import { Icon } from 'react-native-elements'

import Background from "../components/Background";
import Input from '../components/Input';
import { ScrollView } from 'react-native-gesture-handler';

import * as Global from '../helpers/globals';

import Toast from 'react-native-toast-message';
import { firebaseFirestore, collection, addDoc, getDoc, setDoc, getDocs, updateDoc, doc, where, query, orderBy, onSnapshot } from '../../config/firebase';

export default function MessageScreen({ navigation }) {

    const route = useRoute();
    const data = route.params ? route.params : null;

    const name = data ? `${data.matchName}` : undefined;
	const firstName = name ? name.split(' ')[0] : null;
	const nameDisplay = firstName ?? 'Unknown';

    const matchDate = new Date(data.matchTimestamp * 1000);
    const day = String(matchDate.getDate()).padStart(2, '0');
    const month = String(matchDate.getMonth() + 1).padStart(2, '0');
    const year = matchDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [chatKey, setChatKey] = useState('');

    const generateChatKey = (userId, matchId) => {
        console.log('userId', userId);
        console.log('matchId', matchId);
        return `CHAT_${[userId, matchId].sort().join('_')}`;
    }

    useEffect(() => {
        const loadMessages = async () => {
            const user = await Global.getClientDocument();
            const newChatKey = generateChatKey(user.id, data.matchId);
            setChatKey(newChatKey);

        
            if (!newChatKey) return;
        
            const chatDocRef = doc(firebaseFirestore, 'chats', newChatKey);
            const chatDoc = await getDoc(chatDocRef);

        
            if (!chatDoc.exists()) {
                // No need to do anything IG
            }

            const potentialDocRef = doc(firebaseFirestore, 'potential_matches', data.docRef);
            await setDoc(potentialDocRef, { messaged: true }, { merge: true })

        
            const messagesCollectionRef = collection(chatDocRef, 'messages');
            const q = query(messagesCollectionRef, orderBy('timestamp'));

            return onSnapshot(q, snapshot => {
                setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            });
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
            timestamp: new Date().getTime(),
        };

        const messagesCollectionRef = collection(doc(firebaseFirestore, 'chats', chatKey), 'messages');
        addDoc(messagesCollectionRef, newMessage);

        setMessage('');
    }

    return (
        <Background>
            <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.header}>
                <View style={styles.button} onStartShouldSetResponder={() => navigation.navigate('Matches', { screen: 'MatchesScreen'})}>
                    <Icon 
                        name='chevron-left'
                        type='material-community'
                        size={50}
                        color={'grey'}
                        style={{
                            zIndex: 1,
                        }}
                    />
                </View>
                <Text style={styles.centerText}>{ data.matchName }</Text>
            </View>
            <ScrollView
                style={styles.messageContainer}
                contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center' }}
            >
                    <Text style={{ fontSize: 12, alignSelf: 'center', paddingBottom: 10 }}>You matched with { nameDisplay } on { data.matchTimestamp ? formattedDate : 'Unknown Date'}</Text>
                {
                    messages.map((msg, index) => (
                        <View
                            key={index}
                            style={ msg.sender === 'user' ? styles.userMessageWrapper : styles.matchMessageWrapper }
                        >
                        <Text
                            style={[
                                styles.message,
                                msg.sender === 'user' ? styles.userMessage : styles.matchMessage,
                            ]}
                        >
                            { msg.content }
                        </Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputContainer}>
                <Input
                    style={styles.textInput}
                    placeholder="Type a message..."
                    onChangeText={setMessage}
                    value={message}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
            </KeyboardAvoidingView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        width: '100%',
        height: '10%',
        minHeight: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        paddingHorizontal: 15,
        paddingVertical: 10,

        shadowColor: "grey",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 0,
    },
    button: {
        position: "absolute",
        left: 0,
    },
    centeredText: {
        textAlign: "center",
        flex: 1,
    },
    inputContainer: {
        flexDirection: 'row',
        height: '10%',
        minHeight: 75,
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    textInput: {
        flex: 1,
        borderRadius: 5,
        height: '100%',
        marginRight: 10,
    },
    sendButton: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    },
    sendButtonText: {
        color: 'black',
    },
    messageContainer: {
        flexGrow: 0,
        height: '100%',
        paddingTop: 10,
        paddingHorizontal: 10,
        width: '100%',
    },
    userMessageWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    matchMessageWrapper: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10,
    },
    userMessage: {
        backgroundColor: '#00B2FF',
        color: 'white',
        borderBottomRightRadius: 0,
    },
    matchMessage: {
        backgroundColor: 'lightgrey',
        color: 'black',
        borderBottomLeftRadius: 0,
    },
    message: {
        padding: 10,
        borderRadius: 10,
    },
});