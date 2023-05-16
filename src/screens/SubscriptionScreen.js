import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";

import { collection, setDoc, doc, firebaseFirestore } from "../../config/firebase";

import Button from "../components/Button";
import Background from "../components/Background";
import Header from "../components/Header";

import * as Global from "../helpers/globals";
import { theme } from "../theme";

export default function SubscriptionScreen({ navigation }) {
    const [selectedSlider, setSelectedSlider] = useState(1);
    const [userDocument, setUserDocument] = useState();
    const [refresh, setRefresh] = useState(false);

    const sliderPlus = ['No Ads', 'Unlimited Reverse', 'Unlimited Likes', 'Abroad'];
    const sliderPremium = [...sliderPlus, 'Admirers', 'See who likes you', 'Top Picks', 'Monthly Boost', 'See who you\'ve liked', 'Priority Likes', 'Message before matching']

    useEffect(() => {
        const fetchData = async () => {
            const userDocument = await Global.getClientDocument();
            setUserDocument(userDocument);
        };

        fetchData();
    }, [refresh]);

    const purchasePremium = async (bool) => {
        if (bool && ((userDocument.premium == 1 && selectedSlider == 1) || (userDocument.premium == 2 && selectedSlider == 2))) return;

        const currentTime = new Date();
        const expiryTime = new Date(currentTime.setMonth(currentTime.getMonth() + 1));

        let premiumData = {};

        if (bool) {
            premiumData = {
                'plan': selectedSlider,
                'expiry': Math.floor(expiryTime.getTime() / 1000)
            };
        } else premiumData.plan = 0;

        try {
            const subscriptionRef = collection(firebaseFirestore, 'premium_profiles');
            
            const docRef = doc(subscriptionRef, userDocument.id);
            await setDoc(docRef, premiumData);

            userDocument.premium = premiumData.plan;
            
            console.log('Document written with custom name:', userDocument.id);
        } catch (e) {
            console.error('Error adding document:', e);
        }

        if (premiumPlan === 1) premiumData['plan'] = 2;

        //await Global.storeClientData('@user_document', JSON.stringify(userDocument)).then(() => {
        //    setRefresh(toggle => !toggle) 
        //});
    }

    const premiumPlan = userDocument ? userDocument.premium : 0;

    let price = '4.99';
    let buttonText = 'Purchase Slider+';
    let buttonColor = '#63509F'

    if (selectedSlider === 2) {
        if (premiumPlan == 0) {
            price = '9.99';
            buttonText = 'Purchase Slider Premium';
        } else if (premiumPlan == 1) {
            price = '4.99';
            buttonText = 'Upgrade to Slider Premium';
        } else if (premiumPlan == 2) {
            price = '0.00';
            buttonText = 'You already have Slider Premium';
            buttonColor = 'gray';
        }
    } else if (selectedSlider === 1) {
        if (premiumPlan == 0) {
            price = '4.99';
            buttonText = 'Purchase Slider+';
        } else if (premiumPlan == 1) {
            price = '0.00';
            buttonText = 'You already have Slider+';
            buttonColor = 'gray';
        } else if (premiumPlan == 2) {
            price = '4.99';
            buttonText = 'Downgrade to Slider+';
        }
    }

    return (
        <Background>
            <Header navigation={navigation}/>
            <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}></Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button style={ styles.button } mode={ selectedSlider != 1 ? 'contained' : 'outlined'} onPress={ () => setSelectedSlider(1) }>Slider+</Button>
                <Button style={ styles.button } mode={ selectedSlider != 2 ? 'contained' : 'outlined'} onPress={ () => setSelectedSlider(2) }>Slider Premium</Button>
            </View>
            <Text style={{ fontSize: 12, textAlign: 'center', marginTop: 10 }}>Scroll to View</Text>
            <ScrollView
                        style={{ flexGrow: 0, height: '40%', width: '80%', paddingTop: 10 }}
                        contentContainerStyle={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
            >
                { selectedSlider == 1 ? displayData(sliderPlus) : displayData(sliderPremium) }
            </ScrollView>
            <View style={styles.container}>
                <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 10 }}>£{price}/month</Text>
                <Button mode="contained" style={{ marginTop: 10, width: '100%', backgroundColor: buttonColor }} onPress={ () => { purchasePremium(true) } } >
                    {buttonText}
                </Button>
                { premiumPlan != 0 ? <Button mode="outlined" style={{ marginTop: 10, width: '100%' }} onPress={ () => { purchasePremium(false) } } > Cancel Plan </Button> : null}
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
        width: Dimensions.get('window').width * 0.8,
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10
    }
});