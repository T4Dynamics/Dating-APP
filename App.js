import { Provider } from 'react-native-paper'
import { useFonts } from 'expo-font';

import { theme } from './src/theme'
import MainContainer from './src/screens/MainContainer'

const customFont = {
	'Judson-Regular': require('./src/assets/fonts/Judson-Regular.ttf'),
	'Judson-Bold': require('./src/assets/fonts/Judson-Bold.ttf'),
	'Judson-Italic': require('./src/assets/fonts/Judson-Italic.ttf'),
	'Montserrat-Regular': require('./src/assets/fonts/Montserrat-Regular.ttf'),
	'Montserrat-SemiBold': require('./src/assets/fonts/Montserrat-SemiBold.ttf'),
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
			<MainContainer />
		</Provider>
		)
	//}
}
