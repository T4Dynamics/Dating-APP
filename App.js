import { useRef, useEffect, useReducer, useState } from 'react';

import { Provider } from 'react-native-paper'
import { useFonts } from 'expo-font';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { CommonActions, NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';

import Toast from 'react-native-toast-message';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon } from 'react-native-elements';
import { theme } from './src/theme';

import * as Screens from './src/screens/index';
import { firebaseAuth, onAuthStateChanged, firebaseFirestore, doc, getDoc } from './config/firebase';

import * as Global from './src/helpers/globals';

const customFont = {
	'Judson-Regular': require('./src/assets/fonts/Judson-Regular.ttf'),
	'Judson-Bold': require('./src/assets/fonts/Judson-Bold.ttf'),
	'Judson-Italic': require('./src/assets/fonts/Judson-Italic.ttf'),
	'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
	'Montserrat-SemiBold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
};

const initialState = {
	auth: false,
	initialScreen: 'MainScreen',
	fontsLoaded: false,
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_AUTH':
			return { ...state, auth: action.payload };
		case 'SET_INITIAL_SCREEN':
			return { ...state, initialScreen: action.payload };
		case 'SET_FONTS_LOADED':
			return { ...state, fontsLoaded: action.payload };
		default:
			return state;
	}
};

let showNavigation = false;

const MainStack = createNativeStackNavigator();
const MatchesStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const MainStackScreen = ({ initialScreen }) => {
	let screen = [
		{ screen: 'MainScreen', component: Screens.MainScreen },
		{ screen: 'SwipeScreen', component: Screens.SwipeScreen },
		{ screen: 'AccountSetupScreen', component: Screens.AccountSetupScreen },
	];

	screen.forEach((item, index) => {
		if (item.screen === initialScreen) {
			screen.splice(index, 1);
			screen.unshift(item);
		}
	});

	showNavigation = initialScreen === "MainScreen" ? false : true;

	return (
		<MainStack.Navigator>
			{ screen.map((item, index) => { return <MainStack.Screen key={index} name={item.screen} component={item.component} options={{headerShown: false}}/> })}
		</MainStack.Navigator>
	)
}

const MatchesStackScreen = () => {
	return (
		<MatchesStack.Navigator>
			<MatchesStack.Screen name="MatchesScreen" component={Screens.MatchesScreen} options={{headerShown: false}}/>
			<MatchesStack.Screen name="MessageScreen" component={Screens.MessageScreen} options={{headerShown: false}}/>
		</MatchesStack.Navigator>
	)
}

