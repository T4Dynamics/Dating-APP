import React, { useEffect } from 'react';

import Background from '../components/Background';
import Button from '../components/Button';

import { font, theme } from '../theme';

import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

import { firebaseAuth, onAuthStateChanged } from '../../firebase';

import { getMatches } from '../helpers/matches';

export default function MainScreen({ navigation }) {

    const route = useRoute();
    const currentSlide = route.params ? route.params.currentSlide : 1;

    const [auth, setAuth] = React.useState(true);

    //check user is logged in and navigate to HomeScreen
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
                setAuth(true);
                getMatches();
                return navigation.navigate('HomeScreen');
            } else {
                setAuth(false);
            }
        });
    
        return unsubscribe;
    }, []);

    /*
    return (
        <Background>
            <View style={styles.viewTop}>
                <Text style={{fontFamily: test.font}}>Test</Text>
            </View>
        </Background>
    );
    */

    return (
        content(auth, currentSlide, navigation)
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontFamily: theme.font.bold
    },
    button: {
        borderRadius: 100,
        width: '25%'
    },
    description: {
        fontSize: 15,
        textAlign: 'center',
        fontFamily: theme.font.regular
    },
    slide: {
        width: '25%',
        height: '10%',
        borderRadius: 100,
        backgroundColor: 'grey',
    },
    viewTop: {
        height: '60%',
        width: '100%',
        backgroundColor: theme.colors.primary,
    },
    viewBot: {
        width: '80%',
        height: '40%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    authButton: {
        width: '45%',
        height: '45%',
        alignItems: 'center',
        justifyContent: 'center',
    },

})

const displayData = {
    1: {
        title: 'Dating with Personality',
        description: 'Swipe peoples Interests, passions and hobbies to find your perfect match, rather than just their looks.',
    },
    2: {
        title: 'Being attractive to within',
        description: 'Add your hobbies, interests and get swiping. Once you match, you\'ll gain access to each others profiles and pictures',
    },
    3: {
        title: 'Fix up the dulll conversation',
        description: 'Our chatbot Lovebot will help you get the conversation going, and help you find out more about your match',
    },
    4: {
        title: 'Find your perfect match',
        description: 'Start some meaningful conversations.',
    }
}

const preMain = (currentSlide, navigation) => {
    return (
        <View style={styles.container}>
            <View 
                style={[
                styles.slide,
                { backgroundColor: currentSlide >= 1 ? theme.colors.primary : theme.colors.accent }
                ]}
            >
                <Text> </Text>
            </View>
            <View 
                style={[
                styles.slide,
                { backgroundColor: currentSlide >= 2 ? theme.colors.primary : theme.colors.accent }
                ]}
            >
                <Text> </Text>
            </View>
            <View 
                style={[
                styles.slide,
                { backgroundColor: currentSlide >= 3 ? theme.colors.primary : theme.colors.accent }
                ]}
            >
                <Text> </Text>
            </View>
            <View>
                <Button 
                    mode="contained"
                    style={styles.button}
                    onPress={() => navigation.navigate('MainScreen', { currentSlide: currentSlide + 1 })}
                >
                    →
                </Button>
            </View>
        </View>
    )
}

const main = (navigation) => {
    return (
        <View style={styles.container}>
            <Button
                style={styles.authButton}
                mode="outlined"
                onPress={() => navigation.navigate('LoginScreen')}
            >
                Login
            </Button>

            <Button
                style={styles.authButton}
                mode="contained"
                onPress={() => navigation.navigate('RegisterScreen')}
            >
                Register
            </Button>
        </View>
    )
}

const content = (auth, currentSlide, navigation) => {

    if (auth) {
        return (
            <View style={{height: '100%', width: '100%'}}>
                <Text>Slider</Text>
            </View>   
        )   
    }

    return (
        <Background>
            <View style={styles.viewTop} />
            <View style={styles.viewBot}>
                <Text style={[styles.title]}>{displayData[currentSlide]["title"]}{"\n"}</Text>

                <Text style={styles.description}>{displayData[currentSlide]["description"]}</Text>
                
                {currentSlide !== 4 ? preMain(currentSlide, navigation) : main(navigation)}
            </View>
        </Background>
    )
}


