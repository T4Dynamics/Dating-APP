import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { Provider } from 'react-native-paper'
import { useFonts } from 'expo-font';

import { theme } from './src/theme'
import { MainScreen, LoginScreen, RegisterScreen, Dashboard, HomeScreen } from './src/screens';


const Stack = createStackNavigator();


const customFont = {
	'Judson-Regular': require('./src/assets/fonts/Judson-Regular.ttf'),
	'Judson-Bold': require('./src/assets/fonts/Judson-Bold.ttf'),
	'Judson-Italic': require('./src/assets/fonts/Judson-Italic.ttf'),
};

export default function App() {

	const [loaded] = useFonts(customFont);

    if (!loaded) {
        return null;
    } else {
        console.log('Font Loaded')
    }

	//if (custom) {
		return (
		<Provider theme={[theme]}>
			<NavigationContainer>
			<Stack.Navigator
				initialRouteName="MainScreen"
				screenOptions={{
				headerShown: false,
				}}
			>
				<Stack.Screen name="MainScreen" component={ MainScreen } />
				<Stack.Screen name="LoginScreen" component={ LoginScreen } />
				<Stack.Screen name="RegisterScreen" component={ RegisterScreen } />
				<Stack.Screen name="HomeScreen" component={ HomeScreen } />
				<Stack.Screen name="Dashboard" component={ Dashboard } />
			</Stack.Navigator>
			</NavigationContainer>
		</Provider>
		)
	//}
}
