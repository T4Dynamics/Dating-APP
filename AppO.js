import { Provider } from 'react-native-paper'
import { useFonts } from 'expo-font';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { theme } from './src/theme'

const customFont = {
	'Judson-Regular': require('./src/assets/fonts/Judson-Regular.ttf'),
	'Judson-Bold': require('./src/assets/fonts/Judson-Bold.ttf'),
	'Judson-Italic': require('./src/assets/fonts/Judson-Italic.ttf'),
	'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
	'Montserrat-SemiBold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
};

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"

import { Icon } from 'react-native-elements'

//const Tab = createBottomTabNavigator();


import SwipeScreen from './src/screens/SwipeScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MainScreen from './src/screens/MainScreen';

export default function App() {
	const [loaded] = useFonts(customFont);

    if (!loaded) {
        return null;
    } else {
        console.log('Font Loaded')
    }

	return (
		<Provider theme={[theme]}>
			<NavigationContainer>
				<Tab.Navigator
					initialRouteName="SwipeScreen"
					screenOptions={({route}) => ({
						headerShown: false,
						tabBarShowLabel: false,
						tabBarItemStyle: {
							width: 50,
							height: 50,
						},
						tabBarStyle: {
							position: 'absolute',
							//display: 'block',
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

					<Tab.Screen name="SwipeScreen" component={SwipeScreen} options={{
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
					<Tab.Screen name="MessagesScreen" component={MessagesScreen} options={{
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
					<Tab.Screen name="MatchesScreen" component={MatchesScreen} options={{
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
					<Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{
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
