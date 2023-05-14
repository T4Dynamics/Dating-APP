import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { collection, setDoc, doc, firebaseFirestore } from "../../config/firebase";

import Button from "../components/Button";
import Background from "../components/Background";
import Header from "../components/Header";

import * as Global from "../helpers/globals";

export default function SubscriptionScreen({ navigation }) {
    const [selectedSlider, setSelectedSlider] = useState(1);

    const slider1 = ['Unlimited Likes', 'Multiple Pictures'];
    const slider2 = ['Unlimited Likes', 'Multiple Pictures', 'Super Likes', 'No Ads']
    const slider3 = ['Unlimited Likes', 'Multiple Pictures', 'Super Likes', 'No Ads', 'Rewind', 'Passport']

    const purchasePremium = async () => {

        const userDocument = await Global.getClientDocument();

        const currentTime = new Date();
        const expiryTime = new Date(currentTime.setMonth(currentTime.getMonth() + 1));

        const premiumData = {
            'plan': selectedSlider,
            'expiry': Math.floor(expiryTime.getTime() / 1000)
        };

        try {
            const subscriptionRef = collection(firebaseFirestore, 'premium_profiles');
            
            const docRef = doc(subscriptionRef, userDocument.id);
            await setDoc(docRef, premiumData);
            
            console.log('Document written with custom name:', userDocument.id);
        } catch (e) {
            console.error('Error adding document:', e);
        }
    }

    const renderContent = () => {
        switch(selectedSlider) {
            case 1:
                return displayData(slider1);
            case 2:
                return displayData(slider2);
             case 3:
                return displayData(slider3);
            default:
                return null;
        }
    }

  return (
    <Background>
        <Header navigation={navigation}/>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}></Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button style={ styles.button } mode={ selectedSlider != 1 ? 'contained' : 'outlined'} onPress={ () => setSelectedSlider(1) }>Slider +</Button>
            <Button style={ styles.button } mode={ selectedSlider != 2 ? 'contained' : 'outlined'} onPress={ () => setSelectedSlider(2) }>Slider ++</Button>
            <Button style={ styles.button } mode={ selectedSlider != 3 ? 'contained' : 'outlined'} onPress={ () => setSelectedSlider(3) }>Slider +++</Button>
        </View>
        <ScrollView
                    style={{ flexGrow: 0, height: '50%', paddingTop: 10 }}
                    contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
        >
            { renderContent() }
        </ScrollView>
        <View style={styles.container}>
            <Button mode="contained" style={{ marginTop: 10, width: '100%'}} onPress={ () => { purchasePremium() } } >
                Purchase { selectedSlider == 1 ? 'Slider +' : selectedSlider == 2 ? 'Slider ++' : 'Slider +++'}
            </Button>
        </View>
    </Background>
  );
}

const displayData = (data) => {
    return (
        <View>
            {data.map((item, index) => {
                return (
                    <View key={index} style={styles.row}>
                        <Text style={styles.text}>{item}</Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '80%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#F6F6F6',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10
    }
});