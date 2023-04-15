import { useEffect, useState } from 'react';
import { Provider } from 'react-native-paper'
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Icon } from 'react-native-elements';
import { theme } from './src/theme';

import * as Screens from './src/screens/index';
import { firebaseAuth, onAuthStateChanged } from './config/firebase';
import { getMatches } from './src/helpers/matches';

import * as Global from './src/helpers/globals'

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
		<ProfileStack.Navigator initialRouteName="ProfileScreen">
			<ProfileStack.Screen name="ProfileScreen" component={Screens.ProfileScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="LoginScreen" component={Screens.LoginScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="RegisterScreen" component={Screens.RegisterScreen} options={{headerShown: false}}/>
			<ProfileStack.Screen name="SettingsScreen" component={Screens.SettingsScreen} options={{headerShown: false}}/>
		</ProfileStack.Navigator>
	)
}

const Tab = createBottomTabNavigator();

export default function App() {
	const [loaded] = useFonts(customFont);
	let [auth, setAuth] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseAuth, user => {
            if (user) {
				console.log('User is logged in');
				Global.userId = user.uid;
				Global.userName = user.displayName;
				Global.matchesLoaded = false;
                setAuth(true);
            } else {
                setAuth(false);
				console.log('User is not logged in');
            }
        });
    
        return unsubscribe;
    }, []);

    if (!loaded) {
        return null;
    } else {
        console.log('Font Loaded')
    }

	const MainStack = createNativeStackNavigator();
	let initialScreen = 'MainScreen';

	const MainStackScreen = () => {
		let authScreen = ['MainScreen', 'SwipeScreen'];
		let screenComponents = [Screens.MainScreen, Screens.SwipeScreen];

		if (auth) {
			authScreen.reverse();
			screenComponents.reverse();
		}

		initialScreen = authScreen[0];

		return (
			<MainStack.Navigator>
				<MainStack.Screen name={authScreen[0]} component={screenComponents[0]} options={{headerShown: false}}/>
				<MainStack.Screen name={authScreen[1]} component={screenComponents[1]} options={{headerShown: false}}/>
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
						}
					})}>

					<Tab.Screen name="Main" component={MainStackScreen} options={{
						tabBarIcon: ({focused}) => (
							<Icon
								name="toggle-left"
								type="feather"
								size={30}
								color={focused ? 'white' : styles.button.primary}
								backgroundColor={focused ? '#121212' : undefined}
								style={styles.button}
							/>
						)
					}}/>	

					<Tab.Screen name="Messages" component={MessagesStackScreen} options={{
						tabBarBadge: 3,
						tabBarBadgeStyle: {
							backgroundColor: '#121212',
							color: 'white',
							fontSize: 12,
							fontWeight: 'bold',
						},
						tabBarIcon: ({focused}) => (
							<Icon
								name="message-square"
								type="feather"
								size={30}
								color={focused ? 'white' : styles.button.primary}
								backgroundColor={focused ? '#121212' : undefined}
								style={styles.button}
							/>
						)
						
					}}/>

					<Tab.Screen name="Matches" component={MatchesStackScreen} options={{
						tabBarIcon: ({focused}) => (
							<Icon
								name="heart"
								type="feather"
								size={30}
								color={focused ? 'white' : styles.button.primary}
								backgroundColor={focused ? '#121212' : undefined}
								style={styles.button}
							/>
						)
					}}/>

					<Tab.Screen name="Profile" component={ProfileStackScreen} options={{
						tabBarIcon: ({focused}) => (
							<Icon
								name="user"
								type="feather"
								size={30}
								color={focused ? 'white' : styles.button.primary}
								backgroundColor={focused ? '#121212' : undefined}
								style={styles.button}
							/>
						)
					}}/>
				</Tab.Navigator>
			</NavigationContainer>
		</Provider>
	);
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        borderRadius: 100,
    },
});
