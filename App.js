import { useEffect, useState } from 'react';
import { Provider } from 'react-native-paper'
import { useFonts } from 'expo-font';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CommonActions, NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon } from 'react-native-elements';
import { theme } from './src/theme';
import Button from './src/components/Button';

import * as Screens from './src/screens/index';
import { firebaseAuth, onAuthStateChanged, firebaseFirestore, doc, getDoc } from './config/firebase';

import User from './src/models/User.js';
import * as Global from './src/helpers/globals';

const customFont = {
	'Judson-Regular': require('./src/assets/fonts/Judson-Regular.ttf'),
	'Judson-Bold': require('./src/assets/fonts/Judson-Bold.ttf'),
	'Judson-Italic': require('./src/assets/fonts/Judson-Italic.ttf'),
	'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
	'Montserrat-SemiBold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
};

const MessagesStack = createNativeStackNavigator();
const MatchesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const MessagesStackScreen = () => {
	return (
		<MessagesStack.Navigator>
			<MessagesStack.Screen name="MessagesScreen" component={Screens.MessagesScreen} options={{headerShown: false}}/>
		</MessagesStack.Navigator>
	)
}

const MatchesStackScreen = () => {
	return (
		<MatchesStack.Navigator>
			<MatchesStack.Screen name="MatchesScreen" component={Screens.MatchesScreen} options={{headerShown: false}}/>
		</MatchesStack.Navigator>
	)
}

const ProfileStackScreen = () => {
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen name="ProfileScreen" component={Screens.ProfileScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="LoginScreen" component={Screens.LoginScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="RegisterScreen" component={Screens.RegisterScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="SettingsScreen" component={Screens.SettingsScreen} options={{headerShown: false}}/>
		</ProfileStack.Navigator>
	)
}

const CustomTabButton = ({ children, onPress }) => {
	return (
		<Button onPress={() => { onPress }}>
			{children}
		</Button>
	);
}

const Tab = createBottomTabNavigator();

export default function App({ navigation }) {
	const [loaded] = useFonts(customFont);
	let [auth, setAuth] = useState(false);
	let [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        const unsubscribed = onAuthStateChanged(firebaseAuth, async (user) => {
            if (user) {
				console.log('User is logged in');
				Global.userId = user.uid;
				Global.userName = user.displayName;
				Global.matchesLoaded = false;

                setAuth(true);

				console.log('User ID: ' + Global.userId);

				await getUserDocument(Global.userId);
            } else {
                setAuth(false);
				console.log('User is not logged in');
            }
        });

		const getUserDocument = async (id) => {
			const docRef = doc(firebaseFirestore, 'users', id);
			const docSnap = await getDoc(docRef);
		
			if (docSnap.exists()) {
				Global.userDocument = new User(docSnap.data());
				setDataLoaded(true);
			} else {
				console.log('No such document!');
				setDataLoaded(false);
			}
		};

		return unsubscribed;
    }, []);

    if (!loaded) {
        return null;
    } else {
        console.log('Font Loaded')
    }

	const MainStack = createNativeStackNavigator();
	let initialScreen = 'MainScreen';

	const MainStackScreen = () => {
		let screen = [
			{ screen: 'MainScreen', component: Screens.MainScreen },
			{ screen: 'SwipeScreen', component: Screens.SwipeScreen },
			{ screen: 'AccountSetupScreen', component: Screens.AccountSetupScreen },
		];

		if (auth) {
			if (Object.keys(Global.userDocument).length === 0) {
			  	initialScreen = 'AccountSetupScreen';
			} else {
			  	initialScreen = 'SwipeScreen';
			}
		  } else {
				initialScreen = 'MainScreen';
		  }

		screen.forEach((item, index) => {
			if (item.screen === initialScreen) {
				screen.splice(index, 1);
				screen.unshift(item);
			}
		});

		return (
			<MainStack.Navigator>
				{ screen.map((item, index) => { return <MainStack.Screen key={index} name={item.screen} component={item.component} options={{headerShown: false}}/> })}
			</MainStack.Navigator>
		)
	}

	let hideNavProp = auth ? 'flex' : 'none';
	
	return (
		<Provider theme={[theme]}>
			<NavigationContainer>
				<Tab.Navigator
					initialRouteName={initialScreen}
					screenOptions={({route}) => ({
						headerShown: false,
						tabBarShowLabel: false,
						tabBarItemStyle: {
							width: 50,
							height: 50,
						},
						tabBarStyle: {
							position: 'absolute',
							display: hideNavProp,
							borderTopEndRadius: 25,
							borderTopStartRadius: 25,
							backgroundColor: '#F6F6F6',
							height: 140,
							padding: 15,
							shadowColor: 'black',
							shadowOffset: { width: 0, height: 2 },
							shadowOpacity: 0.15,
							justifyContent: 'center',
							alignItems: 'center',

						},
					})}>

					<Tab.Screen name="Main" component={MainStackScreen} options={({ navigation }) => ({
						tabBarButton: (props) => (
							<TouchableOpacity style={styles.button} onPress={() => {
								navigation.reset({
									index: 0,
									routes: [{ name: 'SwipeScreen' }],
								});

								console.log('Resetting Main stack');

								navigation.navigate('SwipeScreen');
							}}>
								<Icon
									name="toggle-left"
									type="feather"
									size={40}
									style={styles.button}
								/>
							</TouchableOpacity>
						)
					})}/>	

					<Tab.Screen name="Messages" component={MessagesStackScreen} options={({ navigation }) => ({
						tabBarBadge: 3,
						tabBarBadgeStyle: {
							backgroundColor: '#121212',
							color: 'white',
							fontSize: 12,
							fontWeight: 'bold',
						},
						tabBarButton: (props) => (
							<TouchableOpacity style={styles.button} onPress={() => {
								navigation.reset({
									index: 0,
									routes: [{ name: 'MessagesScreen' }],
								});

								console.log('Resetting Message stack');

								navigation.navigate('Messages', {screen: 'MessagesScreen'});
							}}
							>
								<Icon
									name="message-square"
									type="feather"
									size={40}
									style={styles.button}
								/>
							</TouchableOpacity>
						),
					})}/>

					<Tab.Screen name="Matches" component={MatchesStackScreen} options={({ navigation }) => ({
						tabBarButton: (props) => (
							<TouchableOpacity style={styles.button} onPress={() => {
								navigation.reset({
									index: 0,
									routes: [{ name: 'MatchesScreen' }],
								});

								console.log('Resetting Matches stack');

								navigation.navigate('Matches', { screen: 'MatchesScreen' });
							}}>
								<Icon
									name="heart"
									type="feather"
									size={40}
									style={styles.button}
								/>
							</TouchableOpacity>
						)
					})}/>

					<Tab.Screen name="Profile" component={ProfileStackScreen} options={({ navigation }) => ({
						tabBarButton: (props) => (
							<TouchableOpacity style={styles.button} onPress={() => {
								navigation.reset({
									index: 0,
									routes: [{ name: 'ProfileScreen' }],
								});

								console.log('Resetting Profile stack');

								navigation.navigate('Profile', { screen: 'ProfileScreen' });
							}}>
								<Icon
									name="user"
									type="feather"
									size={40}
									style={styles.button}
								/>
							</TouchableOpacity>
						)
					})}/>
				</Tab.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'blue',

	},
    button: {
        padding: 10,
        borderRadius: 100,
    },
});