const ProfileStackScreen = () => {
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen name="ProfileScreen" component={Screens.ProfileScreen} options={{headerShown: false }}/>
			<ProfileStack.Screen name="LoginScreen" component={Screens.LoginScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="RegisterScreen" component={Screens.RegisterScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="ResetPassword" component={Screens.ResetPasswordScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="SettingsScreen" component={Screens.SettingsScreen} options={{headerShown: false}}/>
		</ProfileStack.Navigator>
	)
}

const Tab = createBottomTabNavigator();

export default function App() {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { auth, initialScreen, fontsLoaded } = state;
	
	const navigationRef = useRef();

	const [loaded] = useFonts(customFont);
  	const [appIsReady, setAppIsReady] = useState(false);

	useEffect(() => {
		if (!fontsLoaded && loaded) {
		 	dispatch({ type: 'SET_FONTS_LOADED', payload: true });
		 	setAppIsReady(true);
		}
	}, [loaded]);
	
	if (!appIsReady) {
		return null;
	}
	
	return (
		<Provider theme={[theme]}>
			<NavigationContainer ref={navigationRef}>
			<AuthHandler auth={auth} dispatch={dispatch} state={state} navigationRef={navigationRef} />
				<Tab.Navigator
					initialRouteName={initialScreen}
					screenOptions={({route}) => {
						const focusedScreen = getFocusedRouteNameFromRoute(route);
						const hiddenScreens = ['MainScreen', 'LoginScreen', 'RegisterScreen', 'ResetPasswordScreen', 'SettingsScreen', 'AccountSetupScreen', 'MessageScreen'];
						const hideNav = hiddenScreens.includes(focusedScreen);

						return {
							headerShown: false,
							tabBarShowLabel: false,
							tabBarItemStyle: {
								width: 50,
								height: 50,
							},
							tabBarStyle: {
								position: 'absolute',
								borderTopEndRadius: 25,
								borderTopStartRadius: 25,
								backgroundColor: '#F6F6F6',
								height: Platform.OS === 'ios' ? 140 : 100,
								padding: 15,
								shadowColor: 'black',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.15,
								justifyContent: 'center',
								alignItems: 'center',
								display: !showNavigation ? 'none' 
									: hideNav ? 'none' : 'flex',
							},
						}
					}}>

					<Tab.Screen name="Main" options={({ navigation, route }) => {

						return {
							tabBarButton: (props) => (
								<TouchableOpacity style={styles.button} onPress={() => {
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
						}
					}}>
						{() => <MainStackScreen initialScreen={initialScreen}/>}
					</Tab.Screen>

					<Tab.Screen name="Matches" component={MatchesStackScreen} options={({ navigation, route }) => {

						return {
							tabBarButton: (props) => (
								<TouchableOpacity style={styles.button} onPress={() => {
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
						}
					}}/>

					<Tab.Screen name="Profile" options={({ navigation, route }) => {
						return {
							tabBarButton: (props) => (
								<TouchableOpacity style={styles.button} onPress={() => {
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
						}
					}}>
						{ (props) => <ProfileStackScreen { ...props } /> }
					</Tab.Screen>
				</Tab.Navigator>
				<Toast />
			</NavigationContainer>
		</Provider>
	);
}

const AuthHandler = ({ dispatch, state, navigationRef }) => {
	const getUserDocument = async (id) => {
		return new Promise(async (resolve, reject) => {
			const docRef = doc(firebaseFirestore, 'users', id);
			const docSnap = await getDoc(docRef);
		
			if (docSnap.exists()) {
				await Global.storeClientData('@user_document', JSON.stringify(docSnap.data()));
				resolve();
			} else {
				console.log('No such document!');
				reject();
			}
		});
	};

	const getInitialScreen = async (auth) => {
		let initialScreen;

		if (auth) {
			const userDocument = await Global.getClientDocument();

			if (!userDocument || Object.keys(userDocument).length === 0) {
				initialScreen = 'AccountSetupScreen';
			} else {
				initialScreen = 'SwipeScreen';
			}
		} else {
			initialScreen = 'MainScreen';
		}

		return initialScreen;
	};

	const resetNavigation = (initial) => {
		navigationRef.current.dispatch(
		  	CommonActions.reset({
				index: 0,
				routes: [{ name: initial }],
		  	})
		);
	};

	const [currentUser, setCurrentUser] = useState(null);

	useEffect(() => {
		const unsubscribed = onAuthStateChanged(firebaseAuth, async (user) => {
			if (user) {
				dispatch({ type: "SET_AUTH", payload: true });
				setCurrentUser(user);
			} else {
				dispatch({ type: "SET_AUTH", payload: false });
			}
		});
	
		return () => unsubscribed();
	}, [dispatch]);
  
	useEffect(() => {
		if (currentUser) {
			const handleUserLoggedIn = async (user) => {
				await Global.storeClientData("@user_id", user.uid);
				await Global.storeClientData("@user_name", user.displayName);
				await Global.storeClientData("@matches_loaded", "false");
			
				const userId = await Global.getClientData("@user_id");
			
				await getUserDocument(userId)
				.then(() => getInitialScreen(state.auth))
				.then((initial) => {
					dispatch({ type: "SET_INITIAL_SCREEN", payload: initial });
					resetNavigation(initial);
				})
				.catch(() => {
					console.log("No user document found, navigating to AccountSetupScreen");
					dispatch({ type: "SET_INITIAL_SCREEN", payload: "AccountSetupScreen" });
					resetNavigation("AccountSetupScreen");
				});
			};
		
			handleUserLoggedIn(currentUser);
		}
	}, [currentUser, dispatch, state.auth]);

	return <></>;
};


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