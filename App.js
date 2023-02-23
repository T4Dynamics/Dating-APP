import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import { Provider } from 'react-native-paper'
import { theme } from './src/theme'
import { MainScreen, LoginScreen, RegisterScreen, Dashboard, MatchesScreen } from './src/screens';
//import firebaseHelper from "./src/helpers/firebaseHelper";

const Stack = createStackNavigator();
// const firebaseHelper = new firebaseHelper();

export default function App() {
	return (
	  <Provider theme={theme}>
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
			<Stack.Screen name="MatchesScreen" component={ MatchesScreen } />
			<Stack.Screen name="Dashboard" component={ Dashboard } />
		  </Stack.Navigator>
		</NavigationContainer>
	  </Provider>
	)
}
